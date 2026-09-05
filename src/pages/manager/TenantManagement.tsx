import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Tenant } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate, maskIdNumber } from '../../utils/formatters';
import { TenantProvisionModal } from '../../components/manager/TenantProvisionModal';
import { TenantProfileDrawer } from '../../components/manager/TenantProfileDrawer';
import { IdentityDocumentViewerModal } from '../../components/manager/IdentityDocumentViewerModal';
import { generateWhatsAppWebLink } from '../../services/whatsappService';
import {
  Users,
  Search,
  Plus,
  Filter,
  FileSpreadsheet,
  Phone,
  MessageSquare,
  Building2,
  BedDouble,
  ShieldCheck,
  UserCheck,
  Eye,
  FileText,
  AlertCircle,
  Download
} from 'lucide-react';
import { exportTenantsToCSV, exportTenantsToExcel } from '../../utils/exportUtils';

export const TenantManagement: React.FC = () => {
  const { tenants, rooms, vacateBed } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'vacated'>('active');

  // Modal / Drawer states
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [selectedProfileTenant, setSelectedProfileTenant] = useState<Tenant | null>(null);
  const [selectedIdentityViewerTenant, setSelectedIdentityViewerTenant] = useState<Tenant | null>(null);

  // Filter tenants
  const filteredTenants = (tenants || []).filter(t => {
    const matchesSearch =
      !searchTerm.trim() ||
      t.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user?.phone.includes(searchTerm) ||
      t.room?.room_number.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: Column<Tenant>[] = [
    {
      key: 'tenant',
      header: 'Tenant Name & Info',
      render: t => (
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setSelectedProfileTenant(t)}
        >
          <img
            src={t.live_photo_url || t.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
            alt={t.user?.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-charcoal-700"
          />
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors">
              {t.user?.name}
            </div>
            <div className="text-[11px] text-slate-400">{t.user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'accommodation',
      header: 'Room & Bed',
      render: t => (
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          Room {t.room?.room_number || 'N/A'}
          <span className="text-[11px] text-slate-400 block font-normal">Bed {t.bed?.bed_number || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'id_proof',
      header: 'Identity Document',
      render: t => {
        const masked = maskIdNumber(t.id_type, t.id_proof_number || t.masked_id_number);
        const hasDoc = !!t.id_proof_url;
        return (
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{masked}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {hasDoc ? `${(t.id_type || 'aadhaar')} Verified` : 'No document uploaded'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'joining_date',
      header: 'Joining Date',
      render: t => formatDate(t.joining_date),
    },
    {
      key: 'rent',
      header: 'Monthly Rent',
      render: t => <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(t.monthly_rent)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: t => (
        <Badge variant={t.status === 'active' ? 'success' : 'neutral'}>
          {t.status.toUpperCase()} {t.is_archived ? '(ARCHIVED)' : ''}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: t => (
        <div className="flex items-center gap-2">
          {/* View Profile Button (Opens Identity Document Viewer) */}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Eye className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
            onClick={e => {
              e.stopPropagation();
              setSelectedIdentityViewerTenant(t);
            }}
          >
            Identity Proof
          </Button>

          <button
            onClick={e => {
              e.stopPropagation();
              const link = generateWhatsAppWebLink(t.user?.phone || '', `Hi ${t.user?.name},\nGreeting from Hostel Management.`);
              window.open(link, '_blank');
            }}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-charcoal-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-800"
            title="Chat via WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" /> Tenants Directory & Identity Storage
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage active occupants, view verified identity proofs, provision accounts, and track room allocations.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
            onClick={() => exportTenantsToExcel(tenants)}
          >
            Export Excel
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4 text-indigo-500" />}
            onClick={() => exportTenantsToCSV(tenants)}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsProvisionModalOpen(true)}
          >
            Provision New Tenant
          </Button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <Card className="p-4 border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by tenant name, email, phone, room number..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              options={[
                { label: 'Active Occupants', value: 'active' },
                { label: 'Vacated Tenants', value: 'vacated' },
                { label: 'All Records', value: 'all' },
              ]}
              className="w-40"
            />
          </div>
        </div>
      </Card>

      {/* Tenants Data Table */}
      <Card className="border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs">
        <Table
          columns={columns}
          data={filteredTenants}
          pageSize={10}
          searchKey="user.name"
          onRowClick={t => setSelectedProfileTenant(t)}
        />
      </Card>

      {/* Modals & Drawers */}
      <TenantProvisionModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
      />

      <TenantProfileDrawer
        isOpen={!!selectedProfileTenant}
        onClose={() => setSelectedProfileTenant(null)}
        tenant={selectedProfileTenant}
      />

      {/* Dedicated Identity Document Viewer Modal */}
      <IdentityDocumentViewerModal
        isOpen={!!selectedIdentityViewerTenant}
        onClose={() => setSelectedIdentityViewerTenant(null)}
        tenant={selectedIdentityViewerTenant}
      />
    </div>
  );
};
