import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MetricCard } from '../../components/common/MetricCard';
import { IncomeChart } from '../../components/manager/IncomeChart';
import { OccupancyChart } from '../../components/manager/OccupancyChart';
import { EmptyBedTracker } from '../../components/manager/EmptyBedTracker';
import { TodayAttentionPanel } from '../../components/manager/TodayAttentionPanel';
import { WhatsAppReminderCenterCard } from '../../components/manager/WhatsAppReminderCenterCard';
import { SmartRoomMap } from '../../components/manager/SmartRoomMap';
import { FloatingActionButton } from '../../components/common/FloatingActionButton';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { RoomModal } from '../../components/manager/RoomModal';
import { TenantProvisionModal } from '../../components/manager/TenantProvisionModal';
import { PaymentModal } from '../../components/manager/PaymentModal';
import { VisitorModal } from '../../components/manager/VisitorModal';
import {
  Building2,
  BedDouble,
  Users,
  DollarSign,
  Plus,
  CreditCard,
  UserCheck,
  Clock,
  ArrowUpRight,
  MessageSquare,
  MoreHorizontal,
  FileSpreadsheet,
  Settings
} from 'lucide-react';
import { Room, Bed, Payment } from '../../types';
import { useNavigate } from 'react-router-dom';

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { occupancyStats, revenueStats, payments, settings, addRoom } = useData();

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const [selectedRoomForAssign, setSelectedRoomForAssign] = useState<Room | null>(null);
  const [selectedBedForAssign, setSelectedBedForAssign] = useState<Bed | null>(null);

  // Time-based Greeting
  const [greeting, setGreeting] = useState('Good Evening');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const userNameFirst = user?.name ? user.name.split(' ')[0] : 'Vamsi';
  const hostelNameStr = settings?.hostel_name || 'HavenStays Executive PG';
  const safePayments = payments || [];

  const handleAssignFromTracker = (room: Room, bed: Bed) => {
    setSelectedRoomForAssign(room);
    setSelectedBedForAssign(bed);
    setIsTenantModalOpen(true);
  };

  const paymentColumns: Column<Payment>[] = [
    {
      key: 'receipt_no',
      header: 'Receipt No',
      render: p => <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">{p?.receipt_no || 'N/A'}</span>,
    },
    {
      key: 'tenant',
      header: 'Tenant Name',
      render: p => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100">{p?.tenant?.user?.name || 'Tenant'}</div>
          <div className="text-[11px] text-slate-400">Room {p?.tenant?.room?.room_number || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      render: p => <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(p?.amount || 0)}</span>,
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: p => formatDate(p?.due_date),
    },
    {
      key: 'payment_method',
      header: 'Method',
      render: p => <Badge variant="neutral">{p?.payment_method || 'UPI'}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: p => (
        <Badge variant={p?.status === 'paid' ? 'success' : p?.status === 'pending' ? 'warning' : 'danger'}>
          {(p?.status || 'pending').toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <ErrorBoundary fallbackTitle="Manager Dashboard Encountered an Issue">
      <div className="space-y-6 w-full">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-charcoal-800">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {greeting}, {userNameFirst}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {currentDateStr} • {hostelNameStr} Occupancy Summary
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 relative">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setSelectedRoomForAssign(null);
                setSelectedBedForAssign(null);
                setIsTenantModalOpen(true);
              }}
            >
              Add Tenant
            </Button>

            <Button
              variant="outline"
              size="md"
              leftIcon={<CreditCard className="w-4 h-4" />}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Record Payment
            </Button>

            {/* More Actions Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="md"
                leftIcon={<MoreHorizontal className="w-4 h-4" />}
                onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              >
                More Actions
              </Button>

              {isMoreActionsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 rounded-2xl shadow-xl z-50 py-1 divide-y divide-slate-100 dark:divide-charcoal-800">
                  <button
                    onClick={() => {
                      setIsRoomModalOpen(true);
                      setIsMoreActionsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-charcoal-800 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-slate-400" /> Add Room
                  </button>
                  <button
                    onClick={() => {
                      setIsVisitorModalOpen(true);
                      setIsMoreActionsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-charcoal-800 flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-slate-400" /> Check-In Visitor
                  </button>
                  <button
                    onClick={() => {
                      navigate('/manager/reports');
                      setIsMoreActionsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-charcoal-800 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-slate-400" /> Reports Center
                  </button>
                  <button
                    onClick={() => {
                      navigate('/manager/settings');
                      setIsMoreActionsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-charcoal-800 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-400" /> Hostel Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metric Cards Grid: Exactly 4 Neutral Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Occupancy"
            value={`${occupancyStats?.occupancyRate || 0}%`}
            subtitle={`${occupancyStats?.occupiedBeds || 0} / ${occupancyStats?.totalBeds || 0} Beds Occupied`}
            trend={{ value: '+4%', isPositive: true }}
            icon={<Users className="w-4 h-4" />}
          />

          <MetricCard
            title="Revenue"
            value={formatCurrency(revenueStats?.collectedRevenue || 0)}
            subtitle={`${revenueStats?.collectionRate || 0}% of Target Collected`}
            trend={{ value: `Target: ${formatCurrency(revenueStats?.totalTarget || 0)}`, isPositive: true }}
            icon={<DollarSign className="w-4 h-4" />}
          />

          <MetricCard
            title="Pending Payments"
            value={formatCurrency((revenueStats?.pendingRevenue || 0) + (revenueStats?.overdueRevenue || 0))}
            subtitle={`Overdue: ${formatCurrency(revenueStats?.overdueRevenue || 0)}`}
            trend={{ value: 'Action Required', isPositive: false }}
            icon={<Clock className="w-4 h-4" />}
          />

          <MetricCard
            title="Vacant Beds"
            value={occupancyStats?.vacantBeds || 0}
            subtitle={`Across ${occupancyStats?.totalRooms || 0} Rooms`}
            trend={{ value: 'Live Availability', isPositive: true }}
            icon={<BedDouble className="w-4 h-4" />}
          />
        </div>

        {/* Needs Attention Panel */}
        <ErrorBoundary fallbackTitle="Needs Attention Panel">
          <TodayAttentionPanel />
        </ErrorBoundary>

        {/* WhatsApp Summary Card */}
        <ErrorBoundary fallbackTitle="WhatsApp Reminder Summary">
          <WhatsAppReminderCenterCard />
        </ErrorBoundary>

        {/* 2 Clean Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Revenue Collection Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorBoundary fallbackTitle="Revenue Chart">
                <IncomeChart />
              </ErrorBoundary>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Occupancy Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorBoundary fallbackTitle="Occupancy Chart">
                <OccupancyChart />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </div>

        {/* Smart Visual Room Map */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Visual Room & Bed Slot Matrix
            </h3>
            <span
              onClick={() => navigate('/manager/rooms')}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              Manage Rooms <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <ErrorBoundary fallbackTitle="Visual Room Map">
            <SmartRoomMap />
          </ErrorBoundary>
        </div>

        {/* Empty Bed Tracker */}
        <Card className="border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-emerald-500" /> Empty Bed Live Tracker
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Filter and assign vacant beds instantly.</p>
            </div>
            <Badge variant="neutral">{occupancyStats?.vacantBeds || 0} Vacant Beds Available</Badge>
          </CardHeader>
          <CardContent>
            <ErrorBoundary fallbackTitle="Empty Bed Tracker">
              <EmptyBedTracker onAssignBed={handleAssignFromTracker} />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Recent Payments Table */}
        <Card className="border border-slate-200/80 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold">Recent Payment Transactions</CardTitle>
            <span
              onClick={() => navigate('/manager/payments')}
              className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1 cursor-pointer hover:underline"
            >
              View All Transactions <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </CardHeader>
          <CardContent>
            <Table columns={paymentColumns} data={safePayments} pageSize={5} searchKey="receipt_no" />
          </CardContent>
        </Card>

        {/* Quick Action Floating Speed Dial Button */}
        <FloatingActionButton
          onOpenTenantModal={() => {
            setSelectedRoomForAssign(null);
            setSelectedBedForAssign(null);
            setIsTenantModalOpen(true);
          }}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          onOpenVisitorModal={() => setIsVisitorModalOpen(true)}
        />

        {/* Modals */}
        <RoomModal
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          onSave={roomData => addRoom(roomData)}
        />

        <TenantProvisionModal
          isOpen={isTenantModalOpen}
          onClose={() => {
            setIsTenantModalOpen(false);
            setSelectedRoomForAssign(null);
            setSelectedBedForAssign(null);
          }}
          selectedRoom={selectedRoomForAssign}
          selectedBed={selectedBedForAssign}
        />

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
        />

        <VisitorModal
          isOpen={isVisitorModalOpen}
          onClose={() => setIsVisitorModalOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
};
