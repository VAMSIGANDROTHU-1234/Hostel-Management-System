import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { UserCheck, Phone, FileText, User } from 'lucide-react';

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitorModal: React.FC<VisitorModalProps> = ({ isOpen, onClose }) => {
  const { tenants, checkInVisitor } = useData();

  const activeTenants = tenants.filter(t => t.status === 'active');

  const [tenantId, setTenantId] = useState(activeTenants[0]?.id || '');
  const [visitorName, setVisitorName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !visitorName || !phone || !purpose) return;

    checkInVisitor({
      tenant_id: tenantId,
      visitor_name: visitorName,
      phone,
      purpose,
    });

    setVisitorName('');
    setPhone('');
    setPurpose('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Visitor Check-In Log"
      description="Register a new visitor entry for a tenant."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Host Tenant *"
          value={tenantId}
          onChange={e => setTenantId(e.target.value)}
          options={activeTenants.map(t => ({
            label: `${t.user?.name || 'Tenant'} (Room ${t.room?.room_number || 'N/A'})`,
            value: t.id,
          }))}
        />

        <Input
          label="Visitor Full Name *"
          value={visitorName}
          onChange={e => setVisitorName(e.target.value)}
          placeholder="e.g. Suresh Kumar"
          leftIcon={<User className="w-4 h-4 text-slate-400" />}
          required
        />

        <Input
          label="Visitor Contact Phone *"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+91 99887 76655"
          leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
          required
        />

        <Input
          label="Purpose of Visit *"
          value={purpose}
          onChange={e => setPurpose(e.target.value)}
          placeholder="e.g. Family Visit / Document Delivery"
          leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
          required
        />

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" leftIcon={<UserCheck className="w-4 h-4" />}>
            Check-In Visitor
          </Button>
        </div>
      </form>
    </Modal>
  );
};
