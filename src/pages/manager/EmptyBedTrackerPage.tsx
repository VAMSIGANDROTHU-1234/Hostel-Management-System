import React, { useState } from 'react';
import { EmptyBedTracker } from '../../components/manager/EmptyBedTracker';
import { TenantProvisionModal } from '../../components/manager/TenantProvisionModal';
import { Room, Bed } from '../../types';
import { BedDouble } from 'lucide-react';

export const EmptyBedTrackerPage: React.FC = () => {
  const [selectedRoomForAssign, setSelectedRoomForAssign] = useState<Room | null>(null);
  const [selectedBedForAssign, setSelectedBedForAssign] = useState<Bed | null>(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  const handleAssignBed = (room: Room, bed: Bed) => {
    setSelectedRoomForAssign(room);
    setSelectedBedForAssign(bed);
    setIsProvisionModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <BedDouble className="w-6 h-6 text-emerald-500" /> Empty Bed Tracker
        </h1>
        <p className="text-xs text-slate-500 mt-1">Locate vacant beds floor-by-floor and provision tenant accounts instantly.</p>
      </div>

      <EmptyBedTracker onAssignBed={handleAssignBed} />

      <TenantProvisionModal
        isOpen={isProvisionModalOpen}
        onClose={() => {
          setIsProvisionModalOpen(false);
          setSelectedRoomForAssign(null);
          setSelectedBedForAssign(null);
        }}
        selectedRoom={selectedRoomForAssign}
        selectedBed={selectedBedForAssign}
      />
    </div>
  );
};
