import React, { useState, useEffect } from 'react';
import { Tenant, Room } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { User, Phone, FileText, ArrowRightLeft, ShieldAlert } from 'lucide-react';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  mode: 'edit' | 'transfer' | 'idproof';
}

export const TenantModal: React.FC<TenantModalProps> = ({
  isOpen,
  onClose,
  tenant,
  mode,
}) => {
  const { rooms, editTenant, transferTenant } = useData();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [monthlyRent, setMonthlyRent] = useState(10000);

  const [targetRoomId, setTargetRoomId] = useState('');
  const [targetBedId, setTargetBedId] = useState('');

  useEffect(() => {
    if (tenant) {
      setName(tenant.user?.name || '');
      setPhone(tenant.user?.phone || '');
      setEmergencyName(tenant.emergency_name || '');
      setEmergencyPhone(tenant.emergency_phone || '');
      setMonthlyRent(tenant.monthly_rent);

      if (tenant.room_id) setTargetRoomId(tenant.room_id);
    }
  }, [tenant, isOpen]);

  if (!tenant) return null;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editTenant({
      ...tenant,
      monthly_rent: Number(monthlyRent),
      emergency_name: emergencyName,
      emergency_phone: emergencyPhone,
      user: tenant.user ? { ...tenant.user, name, phone } : undefined,
    });
    onClose();
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRoomId || !targetBedId) return;
    transferTenant(tenant.id, targetRoomId, targetBedId);
    onClose();
  };

  const targetRoomObj = rooms.find(r => r.id === targetRoomId);
  const vacantBedsInTarget = targetRoomObj?.beds?.filter(b => b.status === 'vacant') || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'edit'
          ? `Edit Tenant - ${tenant.user?.name}`
          : mode === 'transfer'
          ? `Transfer Room - ${tenant.user?.name}`
          : `ID Proof & Documents - ${tenant.user?.name}`
      }
      maxWidth={mode === 'idproof' ? 'xl' : 'md'}
    >
      {/* MODE 1: EDIT TENANT */}
      {mode === 'edit' && (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
            required
          />

          <Input
            label="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            required
          />

          <Input
            label="Monthly Rent (₹)"
            type="number"
            value={monthlyRent}
            onChange={e => setMonthlyRent(Number(e.target.value))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Emergency Contact Name"
              value={emergencyName}
              onChange={e => setEmergencyName(e.target.value)}
            />
            <Input
              label="Emergency Phone"
              value={emergencyPhone}
              onChange={e => setEmergencyPhone(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {/* MODE 2: ROOM TRANSFER WIZARD */}
      {mode === 'transfer' && (
        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              Currently in Room {tenant.room?.room_number} (Bed {tenant.bed?.bed_number}). Transferring will automatically update bed availability metrics.
            </span>
          </div>

          <Select
            label="Select Destination Room *"
            value={targetRoomId}
            onChange={e => {
              setTargetRoomId(e.target.value);
              const roomObj = rooms.find(r => r.id === e.target.value);
              const firstVacant = roomObj?.beds?.find(b => b.status === 'vacant');
              if (firstVacant) setTargetBedId(firstVacant.id);
              else setTargetBedId('');
            }}
            options={rooms.map(r => ({
              label: `Room ${r.room_number} (Floor ${r.floor} • ${r.room_type} • ₹${r.monthly_rent}/mo)`,
              value: r.id,
            }))}
          />

          <Select
            label="Select Vacant Bed *"
            value={targetBedId}
            onChange={e => setTargetBedId(e.target.value)}
            options={
              vacantBedsInTarget.length > 0
                ? vacantBedsInTarget.map(b => ({ label: `Bed ${b.bed_number}`, value: b.id }))
                : [{ label: 'No vacant beds available in this room', value: '' }]
            }
          />

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={!targetBedId}>
              Confirm Transfer
            </Button>
          </div>
        </form>
      )}

      {/* MODE 3: VIEW ID PROOF */}
      {mode === 'idproof' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" /> Aadhaar / Government ID Proof Document
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Verified ID
              </span>
            </div>

            <img
              src={tenant.id_proof_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800'}
              alt="ID Proof"
              className="w-full h-72 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-md"
            />
          </div>

          <Button variant="secondary" className="w-full" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      )}
    </Modal>
  );
};
