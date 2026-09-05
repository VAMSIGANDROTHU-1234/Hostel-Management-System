import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { ComplaintCategory } from '../../types';
import { useData } from '../../context/DataContext';
import { MessageSquareWarning, Image, FileText, Send } from 'lucide-react';

interface RaiseComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
}

export const RaiseComplaintModal: React.FC<RaiseComplaintModalProps> = ({
  isOpen,
  onClose,
  tenantId,
}) => {
  const { addComplaint } = useData();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('General');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const sampleImages = [
    { label: 'Bathroom / Plumbing Issue', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600' },
    { label: 'Electrical / Wiring Issue', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600' },
    { label: 'Wi-Fi Router Issue', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addComplaint({
      tenant_id: tenantId,
      title,
      category,
      description,
      image_url: imageUrl || sampleImages[0].url,
    });

    setTitle('');
    setDescription('');
    setImageUrl('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Raise a Maintenance Complaint"
      description="Submit your issue ticket directly to hostel management for quick resolution."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Complaint Title *"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Bathroom tap leaking or Wi-Fi speed low"
          leftIcon={<MessageSquareWarning className="w-4 h-4 text-slate-400" />}
          required
        />

        <Select
          label="Category *"
          value={category}
          onChange={e => setCategory(e.target.value as ComplaintCategory)}
          options={[
            { label: 'Plumbing & Water', value: 'Plumbing' },
            { label: 'Electrical & Appliance', value: 'Electrical' },
            { label: 'Room Cleaning & Housekeeping', value: 'Cleaning' },
            { label: 'Wi-Fi & Internet', value: 'Wi-Fi' },
            { label: 'General Maintenance', value: 'General' },
          ]}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Issue Description *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Provide details about the issue, location in room, and preferred time for technician visit..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Photo Upload Simulation */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Image className="w-4 h-4 text-indigo-500" /> Upload Issue Photo
          </label>
          <div className="grid grid-cols-3 gap-2">
            {sampleImages.map((img, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setImageUrl(img.url)}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex flex-col items-center gap-1 overflow-hidden transition-all ${
                  imageUrl === img.url
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/50'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <img src={img.url} alt={img.label} className="w-full h-12 object-cover rounded-lg" />
                <span className="truncate w-full text-center text-slate-600 dark:text-slate-400">{img.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" leftIcon={<Send className="w-4 h-4" />}>
            Submit Complaint Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
};
