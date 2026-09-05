import React, { useState, useEffect } from 'react';
import { Room } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Building2, Layers, DollarSign, BedDouble } from 'lucide-react';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: Omit<Room, 'id' | 'created_at'> | Room) => void;
  initialRoom?: Room | null;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRoom,
}) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState(1);
  const [roomType, setRoomType] = useState<Room['room_type']>('Double Sharing');
  const [totalBeds, setTotalBeds] = useState(2);
  const [monthlyRent, setMonthlyRent] = useState(10000);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRoom) {
      setRoomNumber(initialRoom.room_number);
      setFloor(initialRoom.floor);
      setRoomType(initialRoom.room_type);
      setTotalBeds(initialRoom.total_beds);
      setMonthlyRent(initialRoom.monthly_rent);
    } else {
      setRoomNumber('');
      setFloor(1);
      setRoomType('Double Sharing');
      setTotalBeds(2);
      setMonthlyRent(10000);
    }
    setError('');
  }, [initialRoom, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      setError('Room number is required');
      return;
    }

    if (initialRoom) {
      onSave({
        ...initialRoom,
        room_number: roomNumber,
        floor: Number(floor),
        room_type: roomType,
        total_beds: Number(totalBeds),
        monthly_rent: Number(monthlyRent),
      });
    } else {
      onSave({
        room_number: roomNumber,
        floor: Number(floor),
        room_type: roomType,
        total_beds: Number(totalBeds),
        monthly_rent: Number(monthlyRent),
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialRoom ? `Edit Room ${initialRoom.room_number}` : 'Create New Room'}
      description="Add a room to your hostel inventory and specify total beds & rent."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Room Number"
          value={roomNumber}
          onChange={e => setRoomNumber(e.target.value)}
          placeholder="e.g. 104, 202, 301"
          leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Floor Level"
            type="number"
            min={0}
            max={20}
            value={floor}
            onChange={e => setFloor(Number(e.target.value))}
            leftIcon={<Layers className="w-4 h-4 text-slate-400" />}
            required
          />

          <Select
            label="Room Sharing Type"
            value={roomType}
            onChange={e => setRoomType(e.target.value as Room['room_type'])}
            options={[
              { label: 'Single Room', value: 'Single' },
              { label: 'Double Sharing', value: 'Double Sharing' },
              { label: 'Triple Sharing', value: 'Triple Sharing' },
              { label: 'Four Sharing', value: 'Four Sharing' },
              { label: 'Dormitory', value: 'Dormitory' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Total Beds"
            type="number"
            min={1}
            max={10}
            value={totalBeds}
            onChange={e => setTotalBeds(Number(e.target.value))}
            leftIcon={<BedDouble className="w-4 h-4 text-slate-400" />}
            required
          />

          <Input
            label="Monthly Rent (₹)"
            type="number"
            min={500}
            step={500}
            value={monthlyRent}
            onChange={e => setMonthlyRent(Number(e.target.value))}
            leftIcon={<DollarSign className="w-4 h-4 text-slate-400" />}
            required
          />
        </div>

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {initialRoom ? 'Save Changes' : 'Create Room'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
