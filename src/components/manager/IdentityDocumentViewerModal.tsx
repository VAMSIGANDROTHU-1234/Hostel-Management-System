import React, { useState } from 'react';
import { Tenant } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { maskIdNumber, formatDate, formatDateTime } from '../../utils/formatters';
import {
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Camera,
  ShieldCheck,
  Calendar,
  FileCheck,
  AlertTriangle,
  X,
  Lock,
  User
} from 'lucide-react';

interface IdentityDocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

export const IdentityDocumentViewerModal: React.FC<IdentityDocumentViewerModalProps> = ({
  isOpen,
  onClose,
  tenant,
}) => {
  const { role } = useAuth();

  // Zoom Lightbox State
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  if (!isOpen || !tenant) return null;

  // RBAC Guard: Only Hostel Managers can access identity documents
  if (role !== 'manager') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Access Restricted" maxWidth="sm">
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Manager Authorization Required</h4>
            <p className="text-xs text-slate-500 mt-1">
              Identity documents contain confidential PII data. Only Hostel Managers can view or download identity records.
            </p>
          </div>
          <Button variant="primary" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  const maskedId = maskIdNumber(tenant.id_type, tenant.id_proof_number || tenant.masked_id_number);
  const uploadDateStr = tenant.id_proof_upload_date ? formatDateTime(tenant.id_proof_upload_date) : formatDate(tenant.created_at || tenant.joining_date);
  const fileNameStr = tenant.id_proof_filename || `${tenant.id_type || 'identity'}_document_${tenant.user?.name?.toLowerCase().replace(/\s+/g, '_')}.png`;

  // Simulated Supabase Signed URL Generator (In production calls supabase.storage.from('tenant-id-proofs').createSignedUrl(path, 3600))
  const getSignedDocumentUrl = (rawUrl?: string): string | null => {
    if (!rawUrl) return null;
    if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) return rawUrl;
    // Sign simulation token parameter
    return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}token=sb_signed_private_${Date.now()}`;
  };

  const frontDocUrl = getSignedDocumentUrl(tenant.id_proof_url);
  const backDocUrl = getSignedDocumentUrl(tenant.id_proof_back_url);

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenZoom = (imgUrl: string) => {
    setZoomedImage(imgUrl);
    setZoomLevel(1);
    setRotation(0);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Enterprise Identity Dossier - ${tenant.user?.name}`}
        description="Secure private identity document viewer & verified live capture records."
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Header Summary Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200 dark:border-charcoal-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={tenant.live_photo_url || tenant.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                alt={tenant.user?.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{tenant.user?.name}</h4>
                  <Badge variant="success" size="sm">
                    <ShieldCheck className="w-3 h-3 mr-1" /> VERIFIED MANAGER RECORD
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Room {tenant.room?.room_number || '102'} (Bed {tenant.bed?.bed_number || '102-A'}) • {tenant.user?.email}
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Masked Document ID</span>
              <span className="font-mono font-extrabold text-red-600 dark:text-red-400 text-sm">{maskedId}</span>
            </div>
          </div>

          {/* Document Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Document Type</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100 uppercase mt-0.5 block">
                {(tenant.id_type || 'aadhaar')} CARD
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Uploaded File Name</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5 block" title={fileNameStr}>
                {fileNameStr}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-800/40 border border-slate-200 dark:border-charcoal-700">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Upload Timestamp</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5 block">
                {uploadDateStr}
              </span>
            </div>
          </div>

          {/* Live Captured Photo vs Document Proof Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" /> Private Document Assets (Supabase Signed Storage)
            </h4>

            {frontDocUrl ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Front Image Document */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">
                      {(tenant.id_type || 'Aadhaar').toUpperCase()} Document (Front)
                    </span>
                    <Badge variant="neutral" size="sm">Private Bucket</Badge>
                  </div>

                  <div className="relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-charcoal-800 aspect-video border border-slate-200 dark:border-charcoal-700 flex items-center justify-center">
                    <img
                      src={frontDocUrl}
                      alt="ID Proof Front"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<ZoomIn className="w-4 h-4" />}
                        onClick={() => handleOpenZoom(frontDocUrl)}
                      >
                        Zoom & Inspect
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={() => handleDownload(frontDocUrl, fileNameStr)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Back Image Document or Live Capture Photo */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">
                      {backDocUrl ? `${(tenant.id_type || 'Aadhaar').toUpperCase()} (Back)` : 'Live Captured Identity Photo'}
                    </span>
                    <Badge variant="success" size="sm">Webcam Verification</Badge>
                  </div>

                  <div className="relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-charcoal-800 aspect-video border border-slate-200 dark:border-charcoal-700 flex items-center justify-center">
                    <img
                      src={backDocUrl || tenant.live_photo_url || tenant.user?.avatar_url || frontDocUrl}
                      alt="Identity Back/Photo"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<ZoomIn className="w-4 h-4" />}
                        onClick={() => handleOpenZoom(backDocUrl || tenant.live_photo_url || frontDocUrl)}
                      >
                        Zoom & Inspect
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Missing Document Fallback Banner */
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-charcoal-800 rounded-2xl space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">No document uploaded</h4>
                <p className="text-xs text-slate-400">
                  No verified identity proof document file has been uploaded for this tenant record.
                </p>
              </div>
            )}
          </div>

          <Button variant="secondary" className="w-full" onClick={onClose}>
            Close Identity Viewer
          </Button>
        </div>
      </Modal>

      {/* Full-Screen Zoom Lightbox Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/90 backdrop-blur-md flex flex-col items-center justify-between p-6 select-none animate-in fade-in duration-200">
          {/* Lightbox Toolbar */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold">Identity Inspector Zoom — {tenant.user?.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
                className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-white"
                title="Rotate"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                title="Close Zoom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Zoomed Image Area */}
          <div className="flex-1 flex items-center justify-center overflow-hidden my-4 w-full">
            <img
              src={zoomedImage}
              alt="Zoomed Identity Proof"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Zoom: {Math.round(zoomLevel * 100)}% • Rotation: {rotation}°
          </div>
        </div>
      )}
    </>
  );
};
