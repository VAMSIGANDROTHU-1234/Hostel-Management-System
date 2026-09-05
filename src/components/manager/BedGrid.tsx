import React from 'react';
import { Bed, Room } from '../../types';
import { User, Plus, BedDouble } from 'lucide-react';

interface BedGridProps {
  room: Room;
  beds: Bed[];
  onAssignBed?: (room: Room, bed: Bed) => void;
  onViewTenant?: (tenantId?: string) => void;
}

export const BedGrid: React.FC<BedGridProps> = ({ room, beds, onAssignBed, onViewTenant }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {beds.map(bed => {
        const isOccupied = bed.status === 'occupied';

        return (
          <div
            key={bed.id}
            onClick={() => {
              if (isOccupied && onViewTenant && bed.tenant_id) {
                onViewTenant(bed.tenant_id);
              } else if (!isOccupied && onAssignBed) {
                onAssignBed(room, bed);
              }
            }}
            className={`relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 ${
              isOccupied
                ? 'bg-slate-100 dark:bg-charcoal-800/80 border-slate-300 dark:border-charcoal-700 hover:border-red-500/40 hover:shadow-md'
                : 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/15'
            }`}
          >
            {/* Top Bar: Bed Number & Status Chip */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BedDouble className={`w-3.5 h-3.5 ${isOccupied ? 'text-blue-500' : 'text-emerald-500'}`} />
                {bed.bed_number}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  isOccupied
                    ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500 text-white shadow-xs'
                }`}
              >
                {isOccupied ? 'Occupied' : 'Vacant'}
              </span>
            </div>

            {/* Bottom Content: Tenant Info or + Assign Button */}
            {isOccupied ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {bed.tenant_name || 'Tenant'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Click for profile</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mt-2">
                <Plus className="w-4 h-4" />
                <span>Assign Bed</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
