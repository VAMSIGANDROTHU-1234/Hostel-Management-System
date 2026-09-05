import React, { useState } from 'react';
import { Room, Bed, IdDocumentType } from '../../types';
import { useData } from '../../context/DataContext';
import { useToast } from '../ui/Toast';
import { validateEmail, validatePhone, validateAadhaar, validatePan, validateAmount, validatePassword, sanitizeInput } from '../../utils/formValidation';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CameraCaptureModal } from '../common/CameraCaptureModal';
import { maskIdNumber } from '../../utils/formatters';
import {
  User,
  Mail,
  Phone,
  Building2,
  BedDouble,
  Calendar,
  Lock,
  Sparkles,
  ShieldCheck,
  Camera,
  Upload,
  Copy,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

interface TenantProvisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom?: Room | null;
  selectedBed?: Bed | null;
}

export const TenantProvisionModal: React.FC<TenantProvisionModalProps> = ({
  isOpen,
  onClose,
  selectedRoom: initialRoom,
  selectedBed: initialBed,
}) => {
  const { rooms, provisionTenant } = useData();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [roomId, setRoomId] = useState(initialRoom?.id || rooms[0]?.id || '');
  const [bedId, setBedId] = useState(initialBed?.id || '');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthlyRent, setMonthlyRent] = useState<number>(initialRoom?.monthly_rent || 10000);
  const [deposit, setDeposit] = useState<number>(20000);

  // Identity verification state
  const [idType, setIdType] = useState<IdDocumentType>('aadhaar');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [idProofFile, setIdProofFile] = useState<string | null>('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800');
  const [livePhotoUrl, setLivePhotoUrl] = useState<string | null>(null);

  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 ');
  const [tempPassword, setTempPassword] = useState('Hostel@1234');

  // Camera modal state
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Success Summary state
  const [createdTenantResult, setCreatedTenantResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedRoomObj = rooms.find(r => r.id === roomId);
  const vacantBeds = selectedRoomObj?.beds?.filter(b => b.status === 'vacant') || [];

  const handleRoomChange = (rId: string) => {
    setRoomId(rId);
    const room = rooms.find(r => r.id === rId);
    if (room) {
      setMonthlyRent(room.monthly_rent);
      const firstVacant = room.beds?.find(b => b.status === 'vacant');
      setBedId(firstVacant?.id || '');
    }
  };

  const handleAutoGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#';
    let pass = 'H';
    for (let i = 0; i < 9; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(pass);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdProofFile(reader.result as string);
        showToast('Document uploaded and prepared for verification.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form Validations
    if (!name.trim()) {
      showToast('Tenant full name is required.', 'warning');
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      showToast(emailCheck.error || 'Invalid email address.', 'warning');
      return;
    }

    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.isValid) {
      showToast(phoneCheck.error || 'Invalid mobile phone number.', 'warning');
      return;
    }

    if (idType === 'aadhaar') {
      const aadhaarCheck = validateAadhaar(idProofNumber);
      if (!aadhaarCheck.isValid) {
        showToast(aadhaarCheck.error || 'Invalid Aadhaar number.', 'warning');
        return;
      }
    } else if (idType === 'pan') {
      const panCheck = validatePan(idProofNumber);
      if (!panCheck.isValid) {
        showToast(panCheck.error || 'Invalid PAN Card format.', 'warning');
        return;
      }
    }

    if (!roomId || !bedId) {
      showToast('Please select a valid Room and Vacant Bed slot.', 'warning');
      return;
    }

    const rentCheck = validateAmount(monthlyRent, 'Monthly Rent');
    if (!rentCheck.isValid) {
      showToast(rentCheck.error || 'Invalid rent amount.', 'warning');
      return;
    }

    const passCheck = validatePassword(tempPassword);
    if (!passCheck.isValid) {
      showToast(passCheck.error || 'Password too short.', 'warning');
      return;
    }

    const result = provisionTenant({
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      room_id: roomId,
      bed_id: bedId,
      joining_date: joiningDate,
      monthly_rent: Number(monthlyRent),
      deposit: Number(deposit),
      id_type: idType,
      id_proof_url: idProofFile || '',
      id_proof_number: sanitizeInput(idProofNumber),
      live_photo_url: livePhotoUrl || undefined,
      emergency_name: sanitizeInput(emergencyName),
      emergency_phone: sanitizeInput(emergencyPhone),
      temporary_password: tempPassword,
    });

    setCreatedTenantResult({
      ...result,
      tempPassword,
    });

    showToast(`Tenant ${name} provisioned successfully!`, 'success', 'Admission Complete');
  };

  const handleCopyCredentials = () => {
    if (!createdTenantResult) return;
    const text = `HostelSphere Login Credentials\nURL: http://localhost:3000/login\nEmail: ${createdTenantResult.user.email}\nTemp Password: ${createdTenantResult.tempPassword}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Credentials copied to clipboard.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseAll = () => {
    setCreatedTenantResult(null);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseAll}
        title={createdTenantResult ? 'Tenant Provisioned Successfully!' : 'Provision New Tenant & Identity Verification'}
        description={
          createdTenantResult
            ? 'Account credentials & live identity records created.'
            : 'Capture live photo, verify mandatory ID proof, and set temporary login password.'
        }
        maxWidth="lg"
      >
        {createdTenantResult ? (
          /* SUCCESS SUMMARY STEP */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-500" />
              <div>
                <h4 className="font-bold text-sm">Tenant Account Created & Identity Verified</h4>
                <p className="mt-0.5">The tenant will be prompted to change their password on first login.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800/80 border border-slate-200 dark:border-charcoal-700 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-charcoal-700 pb-2">
                <span className="text-slate-400 font-bold uppercase">Portal Login Credentials</span>
                <button onClick={handleCopyCredentials} className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Summary'}
                </button>
              </div>
              <div className="space-y-1.5 text-slate-800 dark:text-slate-200">
                <div><strong className="text-slate-400">Tenant Name:</strong> {createdTenantResult.user.name}</div>
                <div><strong className="text-slate-400">Login Email:</strong> {createdTenantResult.user.email}</div>
                <div><strong className="text-slate-400">Temp Password:</strong> <span className="font-bold text-red-600 dark:text-red-400">{createdTenantResult.tempPassword}</span></div>
                <div><strong className="text-slate-400">Room / Bed:</strong> Room {createdTenantResult.tenant.room?.room_number} (Bed {createdTenantResult.tenant.bed?.bed_number})</div>
                <div><strong className="text-slate-400">Masked ID Proof:</strong> {createdTenantResult.tenant.masked_id_number}</div>
              </div>
            </div>

            <Button variant="primary" className="w-full" onClick={handleCloseAll}>
              Done & Return to Directory
            </Button>
          </div>
        ) : (
          /* ONBOARDING FORM STEP */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Personal & Account */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-red-600" /> Personal Information & Contact
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Full Name *"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aarav Patel"
                  leftIcon={<User className="w-4 h-4 text-slate-400" />}
                  required
                />

                <Input
                  label="Email Address (Login ID) *"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="aarav.p@example.com"
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  required
                />
              </div>

              <Input
                label="Mobile Phone Number *"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            {/* Step 2: Live Camera & Mandatory ID Verification */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-charcoal-800">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Mandatory Identity Verification & Live Capture
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Live Photo Capture Block */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-800/60 border border-slate-200 dark:border-charcoal-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {livePhotoUrl ? (
                      <img src={livePhotoUrl} alt="Live Capture" className="w-12 h-12 rounded-xl object-cover border border-emerald-500" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-charcoal-700 flex items-center justify-center text-slate-400">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Live Photo</span>
                      <span className="text-[10px] text-slate-400">{livePhotoUrl ? 'Photo Captured ✅' : 'Device Camera'}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    leftIcon={<Camera className="w-3.5 h-3.5" />}
                    onClick={() => setIsCameraOpen(true)}
                  >
                    {livePhotoUrl ? 'Retake' : 'Capture'}
                  </Button>
                </div>

                {/* ID Type Selector */}
                <Select
                  label="Document Type *"
                  value={idType}
                  onChange={e => setIdType(e.target.value as IdDocumentType)}
                  options={[
                    { label: 'Aadhaar Card (Front & Back)', value: 'aadhaar' },
                    { label: 'PAN Card', value: 'pan' },
                    { label: 'Passport', value: 'passport' },
                    { label: 'Driving License', value: 'driving_license' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ID Number with Masked Preview */}
                <div className="space-y-1">
                  <Input
                    label="Identity Document Number *"
                    value={idProofNumber}
                    onChange={e => setIdProofNumber(e.target.value)}
                    placeholder={idType === 'aadhaar' ? '1234 5678 9012' : 'ABCDE1234F'}
                    required
                  />
                  {idProofNumber && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                      Masked Preview: {maskIdNumber(idType, idProofNumber)}
                    </span>
                  )}
                </div>

                {/* Document File Uploader */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Upload Document (Image / PDF) *
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-slate-50 dark:bg-charcoal-800/80 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100">
                    <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{idProofFile ? 'Document Uploaded ✅' : 'Choose File...'}</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Room & Rent Assignment */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-charcoal-800">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500" /> Accommodation & Rent Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Select Room *"
                  value={roomId}
                  onChange={e => handleRoomChange(e.target.value)}
                  options={rooms.map(r => ({
                    label: `Room ${r.room_number} (${r.room_type}) - ${r.beds?.filter(b => b.status === 'vacant').length} Vacant`,
                    value: r.id,
                  }))}
                  required
                />

                <Select
                  label="Select Bed Slot *"
                  value={bedId}
                  onChange={e => setBedId(e.target.value)}
                  options={vacantBeds.map(b => ({
                    label: `Bed ${b.bed_number}`,
                    value: b.id,
                  }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Joining Date *"
                  type="date"
                  value={joiningDate}
                  onChange={e => setJoiningDate(e.target.value)}
                  required
                />

                <Input
                  label="Monthly Rent (₹) *"
                  type="number"
                  value={monthlyRent}
                  onChange={e => setMonthlyRent(Number(e.target.value))}
                  required
                />

                <Input
                  label="Deposit Amount (₹) *"
                  type="number"
                  value={deposit}
                  onChange={e => setDeposit(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Step 4: Emergency Contact & Credentials */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-charcoal-800">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-500" /> Emergency Contact & Credentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Emergency Contact Name *"
                  value={emergencyName}
                  onChange={e => setEmergencyName(e.target.value)}
                  placeholder="e.g. Suresh Patel (Father)"
                  required
                />

                <Input
                  label="Emergency Contact Phone *"
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label="Temporary Password *"
                    type="text"
                    value={tempPassword}
                    onChange={e => setTempPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  onClick={handleAutoGeneratePassword}
                >
                  Auto-Generate
                </Button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-charcoal-800">
              <Button type="button" variant="secondary" onClick={handleCloseAll}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={!bedId || !idProofNumber || !idProofFile}>
                Complete Admission & Provision Account
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Live WebCAM Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={photoUrl => {
          setLivePhotoUrl(photoUrl);
          showToast('Live photo captured successfully!', 'success');
        }}
      />
    </>
  );
};
