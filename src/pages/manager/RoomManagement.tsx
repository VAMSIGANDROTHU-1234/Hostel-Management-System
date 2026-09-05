import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Room, Bed } from '../../types';
import { RoomCard } from '../../components/manager/RoomCard';
import { RoomDrawer } from '../../components/manager/RoomDrawer';
import { RoomModal } from '../../components/manager/RoomModal';
import { TenantProvisionModal } from '../../components/manager/TenantProvisionModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Search, Building2 } from 'lucide-react';

export const RoomManagement: React.FC = () => {
  const { rooms, addRoom, editRoom, deleteRoom } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [floorFilter, setFloorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [selectedRoomDrawer, setSelectedRoomDrawer] = useState<Room | null>(null);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);

  const [selectedRoomForAssign, setSelectedRoomForAssign] = useState<Room | null>(null);
  const [selectedBedForAssign, setSelectedBedForAssign] = useState<Bed | null>(null);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_number.includes(searchTerm);
    const matchesFloor = floorFilter === 'all' || String(room.floor) === floorFilter;
    const matchesType = typeFilter === 'all' || room.room_type === typeFilter;
    return matchesSearch && matchesFloor && matchesType;
  });

  const handleAssignBed = (room: Room, bed: Bed) => {
    setSelectedRoomForAssign(room);
    setSelectedBedForAssign(bed);
    setIsTenantModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Room & Bed Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage rooms, floor assignments, bed matrix, and room sharing rates.</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setRoomToEdit(null);
            setIsRoomModalOpen(true);
          }}
        >
          Add New Room
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search room number (e.g. 101, 202)..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="w-full sm:w-44">
          <Select
            value={floorFilter}
            onChange={e => setFloorFilter(e.target.value)}
            options={[
              { label: 'All Floors', value: 'all' },
              { label: 'Floor 1', value: '1' },
              { label: 'Floor 2', value: '2' },
              { label: 'Floor 3', value: '3' },
            ]}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            options={[
              { label: 'All Room Types', value: 'all' },
              { label: 'Single', value: 'Single' },
              { label: 'Double Sharing', value: 'Double Sharing' },
              { label: 'Triple Sharing', value: 'Triple Sharing' },
              { label: 'Four Sharing', value: 'Four Sharing' },
            ]}
          />
        </div>
      </div>

      {/* Room Cards Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} onSelect={rm => setSelectedRoomDrawer(rm)} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed rounded-2xl">
          <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">No Rooms Found</h4>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or click Add New Room.</p>
        </div>
      )}

      {/* Room Slide-over Drawer */}
      <RoomDrawer
        isOpen={!!selectedRoomDrawer}
        onClose={() => setSelectedRoomDrawer(null)}
        room={selectedRoomDrawer}
        onEditRoom={room => {
          setRoomToEdit(room);
          setIsRoomModalOpen(true);
        }}
        onDeleteRoom={roomId => setDeleteRoomId(roomId)}
        onAssignBed={handleAssignBed}
      />

      {/* Room Form Modal */}
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        initialRoom={roomToEdit}
        onSave={roomData => {
          if ('id' in roomData) {
            editRoom(roomData as Room);
          } else {
            addRoom(roomData);
          }
        }}
      />

      {/* Tenant Provision Modal */}
      <TenantProvisionModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        selectedRoom={selectedRoomForAssign}
        selectedBed={selectedBedForAssign}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteRoomId}
        onClose={() => setDeleteRoomId(null)}
        onConfirm={() => {
          if (deleteRoomId) deleteRoom(deleteRoomId);
        }}
        title="Delete Room"
        message="Are you sure you want to delete this room? All beds and historical logs will be removed."
      />
    </div>
  );
};
