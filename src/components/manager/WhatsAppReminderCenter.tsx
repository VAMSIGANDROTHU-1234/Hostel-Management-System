import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Tenant, WhatsAppLog, WhatsAppMessageType, WhatsAppTemplate } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Table, Column } from '../ui/Table';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { WhatsAppTemplateModal } from './WhatsAppTemplateModal';
import { WhatsAppCustomModal } from './WhatsAppCustomModal';
import { SmartReminderEngineCard } from './SmartReminderEngineCard';
import { ReminderAnalyticsCards } from './ReminderAnalyticsCards';
import { parseWhatsAppTemplate, generateWhatsAppWebLink } from '../../services/whatsappService';
import { useToast } from '../ui/Toast';
import {
  MessageSquare,
  Send,
  RefreshCw,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Inbox
} from 'lucide-react';

export const WhatsAppReminderCenter: React.FC = () => {
  const {
    tenants,
    payments,
    settings,
    whatsappLogs,
    whatsappTemplates,
    smartReminderBuckets,
    sendWhatsAppReminder,
    sendBulkWhatsAppReminders,
    resendFailedWhatsApp,
  } = useData();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'today' | 'overdue' | 'sent' | 'failed' | 'templates'>('upcoming');

  const [searchTerm, setSearchTerm] = useState('');
  const [floorFilter, setFloorFilter] = useState('all');

  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [targetTenantForCustom, setTargetTenantForCustom] = useState<string | undefined>(undefined);
  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { dueIn2Days, dueTomorrow, dueToday, overdue1to7, overdueMoreThan7 } = smartReminderBuckets;

  const failedLogs = (whatsappLogs || []).filter(l => l.status === 'failed');

  // Search & Filter Helper
  const filterTenantList = (list: Tenant[]) => {
    return (list || []).filter(t => {
      if (!t || !t.user) return false;
      const matchesSearch =
        !searchTerm.trim() ||
        t.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user.phone.includes(searchTerm) ||
        (t.room && t.room.room_number.includes(searchTerm));

      const matchesFloor = floorFilter === 'all' || (t.room && String(t.room.floor) === floorFilter);
      return matchesSearch && matchesFloor;
    });
  };

  const filteredUpcoming = filterTenantList(dueIn2Days);
  const filteredToday = filterTenantList(dueToday);
  const filteredOverdue = filterTenantList([...overdue1to7, ...overdueMoreThan7]);

  // Calculate Overdue Days from Payment Due Date
  const getOverdueDays = (tenant: Tenant) => {
    const pay = (payments || []).find(p => p.tenant_id === tenant.id && (p.status === 'pending' || p.status === 'overdue'));
    if (!pay || !pay.due_date) return 1;
    const dueDate = new Date(pay.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));
  };

  const handleSendSingle = async (tenant: Tenant, messageType: WhatsAppMessageType, categoryKey: string) => {
    await sendWhatsAppReminder(tenant.id, messageType);

    // Look up template text
    let tplName = 'Rent Due in 2 Days';
    if (categoryKey === 'dueTomorrow') tplName = 'Rent Due Tomorrow';
    if (categoryKey === 'dueToday') tplName = 'Rent Due Today';
    if (categoryKey === 'overdue1to7') tplName = 'Overdue 1 to 7 Days';
    if (categoryKey === 'overdueMoreThan7') tplName = 'Overdue Over 7 Days';

    const tplObj = (whatsappTemplates || []).find(t => t.name === tplName) || whatsappTemplates[0];

    const daysCount = getOverdueDays(tenant);
    const pay = (payments || []).find(p => p.tenant_id === tenant.id && (p.status === 'pending' || p.status === 'overdue'));
    const dueDateStr = pay?.due_date || new Date().toISOString().split('T')[0];

    const renderedText = parseWhatsAppTemplate(tplObj.template_body, {
      tenantName: tenant.user?.name || 'Tenant',
      amount: tenant.monthly_rent,
      dueDate: dueDateStr,
      days: daysCount,
      roomNumber: tenant.room?.room_number || 'N/A',
      bedNumber: tenant.bed?.bed_number || 'N/A',
      hostelName: settings.hostel_name,
    });

    const link = generateWhatsAppWebLink(tenant.user?.phone || '', renderedText);
    window.open(link, '_blank');

    showToast(`WhatsApp reminder opened for ${tenant.user?.name}`, 'success');
  };

  const handleBulkSend = async (messageType: WhatsAppMessageType, list: Tenant[]) => {
    if (list.length === 0) return;
    setIsSendingBulk(true);
    await sendBulkWhatsAppReminders(list, messageType);
    setIsSendingBulk(false);
    showToast(`Sent ${list.length} WhatsApp reminders successfully!`, 'success');
  };

  const handleResendFailed = async () => {
    setIsResending(true);
    const count = await resendFailedWhatsApp();
    setIsResending(false);
    showToast(`Resent ${count} failed messages.`, 'info');
  };

  const logColumns: Column<WhatsAppLog>[] = [
    {
      key: 'tenant',
      header: 'Recipient Tenant',
      sortable: true,
      render: l => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100">{l.tenant?.user?.name || 'Tenant'}</div>
          <div className="text-xs text-slate-400">{l.phone}</div>
        </div>
      ),
    },
    {
      key: 'message_type',
      header: 'Category',
      render: l => (
        <Badge variant={l.message_type === 'overdue' ? 'danger' : l.message_type === 'due' ? 'warning' : 'crimson'}>
          {l.message_type.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'message_text',
      header: 'Dispatched Content',
      render: l => <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm truncate font-mono">{l.message_text}</p>,
    },
    {
      key: 'sent_at',
      header: 'Dispatched At',
      sortable: true,
      render: l => formatDateTime(l.sent_at),
    },
    {
      key: 'status',
      header: 'Delivery Status',
      render: l => (
        <div>
          <Badge variant={l.status === 'delivered' || l.status === 'read' ? 'success' : l.status === 'sent' ? 'warning' : 'danger'}>
            {l.status.toUpperCase()}
          </Badge>
          {l.error_message && <div className="text-[10px] text-red-500 font-semibold mt-0.5 max-w-xs truncate">{l.error_message}</div>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: l => (
        <button
          onClick={() => {
            const link = generateWhatsAppWebLink(l.phone, l.message_text);
            window.open(link, '_blank');
          }}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-charcoal-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-800"
          title="Open in WhatsApp Web"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-red-600" /> WhatsApp Reminder Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">Smart 5-tier categorization engine, delivery analytics, and Meta Cloud API dispatches.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {failedLogs.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              isLoading={isResending}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={handleResendFailed}
            >
              Resend Failed ({failedLogs.length})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Send className="w-4 h-4" />}
            onClick={() => {
              setTargetTenantForCustom(undefined);
              setIsCustomModalOpen(true);
            }}
          >
            Send Custom Message
          </Button>
        </div>
      </div>

      {/* Reminder Analytics Metric Cards */}
      <ReminderAnalyticsCards />

      {/* 5-Tier Smart WhatsApp Reminder Engine */}
      <SmartReminderEngineCard />

      {/* Search & Filter Control Bar */}
      <Card className="p-4 border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search reminder queue by tenant name, phone, room..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <Select
              value={floorFilter}
              onChange={e => setFloorFilter(e.target.value)}
              options={[
                { label: 'All Floors', value: 'all' },
                { label: 'Floor 1', value: '1' },
                { label: 'Floor 2', value: '2' },
                { label: 'Floor 3', value: '3' },
              ]}
              className="w-36"
            />
          </div>
        </div>
      </Card>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-charcoal-800 pb-2 overflow-x-auto">
        {[
          { key: 'upcoming', label: `Due in 2 Days (${dueIn2Days.length})` },
          { key: 'today', label: `Due Today (${dueToday.length})` },
          { key: 'overdue', label: `Overdue (${overdue1to7.length + overdueMoreThan7.length})` },
          { key: 'sent', label: `Sent Log (${whatsappLogs.length})` },
          { key: 'failed', label: `Failed Queue (${failedLogs.length})` },
          { key: 'templates', label: 'Message Templates' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-glow-red'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-charcoal-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: UPCOMING REMINDERS (DUE IN 2 DAYS) */}
      {activeTab === 'upcoming' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rent Due in 2 Days ({filteredUpcoming.length})</CardTitle>
            <Button
              size="sm"
              variant="primary"
              isLoading={isSendingBulk}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              onClick={() => handleBulkSend('upcoming', filteredUpcoming)}
              disabled={filteredUpcoming.length === 0}
            >
              Send to All Due in 2 Days
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredUpcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUpcoming.map(tenant => (
                  <div key={tenant.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tenant.user?.name}</h4>
                      <p className="text-xs text-slate-500">Room {tenant.room?.room_number} ({tenant.bed?.bed_number}) • {tenant.user?.phone}</p>
                      <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1">Rent: {formatCurrency(tenant.monthly_rent)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      onClick={() => handleSendSingle(tenant, 'upcoming', 'dueIn2Days')}
                    >
                      Send WhatsApp
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400 border border-dashed rounded-2xl flex flex-col items-center justify-center space-y-2">
                <Inbox className="w-8 h-8 text-slate-400" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">No reminders available.</span>
                <p>All active tenants are clear or paid for this bucket.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 2: TODAY'S REMINDERS */}
      {activeTab === 'today' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rent Due Today ({filteredToday.length})</CardTitle>
            <Button
              size="sm"
              variant="primary"
              isLoading={isSendingBulk}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              onClick={() => handleBulkSend('due', filteredToday)}
              disabled={filteredToday.length === 0}
            >
              Send to All Due Today ({filteredToday.length})
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredToday.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredToday.map(tenant => (
                  <div key={tenant.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tenant.user?.name}</h4>
                      <p className="text-xs text-slate-500">Room {tenant.room?.room_number} • {tenant.user?.phone}</p>
                      <p className="text-xs font-bold text-amber-500 mt-1">Rent: {formatCurrency(tenant.monthly_rent)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      onClick={() => handleSendSingle(tenant, 'due', 'dueToday')}
                    >
                      Send Due Alert
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400 border border-dashed rounded-2xl flex flex-col items-center justify-center space-y-2">
                <Inbox className="w-8 h-8 text-slate-400" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">No reminders available.</span>
                <p>No rent payments due today.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: OVERDUE REMINDERS */}
      {activeTab === 'overdue' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Overdue Rent Alerts ({filteredOverdue.length})</CardTitle>
            <Button
              size="sm"
              variant="danger"
              isLoading={isSendingBulk}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              onClick={() => handleBulkSend('overdue', filteredOverdue)}
              disabled={filteredOverdue.length === 0}
            >
              Send Overdue Notices
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredOverdue.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOverdue.map(tenant => {
                  const daysOverdue = getOverdueDays(tenant);
                  const isCritical = daysOverdue > 7;

                  return (
                    <div key={tenant.id} className="p-4 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tenant.user?.name}</h4>
                        <p className="text-xs text-slate-500">Room {tenant.room?.room_number} • {tenant.user?.phone}</p>
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1">
                          Overdue by {daysOverdue} Day(s) • Rent: {formatCurrency(tenant.monthly_rent)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="danger"
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                        onClick={() => handleSendSingle(tenant, 'overdue', isCritical ? 'overdueMoreThan7' : 'overdue1to7')}
                      >
                        Send Notice
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400 border border-dashed rounded-2xl flex flex-col items-center justify-center space-y-2">
                <Inbox className="w-8 h-8 text-slate-400" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">No reminders available.</span>
                <p>No overdue rent accounts currently.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 4: SENT MESSAGES LOG */}
      {activeTab === 'sent' && (
        <Table columns={logColumns} data={whatsappLogs} pageSize={8} searchKey="phone" />
      )}

      {/* TAB 5: FAILED MESSAGES QUEUE */}
      {activeTab === 'failed' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Failed Message Queue ({failedLogs.length})
            </CardTitle>
            <Button
              size="sm"
              variant="danger"
              isLoading={isResending}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleResendFailed}
              disabled={failedLogs.length === 0}
            >
              Resend All Failed Messages
            </Button>
          </CardHeader>
          <CardContent>
            {failedLogs.length > 0 ? (
              <Table columns={logColumns} data={failedLogs} pageSize={8} />
            ) : (
              <div className="p-12 text-center text-xs text-slate-400 border border-dashed rounded-2xl flex flex-col items-center justify-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">No Failed Messages</span>
                <p>All WhatsApp reminders have been dispatched successfully.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 6: EDIT MESSAGE TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(whatsappTemplates || []).map(template => (
            <Card key={template.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-charcoal-800 pb-3 mb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{template.name}</h4>
                  <Badge variant="crimson">{template.category}</Badge>
                </div>
                <pre className="text-xs font-mono bg-slate-50 dark:bg-charcoal-800/80 p-3 rounded-xl whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {template.template_body}
                </pre>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => setSelectedTemplate(template)}
              >
                Edit Template Text
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <WhatsAppTemplateModal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        template={selectedTemplate}
      />

      <WhatsAppCustomModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        initialTenantId={targetTenantForCustom}
      />
    </div>
  );
};
