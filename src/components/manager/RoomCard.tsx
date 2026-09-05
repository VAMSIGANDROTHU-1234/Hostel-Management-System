import React from 'react';
import { Room } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Building2, Layers, ChevronRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect }) => {
  const occupiedCount = room.beds?.filter(b => b.status === 'occupied').length || 0;
  const vacantCount = room.total_beds - occupiedCount;
  const occupancyPercent = Math.round((occupiedCount / room.total_beds) * 100);
  const isFull = vacantCount === 0;

  return (
    <Card onClick={() => onSelect(room)} className="p-5 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-charcoal-800 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-400 flex items-center justify-center font-extrabold text-base border border-red-600/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Room {room.room_number}
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Layers className="w-3 h-3" />
                Floor {room.floor} • {room.room_type}
              </div>
            </div>
          </div>

          <Badge variant={isFull ? 'danger' : 'success'}>
            {isFull ? 'FULL' : `${vacantCount} Vacant`}
          </Badge>
        </div>

        {/* Rent & Beds breakdown */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800/60">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-semibold uppercase">Monthly Rent</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(room.monthly_rent)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-800/60">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-semibold uppercase">Beds (Occ / Total)</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{occupiedCount} / {room.total_beds}</span>
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold text-slate-500">
            <span>Occupancy</span>
            <span className={occupancyPercent === 100 ? 'text-red-600 font-extrabold' : 'text-red-600 dark:text-red-400'}>
              {occupancyPercent}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-charcoal-800 overflow-hidden">
            <div
              style={{ width: `${occupancyPercent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyPercent === 100
                  ? 'bg-red-600 shadow-glow-red'
                  : occupancyPercent > 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-charcoal-800 flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform">
        <span>Manage Room & Beds</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </Card>
  );
};
