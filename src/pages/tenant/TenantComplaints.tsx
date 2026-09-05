import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Complaint } from '../../types';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/formatters';
import { RaiseComplaintModal } from '../../components/tenant/RaiseComplaintModal';
import { MessageSquareWarning, Plus, Image } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const TenantComplaints: React.FC = () => {
  const { user } = useAuth();
  const { tenants, complaints } = useData();

  const tenant = tenants.find(t => t.user_id === user?.id || t.user?.email.toLowerCase() === user?.email.toLowerCase()) || tenants[0];
  const myComplaints = complaints.filter(c => c.tenant_id === tenant.id);

  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const columns: Column<Complaint>[] = [
    {
      key: 'title',
      header: 'Complaint Title',
      sortable: true,
      render: c => <span className="font-bold text-slate-900 dark:text-slate-100">{c.title}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      render: c => <Badge variant="info">{c.category}</Badge>,
    },
    {
      key: 'description',
      header: 'Description',
      render: c => <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">{c.description}</p>,
    },
    {
      key: 'image_url',
      header: 'Photo Attachment',
      render: c =>
        c.image_url ? (
          <button
            onClick={() => setSelectedImage(c.image_url!)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-indigo-600" /> My Maintenance Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-1">Raise complaints for room repairs or Wi-Fi issues and track live resolution status.</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsComplaintModalOpen(true)}
        >
          Raise New Ticket
        </Button>
      </div>

      <Table
        columns={columns}
        data={myComplaints}
        pageSize={8}
        searchKey="title"
        searchPlaceholder="Search complaint title..."
      />

      <RaiseComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        tenantId={tenant.id}
      />

      {/* Image Preview Modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="Ticket Image Attachment" maxWidth="lg">
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
