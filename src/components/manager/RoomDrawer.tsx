import React from 'react';
import { Room, Bed } from '../../types';
import { Drawer } from '../ui/Drawer';
import { BedGrid } from './BedGrid';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Building2, Layers, DollarSign, UserX, Phone, Calendar, Edit3, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface RoomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string) => void;
  onAssignBed: (room: Room, bed: Bed) => void;
}

export const RoomDrawer: React.FC<RoomDrawerProps> = ({
  isOpen,
  onClose,
  room,
  onEditRoom,
  onDeleteRoom,
  onAssignBed,
}) => {
  const { tenants, vacateBed } = useData();

  if (!room) return null;

  const roomTenants = tenants.filter(t => t.room_id === room.id && t.status === 'active');
  const occupiedCount = room.beds?.filter(b => b.status === 'occupied').length || 0;
  const vacantCount = room.total_beds - occupiedCount;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Room ${room.room_number}`}
      subtitle={`Floor ${room.floor} • ${room.room_type}`}
      size="lg"
    >
      {/* Top Specs Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
          <DollarSign className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Monthly Rent</div>
          <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(room.monthly_rent)}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
          <Building2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Vacant Beds</div>
          <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{vacantCount} / {room.total_beds}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
          <Layers className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Floor Level</div>
          <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">Floor {room.floor}</div>
        </div>
      </div>

      {/* Bed Visualization Matrix */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Bed Matrix</h4>
          <span className="text-xs text-slate-500">Click vacant bed to assign tenant</span>
        </div>
        <BedGrid
          room={room}
          beds={room.beds || []}
          onAssignBed={(rm, bd) => {
            onClose();
            onAssignBed(rm, bd);
          }}
        />
      </div>

      {/* Current Occupants List */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Current Occupants</h4>
        
        {roomTenants.length > 0 ? (
          <div className="space-y-3">
            {roomTenants.map(tenant => (
              <div
                key={tenant.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tenant.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                    alt={tenant.user?.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tenant.user?.name}</h5>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {tenant.user?.phone}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {formatDate(tenant.joining_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="info">Bed {tenant.bed?.bed_number}</Badge>
                  <Button
                    size="sm"
                    variant="danger"
                    leftIcon={<UserX className="w-3.5 h-3.5" />}
                    onClick={() => vacateBed(tenant.id)}
                    title="Vacate Bed"
                  >
                    Vacate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
            No active tenants currently occupying this room.
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <Button
          variant="outline"
          className="flex-1"
          leftIcon={<Edit3 className="w-4 h-4" />}
          onClick={() => {
            onClose();
            onEditRoom(room);
          }}
        >
          Edit Room
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          leftIcon={<Trash2 className="w-4 h-4" />}
          onClick={() => {
            onClose();
            onDeleteRoom(room.id);
          }}
        >
          Delete Room
        </Button>
      </div>
    </Drawer>
  );
};
