import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Camera, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedPhoto(null);
      setError(null);
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError('Unable to access device camera. Please allow camera permissions in browser.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleSave = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live Identity Photo Capture"
      description="Capture tenant live photo using device camera for verification."
      maxWidth="md"
    >
      <div className="space-y-4">
        {error ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-charcoal-950 aspect-video border border-slate-200 dark:border-charcoal-800 flex items-center justify-center">
            {capturedPhoto ? (
              <img src={capturedPhoto} alt="Captured Tenant" className="w-full h-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-charcoal-800">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          {capturedPhoto ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleRetake}>
                Retake Photo
              </Button>
              <Button variant="primary" leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={handleSave}>
                Save Photo
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              disabled={!!error}
              leftIcon={<Camera className="w-4 h-4" />}
              onClick={handleTakeSnapshot}
            >
              Capture Snapshot
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
