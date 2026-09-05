import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { parseWhatsAppTemplate, generateWhatsAppWebLink } from '../../services/whatsappService';
import { MessageSquare, Sparkles, Send, Gift, PartyPopper, HeartHandshake, FileText, CalendarClock } from 'lucide-react';
import { WhatsAppMessageType } from '../../types';

export const WhatsAppAutomationCenter: React.FC = () => {
  const { tenants, settings, sendCustomWhatsApp } = useData();
  const activeTenants = tenants.filter(t => t.status === 'active');

  const [selectedCategory, setSelectedCategory] = useState<'welcome' | 'birthday' | 'festival' | 'instructions' | null>(null);
  const [targetTenantId, setTargetTenantId] = useState(activeTenants[0]?.id || '');
  const [customBody, setCustomBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const automatedCategories = [
    {
      key: 'welcome' as const,
      title: 'Tenant Welcome Message',
      subtitle: 'Send automated onboarding greeting & Wi-Fi details',
      icon: HeartHandshake,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      defaultTemplate: `Hello {Tenant Name},\n\nWelcome to {Hostel Name}! We are thrilled to have you with us.\n\nYour Room: {Room Number}\nYour Bed: {Bed Number}\nWi-Fi Network: HavenStays_5G\nWi-Fi Password: StayConnected@2026\n\nPlease reach out if you need any assistance!\n\nBest regards,\nHostel Management`,
    },
    {
      key: 'instructions' as const,
      title: 'Move-in Rules & Guidelines',
      subtitle: 'Hostel rules, gate timings, and mess hours',
      icon: FileText,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      defaultTemplate: `Hello {Tenant Name},\n\nHere are important move-in guidelines for {Hostel Name}:\n\n1. Gate Closure: 10:30 PM daily\n2. Mess Timings: Breakfast (8-10 AM), Dinner (8-10 PM)\n3. Quiet Hours: Post 11:00 PM\n4. Visitors allowed in lounge till 8:00 PM\n\nHave a pleasant stay!`,
    },
    {
      key: 'festival' as const,
      title: 'Festival & Holiday Greetings',
      subtitle: 'Broadcast festive wishes to all active tenants',
      icon: PartyPopper,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      defaultTemplate: `Hello {Tenant Name},\n\nWishing you and your family a joyous, happy, and prosperous festival from all of us at {Hostel Name}! 🎉✨\n\nEnjoy the celebrations!\nHostel Management`,
    },
    {
      key: 'birthday' as const,
      title: 'Birthday Greetings',
      subtitle: 'Personalized birthday wish & special treat note',
      icon: Gift,
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      defaultTemplate: `Happy Birthday {Tenant Name}! 🎂🎈\n\nMay your year ahead be filled with happiness, success, and high achievements! Have a wonderful day from team {Hostel Name}!`,
    },
  ];

  const handleOpenModal = (catKey: 'welcome' | 'birthday' | 'festival' | 'instructions') => {
    const cat = automatedCategories.find(c => c.key === catKey);
    if (!cat) return;
    setSelectedCategory(catKey);
    setCustomBody(cat.defaultTemplate);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTenantId || !customBody.trim()) return;

    const tenant = tenants.find(t => t.id === targetTenantId);
    if (!tenant) return;

    const rendered = parseWhatsAppTemplate(customBody, {
      tenantName: tenant.user?.name || 'Tenant',
      amount: tenant.monthly_rent,
      dueDate: new Date().toISOString().split('T')[0],
      roomNumber: tenant.room?.room_number || 'N/A',
      bedNumber: tenant.bed?.bed_number || 'N/A',
      hostelName: settings.hostel_name,
    });

    setIsSending(true);
    await sendCustomWhatsApp(targetTenantId, rendered);
    setIsSending(false);
    setSelectedCategory(null);
  };

  return (
    <Card className="border-red-600/20 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600" /> WhatsApp Automated Communications Suite
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Send welcome kits, move-in instructions, birthday wishes, and festival greetings.</p>
        </div>
        <Badge variant="crimson">4 Automated Flows</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {automatedCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                onClick={() => handleOpenModal(cat.key)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700 cursor-pointer hover:border-red-500/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className={`w-10 h-10 rounded-2xl border ${cat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{cat.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.subtitle}</p>
                </div>

                <Button size="sm" variant="outline" leftIcon={<Send className="w-3.5 h-3.5" />}>
                  Dispatch Flow
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Dispatch Modal */}
      <Modal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        title="Dispatch WhatsApp Automated Communication"
        maxWidth="md"
      >
        <form onSubmit={handleSend} className="space-y-4">
          <Select
            label="Target Recipient Tenant *"
            value={targetTenantId}
            onChange={e => setTargetTenantId(e.target.value)}
            options={activeTenants.map(t => ({
              label: `${t.user?.name || 'Tenant'} (${t.user?.phone}) - Room ${t.room?.room_number}`,
              value: t.id,
            }))}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              WhatsApp Message Content (Supports Placeholders)
            </label>
            <textarea
              rows={7}
              value={customBody}
              onChange={e => setCustomBody(e.target.value)}
              className="w-full bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200 dark:border-charcoal-700 rounded-xl p-3.5 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-charcoal-800">
            <Button type="button" variant="secondary" onClick={() => setSelectedCategory(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSending} leftIcon={<Send className="w-4 h-4" />}>
              Send WhatsApp Message
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
