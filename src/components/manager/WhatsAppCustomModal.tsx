import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { generateWhatsAppWebLink } from '../../services/whatsappService';
import { Send, ExternalLink, MessageSquare } from 'lucide-react';

interface WhatsAppCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTenantId?: string;
}

export const WhatsAppCustomModal: React.FC<WhatsAppCustomModalProps> = ({
  isOpen,
  onClose,
  initialTenantId,
}) => {
  const { tenants, sendCustomWhatsApp } = useData();
  const activeTenants = tenants.filter(t => t.status === 'active');

  const [tenantId, setTenantId] = useState(initialTenantId || activeTenants[0]?.id || '');
  const [customText, setCustomText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedTenant = tenants.find(t => t.id === tenantId);

  const handleSendAPI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !customText.trim()) return;

    setIsSending(true);
    await sendCustomWhatsApp(tenantId, customText);
    setIsSending(false);
    setCustomText('');
    onClose();
  };

  const handleOpenWebLink = () => {
    if (!selectedTenant || !customText.trim()) return;
    const link = generateWhatsAppWebLink(selectedTenant.user?.phone || '', customText);
    window.open(link, '_blank');
    sendCustomWhatsApp(tenantId, customText);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Custom WhatsApp Message"
      description="Compose a custom message and dispatch directly to the tenant's WhatsApp."
      maxWidth="md"
    >
      <form onSubmit={handleSendAPI} className="space-y-4">
        <Select
          label="Select Recipient Tenant *"
          value={tenantId}
          onChange={e => setTenantId(e.target.value)}
          options={activeTenants.map(t => ({
            label: `${t.user?.name || 'Tenant'} (${t.user?.phone || 'N/A'}) - Room ${t.room?.room_number || 'N/A'}`,
            value: t.id,
          }))}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Custom Message Body *
          </label>
          <textarea
            rows={5}
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="Type your custom WhatsApp message here..."
            className="w-full bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200 dark:border-charcoal-700 rounded-xl p-3.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-charcoal-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            leftIcon={<ExternalLink className="w-4 h-4" />}
            onClick={handleOpenWebLink}
          >
            Open in WhatsApp Web
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isSending}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Dispatch Message
          </Button>
        </div>
      </form>
    </Modal>
  );
};
