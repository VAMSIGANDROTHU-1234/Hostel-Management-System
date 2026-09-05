import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Room, Bed } from '../../types';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Building2, Layers, Snowflake, BedDouble, ChevronRight, ChevronDown, Search, Maximize2, Minimize2 } from 'lucide-react';
import { RoomDrawer } from './RoomDrawer';

export const SmartRoomMap: React.FC = () => {
  const { rooms } = useData();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Group rooms by floor & sort
  const floors = useMemo(() => {
    return Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b);
  }, [rooms]);

  // Is Mobile Detection
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // LocalStorage state for expanded floors
  const [expandedFloors, setExpandedFloors] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('hostelsphere_expanded_floors');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('LocalStorage read error:', e);
    }
    // Default: Mobile -> All collapsed, Desktop -> Floor 1 expanded, rest collapsed
    const initial: Record<number, boolean> = {};
    const sortedFloors = Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b);
    sortedFloors.forEach((f, idx) => {
      initial[f] = !isMobile && idx === 0;
    });
    return initial;
  });

  // Save expanded floors to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('hostelsphere_expanded_floors', JSON.stringify(expandedFloors));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [expandedFloors]);

  // Toggle single floor accordion
  const toggleFloor = (floorNum: number) => {
    setExpandedFloors(prev => ({
      ...prev,
      [floorNum]: !prev[floorNum],
    }));
  };

  // Expand All
  const handleExpandAll = () => {
    const all: Record<number, boolean> = {};
    floors.forEach(f => (all[f] = true));
    setExpandedFloors(all);
  };

  // Collapse All
  const handleCollapseAll = () => {
    const all: Record<number, boolean> = {};
    floors.forEach(f => (all[f] = false));
    setExpandedFloors(all);
  };

  // Refs for rooms to enable smooth scroll on search
  const roomRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-expand floor & highlight room when searching
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const matchedRoom = rooms.find(
      r =>
        r.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.beds?.some(b => b.bed_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (matchedRoom) {
      // Auto-expand floor of matched room
      setExpandedFloors(prev => ({
        ...prev,
        [matchedRoom.floor]: true,
      }));

      // Scroll smoothly to room element
      setTimeout(() => {
        const el = roomRefs.current[matchedRoom.id];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);
    }
  }, [searchTerm, rooms]);

  return (
    <div className="space-y-4">
      {/* Top Search Bar & Expand/Collapse All Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-charcoal-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-charcoal-800 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search room (e.g. 203) or bed slot (e.g. 203-B) to auto-expand & highlight..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Expand / Collapse All Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
            onClick={handleExpandAll}
          >
            Expand All
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Minimize2 className="w-3.5 h-3.5" />}
            onClick={handleCollapseAll}
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* Floor Accordions Stack */}
      <div className="space-y-3">
        {floors.map(floor => {
          const floorRooms = rooms.filter(r => r.floor === floor);
          const isExpanded = !!expandedFloors[floor];

          // Compute floor level metrics
          let totalBeds = 0;
          let occupiedBeds = 0;

          floorRooms.forEach(r => {
            totalBeds += r.total_beds;
            r.beds?.forEach(b => {
              if (b.status === 'occupied') occupiedBeds++;
            });
          });

          const vacantBeds = Math.max(0, totalBeds - occupiedBeds);
          const occupancyPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

          // Status Badge Logic
          let statusBadge = <Badge variant="success">Available 🟢</Badge>;
          if (vacantBeds === 0) {
            statusBadge = <Badge variant="danger">Full 🔴</Badge>;
          } else if (vacantBeds === 1) {
            statusBadge = <Badge variant="warning">Nearly Full 🟡</Badge>;
          }

          return (
            <div
              key={floor}
              className="border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              {/* Floor Accordion Header */}
              <div
                onClick={() => toggleFloor(floor)}
                className="p-4 bg-slate-50/80 dark:bg-charcoal-800/50 hover:bg-slate-100/80 dark:hover:bg-charcoal-800/80 cursor-pointer select-none transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                {/* Left Side: Floor Title & Room Count */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 border border-red-600/20 flex items-center justify-center font-bold text-sm">
                    F{floor}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                      <span>Floor {floor}</span>
                      <span className="text-xs text-slate-400 font-medium">({floorRooms.length} Rooms)</span>
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                      <span>{occupiedBeds} Occupied</span> • <span>{vacantBeds} Vacant</span> • <span>{totalBeds} Total Beds</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Mini Progress Bar, Status Badge & Chevron */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 dark:border-charcoal-700">
                  {/* Occupancy Progress Bar */}
                  <div className="w-28 space-y-1 hidden md:block">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Occupancy</span>
                      <span className="text-red-600 dark:text-red-400">{occupancyPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-charcoal-700 overflow-hidden">
                      <div
                        style={{ width: `${occupancyPercent}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          occupancyPercent === 100 ? 'bg-red-600' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  {statusBadge}

                  {/* Rotating Chevron Icon */}
                  <div
                    className={`p-1.5 rounded-lg border border-slate-200 dark:border-charcoal-700 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 bg-slate-200/60 dark:bg-charcoal-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Accordion Body (Expanded View) */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[2000px] opacity-100 border-t border-slate-100 dark:border-charcoal-800' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {floorRooms.map(room => {
                    const roomOccupied = room.beds?.filter(b => b.status === 'occupied').length || 0;
                    const roomVacant = room.total_beds - roomOccupied;
                    const roomOccupancyPercent = Math.round((roomOccupied / room.total_beds) * 100);

                    const isSearchMatch =
                      searchTerm.trim() !== '' &&
                      (room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        room.beds?.some(b => b.bed_number.toLowerCase().includes(searchTerm.toLowerCase())));

                    return (
                      <Card
                        key={room.id}
                        ref={el => (roomRefs.current[room.id] = el)}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-5 flex flex-col justify-between group cursor-pointer transition-all ${
                          isSearchMatch
                            ? 'ring-2 ring-red-600 shadow-xl scale-[1.02] bg-red-600/5 dark:bg-red-950/20'
                            : 'hover:border-slate-300 dark:hover:border-charcoal-700 hover:shadow-md'
                        }`}
                      >
                        <div>
                          {/* Room Header */}
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-charcoal-800 pb-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-400 flex items-center justify-center font-extrabold text-sm border border-red-600/20">
                                {room.room_number}
                              </div>
                              <div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-1.5">
                                  Room {room.room_number}
                                  {room.is_ac && <Snowflake className="w-3.5 h-3.5 text-blue-500" title="AC Room" />}
                                </h4>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Layers className="w-3 h-3" />
                                  Floor {room.floor} • {room.room_type}
                                </div>
                              </div>
                            </div>

                            <Badge variant={roomVacant === 0 ? 'danger' : 'success'}>
                              {roomVacant === 0 ? 'FULL' : `${roomVacant} Vacant`}
                            </Badge>
                          </div>

                          {/* Visual Color-Coded Bed Slot Matrix */}
                          <div className="space-y-2 mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bed Slots</span>
                            <div className="flex flex-wrap gap-1.5">
                              {room.beds?.map(bed => {
                                const isOccupied = bed.status === 'occupied';
                                const isReserved = bed.status === 'reserved';

                                return (
                                  <div
                                    key={bed.id}
                                    className={`px-2.5 py-1 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 ${
                                      isOccupied
                                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                                        : isReserved
                                        ? 'bg-amber-400 text-slate-900 border-amber-500'
                                        : 'bg-slate-100 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-charcoal-700'
                                    }`}
                                    title={isOccupied ? `Occupied by ${bed.tenant_name || 'Tenant'}` : isReserved ? 'Reserved' : 'Vacant'}
                                  >
                                    <BedDouble className="w-3.5 h-3.5" />
                                    <span>{bed.bed_number}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Occupancy Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                              <span>Occupancy</span>
                              <span className="text-red-600 dark:text-red-400 font-extrabold">{roomOccupancyPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-charcoal-800 overflow-hidden">
                              <div
                                style={{ width: `${roomOccupancyPercent}%` }}
                                className={`h-full rounded-full transition-all duration-300 ${
                                  roomOccupancyPercent === 100 ? 'bg-red-600' : 'bg-emerald-500'
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-charcoal-800 flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform">
                          <span>{formatCurrency(room.monthly_rent)} / mo</span>
                          <div className="flex items-center gap-1">
                            <span>View Room Drawer</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Drawer */}
      <RoomDrawer
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        room={selectedRoom}
      />
    </div>
  );
};
