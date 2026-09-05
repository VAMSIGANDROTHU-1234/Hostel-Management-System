import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LocalDataService } from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import { Settings, Building, Phone, Mail, MapPin, DollarSign, CreditCard, Save, CheckCircle2, MessageSquare, Database, Download, Upload } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, whatsappConfig, updateWhatsAppConfig } = useData();
  const { showToast } = useToast();

  const [hostelName, setHostelName] = useState(settings.hostel_name);
  const [contactPhone, setContactPhone] = useState(settings.contact_phone);
  const [contactEmail, setContactEmail] = useState(settings.contact_email);
  const [address, setAddress] = useState(settings.address);
  const [upiId, setUpiId] = useState(settings.upi_id);
  const [lateFee, setLateFee] = useState(settings.late_fee_per_day);
  const [dueDay, setDueDay] = useState(settings.rent_due_day);
  const [razorpayKey, setRazorpayKey] = useState(settings.razorpay_key_id);

  // Meta WhatsApp Config state
  const [accessToken, setAccessToken] = useState(whatsappConfig.access_token);
  const [phoneNumberId, setPhoneNumberId] = useState(whatsappConfig.phone_number_id);
  const [businessAccountId, setBusinessAccountId] = useState(whatsappConfig.business_account_id);
  const [webhookUrl, setWebhookUrl] = useState(whatsappConfig.webhook_url);
  const [sandboxMode, setSandboxMode] = useState(whatsappConfig.sandbox_mode);

  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      hostel_name: hostelName,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      address,
      upi_id: upiId,
      late_fee_per_day: Number(lateFee),
      rent_due_day: Number(dueDay),
      razorpay_key_id: razorpayKey,
    });

    updateWhatsAppConfig({
      access_token: accessToken,
      phone_number_id: phoneNumberId,
      business_account_id: businessAccountId,
      webhook_url: webhookUrl,
      sandbox_mode: sandboxMode,
    });

    setIsSaved(true);
    showToast('Settings & API configurations saved successfully!', 'success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportBackup = () => {
    LocalDataService.exportBackupJSON();
    showToast('Database backup exported to JSON file.', 'success');
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const res = LocalDataService.restoreBackupJSON(content);
        if (res.success) {
          showToast('Database restored successfully! Reloading system state...', 'success');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showToast(res.error || 'Failed to restore backup.', 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl w-full">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-red-600" /> Hostel Settings & API Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">Configure hostel branding, late fee rules, Meta WhatsApp Cloud API credentials, and database backups.</p>
      </div>

      {/* Card 0: Data Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Database className="w-5 h-5" /> Database Backup & Recovery System
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Full System Snapshot</h4>
            <p className="text-xs text-slate-500 mt-0.5">Export all rooms, tenants, payments, complaints, logs, and settings to a JSON backup.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4 text-indigo-600" />}
              onClick={handleExportBackup}
            >
              Export JSON Backup
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleRestoreBackup}
              accept=".json"
              className="hidden"
            />

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Upload className="w-4 h-4 text-emerald-600" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Restore Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Hostel Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-red-600" /> Hostel Profile & Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Hostel / PG Business Name"
              value={hostelName}
              onChange={e => setHostelName(e.target.value)}
              leftIcon={<Building className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Phone"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                required
              />

              <Input
                label="Contact Email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            <Input
              label="Physical Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
              required
            />
          </CardContent>
        </Card>

        {/* Card 2: Rent & Late Fee Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" /> Rent & Overdue Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Default Rent Due Day of Month (e.g. 5th)"
                type="number"
                min={1}
                max={28}
                value={dueDay}
                onChange={e => setDueDay(Number(e.target.value))}
                required
              />

              <Input
                label="Late Fee Charge Rate (₹ per day post due date)"
                type="number"
                min={0}
                value={lateFee}
                onChange={e => setLateFee(Number(e.target.value))}
                required
              />
            </div>

            <Input
              label="Hostel Official UPI VPA ID (for QR Payments)"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              required
            />
          </CardContent>
        </Card>

        {/* Card 3: Meta WhatsApp Cloud API Architecture Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="w-5 h-5" /> Meta WhatsApp Cloud API Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-charcoal-800/80">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Sandbox Mode (Simulated WhatsApp API vs Production Graph API)
              </span>
              <button
                type="button"
                onClick={() => setSandboxMode(!sandboxMode)}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                  sandboxMode ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-emerald-500 text-white'
                }`}
              >
                {sandboxMode ? 'SANDBOX ACTIVE' : 'LIVE META CLOUD API'}
              </button>
            </div>

            <Input
              label="Meta Access Token (System User Token)"
              type="password"
              value={accessToken}
              onChange={e => setAccessToken(e.target.value)}
              placeholder="EAAG..."
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number ID"
                value={phoneNumberId}
                onChange={e => setPhoneNumberId(e.target.value)}
                placeholder="109876543210987"
                required
              />

              <Input
                label="WhatsApp Business Account ID"
                value={businessAccountId}
                onChange={e => setBusinessAccountId(e.target.value)}
                placeholder="987654321098765"
                required
              />
            </div>

            <Input
              label="Meta Webhook Callback URL"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://api.hostelsphere.com/webhooks/whatsapp"
              required
            />
          </CardContent>
        </Card>

        {/* Card 4: Razorpay Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" /> Razorpay Online Gateway Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Razorpay Key ID"
              value={razorpayKey}
              onChange={e => setRazorpayKey(e.target.value)}
              placeholder="rzp_test_..."
              required
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> All Configurations Saved!
            </span>
          ) : (
            <span />
          )}

          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-5 h-5" />}>
            Save All Configurations
          </Button>
        </div>
      </form>
    </div>
  );
};
