import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Complaint } from '../../types';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { formatDateTime } from '../../utils/formatters';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { MessageSquareWarning, Image, CheckCircle2, Clock, Wrench } from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const { complaints, updateComplaintStatus } = useData();

  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const columns: Column<Complaint>[] = [
    {
      key: 'title',
      header: 'Complaint & Tenant',
      sortable: true,
      render: c => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100">{c.title}</div>
          <div className="text-xs text-slate-400">
            {c.tenant?.user?.name} (Room {c.tenant?.room?.room_number || 'N/A'})
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: c => <Badge variant="crimson">{c.category}</Badge>,
    },
    {
      key: 'description',
      header: 'Description',
      render: c => <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">{c.description}</p>,
    },
    {
      key: 'image_url',
      header: 'Photo Proof',
      render: c =>
        c.image_url ? (
          <button
            onClick={() => setSelectedImage(c.image_url!)}
            className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
          >
            <Image className="w-3.5 h-3.5" /> View Photo
          </button>
        ) : (
          <span className="text-xs text-slate-400">No Image</span>
        ),
    },
    {
      key: 'created_at',
      header: 'Raised On',
      sortable: true,
      render: c => formatDateTime(c.created_at),
    },
    {
      key: 'status',
      header: 'Status',
      render: c => (
        <Badge variant={c.status === 'resolved' ? 'success' : c.status === 'in_progress' ? 'warning' : 'danger'}>
          {c.status.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Update Status',
      render: c => (
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          {c.status !== 'in_progress' && c.status !== 'resolved' && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Wrench className="w-3 h-3 text-amber-500" />}
              onClick={() => updateComplaintStatus(c.id, 'in_progress')}
            >
              In Progress
            </Button>
          )}

          {c.status !== 'resolved' && (
            <Button
              size="sm"
              variant="success"
              leftIcon={<CheckCircle2 className="w-3 h-3" />}
              onClick={() => updateComplaintStatus(c.id, 'resolved')}
            >
              Resolve
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <MessageSquareWarning className="w-6 h-6 text-red-600" /> Complaints Resolution Board
        </h1>
        <p className="text-xs text-slate-500 mt-1">Review tenant maintenance requests, inspect attached photos, and update ticket statuses.</p>
      </div>

      <div className="w-48">
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          options={[
            { label: 'All Complaints', value: 'all' },
            { label: 'Open Tickets', value: 'open' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Resolved Tickets', value: 'resolved' },
          ]}
        />
      </div>

      <Table
        columns={columns}
        data={filteredComplaints}
        pageSize={8}
        searchKey={c => `${c.title} ${c.tenant?.user?.name || ''} ${c.category}`}
        searchPlaceholder="Search complaint title, tenant name, category..."
      />

      {/* Image Preview Modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="Complaint Image Attachment" maxWidth="lg">
        {selectedImage && (
          <div className="space-y-4">
            <img src={selectedImage} alt="Attachment" className="w-full h-80 object-cover rounded-2xl border shadow-md" />
            <Button variant="secondary" className="w-full" onClick={() => setSelectedImage(null)}>
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
