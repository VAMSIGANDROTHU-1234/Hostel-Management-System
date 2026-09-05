import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Search,
  Users,
  Building2,
  CreditCard,
  BedDouble,
  MessageSquare,
  MessageSquareWarning,
  UserCheck,
  FileSpreadsheet,
  Settings,
  Sparkles,
  ArrowRight,
  X,
  Receipt,
  AlertTriangle
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTenantModal?: () => void;
  onOpenPaymentModal?: () => void;
  onOpenVisitorModal?: () => void;
  onOpenRoomModal?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenTenantModal,
  onOpenPaymentModal,
  onOpenVisitorModal,
  onOpenRoomModal,
}) => {
  const navigate = useNavigate();
  const { tenants, rooms, payments, complaints, visitors } = useData();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Static Action Commands
  const actions = [
    {
      id: 'act-provision',
      title: 'Provision New Tenant Account',
      subtitle: 'Create tenant profile with login credentials',
      category: 'Actions',
      icon: Users,
      action: () => {
        if (onOpenTenantModal) onOpenTenantModal();
        onClose();
      },
    },
    {
      id: 'act-payment',
      title: 'Record Rent Payment Transaction',
      subtitle: 'Log Cash, UPI, or Razorpay payment',
      category: 'Actions',
      icon: CreditCard,
      action: () => {
        if (onOpenPaymentModal) onOpenPaymentModal();
        onClose();
      },
    },
    {
      id: 'act-whatsapp',
      title: 'WhatsApp Reminder Center',
      subtitle: 'Open 5-tier smart reminder dashboard',
      category: 'Actions',
      icon: MessageSquare,
      action: () => {
        navigate('/manager/whatsapp-reminders');
        onClose();
      },
    },
    {
      id: 'act-empty-beds',
      title: 'Find Empty Beds Live Tracker',
      subtitle: 'Filter vacant beds by floor & room type',
      category: 'Actions',
      icon: BedDouble,
      action: () => {
        navigate('/manager/empty-beds');
        onClose();
      },
    },
    {
      id: 'act-visitor',
      title: 'Check-In New Visitor',
      subtitle: 'Log visitor details and timestamp',
      category: 'Actions',
      icon: UserCheck,
      action: () => {
        if (onOpenVisitorModal) onOpenVisitorModal();
        onClose();
      },
    },
    {
      id: 'act-room',
      title: 'Add New Room & Bed Matrix',
      subtitle: 'Configure new room and bed slots',
      category: 'Actions',
      icon: Building2,
      action: () => {
        if (onOpenRoomModal) onOpenRoomModal();
        onClose();
      },
    },
    {
      id: 'act-report',
      title: 'Generate Revenue & Audit Reports',
      subtitle: 'Export PDF, Excel, and CSV files',
      category: 'Actions',
      icon: FileSpreadsheet,
      action: () => {
        navigate('/manager/reports');
        onClose();
      },
    },
    {
      id: 'act-settings',
      title: 'Open Hostel Settings & Meta Credentials',
      subtitle: 'Branding, late fee rules, and WhatsApp API',
      category: 'Actions',
      icon: Settings,
      action: () => {
        navigate('/manager/settings');
        onClose();
      },
    },
  ];

  // Dynamic Tenants
  const tenantResults = (tenants || [])
    .filter(
      t =>
        t &&
        ((t.user?.name && t.user.name.toLowerCase().includes(query.toLowerCase())) ||
          (t.user?.email && t.user.email.toLowerCase().includes(query.toLowerCase())) ||
          (t.user?.phone && t.user.phone.includes(query)) ||
          (t.room?.room_number && t.room.room_number.includes(query)))
    )
    .slice(0, 4)
    .map(t => ({
      id: `ten-${t.id}`,
      title: t.user?.name || 'Tenant',
      subtitle: `Room ${t.room?.room_number || 'N/A'} (Bed ${t.bed?.bed_number || 'N/A'}) • ${t.user?.phone || 'N/A'}`,
      category: 'Tenants',
      icon: Users,
      action: () => {
        navigate('/manager/tenants');
        onClose();
      },
    }));

  // Dynamic Payments
  const paymentResults = (payments || [])
    .filter(
      p =>
        p &&
        ((p.receipt_no && p.receipt_no.toLowerCase().includes(query.toLowerCase())) ||
          (p.tenant?.user?.name && p.tenant.user.name.toLowerCase().includes(query.toLowerCase())) ||
          (p.payment_method && p.payment_method.toLowerCase().includes(query.toLowerCase())))
    )
    .slice(0, 3)
    .map(p => ({
      id: `pay-${p.id}`,
      title: `Receipt ${p.receipt_no} (₹${p.amount.toLocaleString()})`,
      subtitle: `Tenant: ${p.tenant?.user?.name || 'N/A'} • Method: ${p.payment_method} • Status: ${p.status.toUpperCase()}`,
      category: 'Payments',
      icon: Receipt,
      action: () => {
        navigate('/manager/payments');
        onClose();
      },
    }));

  // Dynamic Complaints
  const complaintResults = (complaints || [])
    .filter(
      c =>
        c &&
        ((c.title && c.title.toLowerCase().includes(query.toLowerCase())) ||
          (c.category && c.category.toLowerCase().includes(query.toLowerCase())) ||
          (c.tenant?.user?.name && c.tenant.user.name.toLowerCase().includes(query.toLowerCase())))
    )
    .slice(0, 3)
    .map(c => ({
      id: `comp-${c.id}`,
      title: c.title,
      subtitle: `Category: ${c.category} • Tenant: ${c.tenant?.user?.name || 'N/A'} • Status: ${c.status.toUpperCase()}`,
      category: 'Complaints',
      icon: AlertTriangle,
      action: () => {
        navigate('/manager/complaints');
        onClose();
      },
    }));

  // Dynamic Visitors
  const visitorResults = (visitors || [])
    .filter(
      v =>
        v &&
        ((v.visitor_name && v.visitor_name.toLowerCase().includes(query.toLowerCase())) ||
          (v.phone && v.phone.includes(query)) ||
          (v.tenant?.user?.name && v.tenant.user.name.toLowerCase().includes(query.toLowerCase())))
    )
    .slice(0, 3)
    .map(v => ({
      id: `vis-${v.id}`,
      title: `Visitor: ${v.visitor_name} (${v.phone})`,
      subtitle: `Visiting: ${v.tenant?.user?.name || 'N/A'} • Purpose: ${v.purpose}`,
      category: 'Visitors',
      icon: UserCheck,
      action: () => {
        navigate('/manager/visitors');
        onClose();
      },
    }));

  // Dynamic Rooms
  const roomResults = (rooms || [])
    .filter(
      r =>
        r &&
        ((r.room_number && r.room_number.includes(query)) ||
          (r.room_type && r.room_type.toLowerCase().includes(query.toLowerCase())))
    )
    .slice(0, 3)
    .map(r => ({
      id: `room-${r.id}`,
      title: `Room ${r.room_number} (${r.room_type})`,
      subtitle: `Floor ${r.floor} • ${r.total_beds} Total Beds • ₹${r.monthly_rent}/mo`,
      category: 'Rooms',
      icon: Building2,
      action: () => {
        navigate('/manager/rooms');
        onClose();
      },
    }));

  const allItems = [...actions, ...tenantResults, ...paymentResults, ...complaintResults, ...visitorResults, ...roomResults].filter(item => {
    if (!query.trim()) return true;
    return (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-charcoal-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 dark:border-charcoal-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type tenant name, phone, room, receipt, complaint, or visitor... (Ctrl + K)"
            className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-charcoal-800/60 flex-1">
          {allItems.length > 0 ? (
            allItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-600/10 dark:bg-red-950/40 border border-red-600/30'
                      : 'hover:bg-slate-50 dark:hover:bg-charcoal-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl border ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-600 shadow-glow-red'
                          : 'bg-slate-100 dark:bg-charcoal-800 text-slate-500 border-slate-200 dark:border-charcoal-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-charcoal-800 text-slate-500">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching commands or results found for "{query}".
            </div>
          )}
        </div>

        {/* Footer Keyboard Hints */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-charcoal-950/60 border-t border-slate-100 dark:border-charcoal-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-charcoal-800 font-mono text-[10px]">Ctrl</kbd> +{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-charcoal-800 font-mono text-[10px]">K</kbd> to toggle
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-charcoal-800 font-mono text-[10px]">ESC</kbd> to exit
            </span>
          </div>
          <span className="font-bold text-red-500">HostelSphere AI Global Search</span>
        </div>
      </div>
    </div>
  );
};
