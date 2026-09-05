import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LogOut, Bell, Search, Menu, Sun, Moon } from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { ActivityFeed, ActivityItem } from './ActivityFeed';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const { user, role, logout } = useAuth();
  const { auditLogs } = useData();
  const { theme, toggleTheme } = useTheme();

  const [isCommandBarOpen, setIsCommandBarOpen] = React.useState(false);
  const [isActivityOpen, setIsActivityOpen] = React.useState(false);

  const formattedActivities: ActivityItem[] = (auditLogs || []).map(log => ({
    id: log.id,
    title: log.action_type ? log.action_type.replace(/_/g, ' ') : 'System Action',
    description: log.details || '',
    type: 'identity',
    timestamp: log.timestamp || new Date().toISOString(),
  }));

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B0B0D]/80 backdrop-blur-md border-b border-slate-200 dark:border-charcoal-800/80 px-4 lg:px-8 py-3 select-none transition-colors duration-300">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu & Command Bar Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl border border-slate-200 dark:border-charcoal-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* AI Command Palette Search Bar */}
            <button
              onClick={() => setIsCommandBarOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-charcoal-900 hover:bg-slate-200 dark:hover:bg-charcoal-850 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-charcoal-800 px-3.5 py-1.5 rounded-xl text-xs transition-colors w-64 md:w-80"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search actions, tenants, rooms...</span>
              <kbd className="ml-auto font-mono text-[10px] bg-slate-200 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-300 dark:border-charcoal-700">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* User Profile, Theme Toggle & Actions */}
          <div className="flex items-center gap-3">
            {/* Sun / Moon Dark & Light Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-charcoal-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-charcoal-800 transition-all hover:scale-105 active:scale-95"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Live Activity Feed Button */}
            <button
              onClick={() => setIsActivityOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-charcoal-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-charcoal-800 transition-colors"
              title="Live Audit Log Feed"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            </button>

            {/* Profile Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-charcoal-800/80">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-red-600/40"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">{user?.name || 'Vamsi Gandrothu'}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  {role === 'manager' ? 'Hostel Manager' : 'Tenant Occupant'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
              onClick={logout}
              title="Sign Out"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} />

      {/* Activity Feed Drawer */}
      <ActivityFeed isOpen={isActivityOpen} onClose={() => setIsActivityOpen(false)} activities={formattedActivities} />
    </>
  );
};
