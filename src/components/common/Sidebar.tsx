import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BedDouble,
  MessageSquareWarning,
  UserCheck,
  FileSpreadsheet,
  Settings,
  User,
  Building,
  ArrowRightLeft,
  MessageSquare,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { role, loginAsManager, loginAsTenant } = useAuth();

  const managerLinks = [
    { to: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/manager/rooms', label: 'Rooms & Beds', icon: Building2 },
    { to: '/manager/tenants', label: 'Tenants Directory', icon: Users },
    { to: '/manager/payments', label: 'Payment Ledger', icon: CreditCard },
    { to: '/manager/empty-beds', label: 'Empty Bed Tracker', icon: BedDouble },
    { to: '/manager/whatsapp-reminders', label: 'WhatsApp Engine', icon: MessageSquare },
    { to: '/manager/complaints', label: 'Complaints', icon: MessageSquareWarning },
    { to: '/manager/visitors', label: 'Visitor Log', icon: UserCheck },
    { to: '/manager/reports', label: 'Reports', icon: FileSpreadsheet },
    { to: '/manager/settings', label: 'Settings', icon: Settings },
  ];

  const tenantLinks = [
    { to: '/tenant/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/tenant/payments', label: 'My Payments', icon: CreditCard },
    { to: '/tenant/complaints', label: 'Raise Ticket', icon: MessageSquareWarning },
    { to: '/tenant/profile', label: 'My Profile', icon: User },
  ];

  const links = role === 'manager' ? managerLinks : tenantLinks;

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-charcoal-950 text-slate-700 dark:text-slate-300 w-64 border-r border-slate-200 dark:border-charcoal-800/80 select-none transition-colors duration-300">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-charcoal-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">HostelSphere</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Enterprise SaaS</div>
          </div>
        </div>

        {isMobileOpen && (
          <button onClick={onMobileClose} className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {role === 'manager' ? 'Management Console' : 'Tenant Portal'}
        </div>

        {links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-600/10 text-red-600 dark:text-red-500 border-l-2 border-red-600 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-charcoal-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Role Switcher Box */}
      <div className="p-3 border-t border-slate-200 dark:border-charcoal-800/80 bg-slate-50 dark:bg-charcoal-900/40 m-3 rounded-xl">
        <div className="text-[10px] font-bold text-slate-400 mb-2 flex items-center justify-between uppercase">
          <span>Portal Switcher</span>
          <ArrowRightLeft className="w-3 h-3 text-slate-400" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => {
              loginAsManager();
              if (onMobileClose) onMobileClose();
            }}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
              role === 'manager'
                ? 'bg-red-600 text-white'
                : 'bg-slate-200 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-charcoal-700'
            }`}
          >
            Manager
          </button>
          <button
            onClick={() => {
              loginAsTenant();
              if (onMobileClose) onMobileClose();
            }}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
              role === 'tenant'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-charcoal-700'
            }`}
          >
            Tenant
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-40">
        {content}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-charcoal-950/70 backdrop-blur-xs" onClick={onMobileClose} />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
