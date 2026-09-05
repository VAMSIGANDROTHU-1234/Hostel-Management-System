import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Room, Bed } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { BedDouble, Search, ChevronDown, Plus, Layers, Snowflake, DollarSign, Clock, Filter } from 'lucide-react';

interface EmptyBedTrackerProps {
  onAssignBed?: (room: Room, bed: Bed) => void;
}

export const EmptyBedTracker: React.FC<EmptyBedTrackerProps> = ({ onAssignBed }) => {
  const { rooms, occupancyStats } = useData();

  // LocalStorage persistence for expand/collapse state (Default: collapsed)
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hostelsphere_empty_bed_tracker_expanded');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hostelsphere_empty_bed_tracker_expanded', JSON.stringify(isExpanded));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [isExpanded]);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Compute vacant beds list
  const vacantBedsData = useMemo(() => {
    const list: { room: Room; bed: Bed }[] = [];
    rooms.forEach(room => {
      room.beds?.forEach(bed => {
        if (bed.status === 'vacant') {
          list.push({ room, bed });
        }
      });
    });
    return list;
  }, [rooms]);

  // Compute Total Floors & Potential Monthly Revenue
  const totalFloors = useMemo(() => {
    return Array.from(new Set(rooms.map(r => r.floor))).length;
  }, [rooms]);

  const potentialRevenue = useMemo(() => {
    return vacantBedsData.reduce((sum, item) => sum + item.room.monthly_rent, 0);
  }, [vacantBedsData]);

  // Filtered vacant beds
  const filteredBeds = useMemo(() => {
    return vacantBedsData.filter(({ room, bed }) => {
      const matchesSearch =
        !searchTerm.trim() ||
        room.room_number.includes(searchTerm) ||
        bed.bed_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.room_type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFloor = selectedFloor === 'all' || String(room.floor) === selectedFloor;
      const matchesType = selectedType === 'all' || room.room_type === selectedType;

      return matchesSearch && matchesFloor && matchesType;
    });
  }, [vacantBedsData, searchTerm, selectedFloor, selectedType]);

  const floorOptions = Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b);
  const typeOptions = Array.from(new Set(rooms.map(r => r.room_type)));

  return (
    <Card className="border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs overflow-hidden transition-all duration-300">
      {/* Header Bar (Clickable to Expand/Collapse) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-charcoal-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Empty Bed Live Tracker
              </h3>
              <Badge variant="success" size="sm">
                {occupancyStats.vacantBeds} Vacant Beds
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live inventory of unassigned beds ready for tenant allocation.
            </p>
          </div>
        </div>

        {/* Right Side: Collapsed Summary & Chevron Toggle */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-charcoal-800">
          {/* Collapsed Summary Stats */}
          {!isExpanded && (
            <div className="flex items-center gap-4 text-xs">
              <div className="hidden md:block">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Floors</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{totalFloors} Floors</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Potential Revenue</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(potentialRevenue)}/mo</span>
              </div>
              <div className="hidden lg:block">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            <div
              className={`p-1.5 rounded-lg border border-slate-200 dark:border-charcoal-700 transition-transform duration-300 ${
                isExpanded ? 'rotate-180 bg-slate-100 dark:bg-charcoal-800' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Content Container (Smooth 300ms Animation) */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[1200px] opacity-100 border-t border-slate-100 dark:border-charcoal-800' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 space-y-4">
          {/* Search & Filter Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search vacant beds by room number, floor, or room type..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Filters Group */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold shrink-0">
                <Filter className="w-3.5 h-3.5" /> Filters:
              </div>

              {/* Floor Filter */}
              <select
                value={selectedFloor}
                onChange={e => setSelectedFloor(e.target.value)}
                className="bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">All Floors</option>
                {floorOptions.map(f => (
                  <option key={f} value={String(f)}>Floor {f}</option>
                ))}
              </select>

              {/* Room Type Filter */}
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">All Room Types</option>
                {typeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vacant Bed Cards Matrix Grid */}
          {filteredBeds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredBeds.map(({ room, bed }) => (
                <div
                  key={bed.id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-charcoal-800 bg-slate-50/50 dark:bg-charcoal-800/30 flex items-center justify-between hover:border-emerald-500/40 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1">
                        <BedDouble className="w-4 h-4 text-emerald-500" />
                        Bed {bed.bed_number}
                      </span>
                      <Badge variant="success" size="sm">Vacant</Badge>
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-slate-400" />
                      Floor {room.floor} • Room {room.room_number} ({room.room_type})
                      {room.is_ac && <Snowflake className="w-3 h-3 text-blue-500" title="AC Room" />}
                    </div>

                    <div className="text-xs font-extrabold text-red-600 dark:text-red-400 pt-0.5">
                      {formatCurrency(room.monthly_rent)} / month
                    </div>
                  </div>

                  {onAssignBed && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs shrink-0"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={e => {
                        e.stopPropagation();
                        onAssignBed(room, bed);
                      }}
                    >
                      Assign Bed
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
              No vacant beds match the selected search or filter criteria.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
