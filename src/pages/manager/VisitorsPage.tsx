import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Visitor } from '../../types';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/formatters';
import { VisitorModal } from '../../components/manager/VisitorModal';
import { UserCheck, Plus, LogOut } from 'lucide-react';

export const VisitorsPage: React.FC = () => {
  const { visitors, checkOutVisitor } = useData();

  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);

  const columns: Column<Visitor>[] = [
    {
      key: 'visitor_name',
      header: 'Visitor Details',
      sortable: true,
      render: v => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100">{v.visitor_name}</div>
          <div className="text-xs text-slate-400">Phone: {v.phone}</div>
        </div>
      ),
    },
    {
      key: 'tenant',
      header: 'Host Tenant & Room',
      render: v => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100">{v.tenant?.user?.name || 'Tenant'}</div>
          <div className="text-xs text-slate-400">Room {v.tenant?.room?.room_number || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'purpose',
      header: 'Purpose of Visit',
      render: v => <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{v.purpose}</span>,
    },
    {
      key: 'check_in',
      header: 'Check-In Time',
      sortable: true,
      render: v => formatDateTime(v.check_in),
    },
    {
      key: 'check_out',
      header: 'Check-Out Time',
      render: v => v.check_out ? formatDateTime(v.check_out) : <span className="text-xs text-amber-500 font-bold">Currently Inside</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: v => (
        <Badge variant={v.status === 'inside' ? 'warning' : 'neutral'}>
          {v.status === 'inside' ? 'INSIDE HOSTEL' : 'CHECKED OUT'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: v =>
        v.status === 'inside' ? (
          <Button
            size="sm"
            variant="danger"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
            onClick={() => checkOutVisitor(v.id)}
          >
            Check Out
          </Button>
        ) : (
          <span className="text-xs text-slate-400">Completed</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" /> Visitor Register & Security Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">Track visitor entries, host tenant references, and check-out timestamps.</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsVisitorModalOpen(true)}
        >
          Register Visitor Check-In
        </Button>
      </div>

      <Table
        columns={columns}
        data={visitors}
        pageSize={8}
        searchKey={v => `${v.visitor_name} ${v.phone} ${v.tenant?.user?.name || ''}`}
        searchPlaceholder="Search visitor name, phone, host tenant..."
      />

      <VisitorModal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
      />
    </div>
  );
};
