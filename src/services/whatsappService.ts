import { Tenant, WhatsAppLog, WhatsAppMessageType, WhatsAppTemplate, WhatsAppConfig } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const formatWhatsAppPhone = (phone: string): string => {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 10) {
    clean = '91' + clean; // Default to India country code 91 if 10 digits
  }
  return clean;
};

export const parseWhatsAppTemplate = (
  templateBody: string,
  data: {
    tenantName: string;
    amount: number;
    dueDate: string;
    days?: number;
    roomNumber?: string;
    bedNumber?: string;
    lateFee?: number;
    hostelName?: string;
  }
): string => {
  let text = templateBody;
  text = text.replace(/{TenantName}/g, data.tenantName);
  text = text.replace(/{Tenant Name}/g, data.tenantName);
  text = text.replace(/{Amount}/g, data.amount.toLocaleString('en-IN'));
  text = text.replace(/{DueDate}/g, formatDate(data.dueDate));
  text = text.replace(/{Due Date}/g, formatDate(data.dueDate));
  text = text.replace(/{Days}/g, (data.days || 0).toString());
  text = text.replace(/{RoomNumber}/g, data.roomNumber || 'N/A');
  text = text.replace(/{BedNumber}/g, data.bedNumber || 'N/A');
  text = text.replace(/{LateFee}/g, (data.lateFee || 0).toLocaleString('en-IN'));
  text = text.replace(/{HostelName}/g, data.hostelName || 'HostelSphere');
  return text;
};

export const generateWhatsAppWebLink = (phone: string, text: string): string => {
  const cleanPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

export const openWhatsAppWeb = (phone: string, text: string): { success: boolean; error?: string } => {
  if (!phone || !phone.trim()) {
    return { success: false, error: 'Tenant phone number not available.' };
  }

  const cleanPhone = formatWhatsAppPhone(phone);
  if (!cleanPhone || cleanPhone.length < 10) {
    return { success: false, error: 'Tenant phone number not available.' };
  }

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    return { success: false, error: 'Popup blocked by browser. Please allow popups to open WhatsApp Web.' };
  }

  return { success: true };
};
