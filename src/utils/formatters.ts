import { IdDocumentType } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateTimeString?: string): string => {
  if (!dateTimeString) return 'N/A';
  const date = new Date(dateTimeString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const generateReceiptNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `REC-${new Date().getFullYear()}-${timestamp}${random}`;
};

export const maskIdNumber = (idType: IdDocumentType = 'aadhaar', idNumber?: string): string => {
  if (!idNumber || !idNumber.trim()) return 'XXXX-XXXX-XXXX';

  const clean = idNumber.replace(/\s+/g, '');

  if (idType === 'aadhaar') {
    // 12 digits -> XXXX XXXX 1234
    const last4 = clean.slice(-4);
    return `XXXX XXXX ${last4}`;
  } else if (idType === 'pan') {
    // 10 chars -> XXXXXX1234
    const last4 = clean.slice(-4);
    return `XXXXXX${last4}`;
  } else {
    // Passport / DL -> XXXX-XXXX-1234
    const last4 = clean.slice(-4);
    return `XXXX-XXXX-${last4}`;
  }
};
