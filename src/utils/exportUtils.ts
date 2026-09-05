import { Tenant, Payment, Room, Complaint } from '../types';
import { formatCurrency, formatDate } from './formatters';
import * as XLSX from 'xlsx';

export const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (filename: string, sheetName: string, headers: string[], rows: (string | number)[][]) => {
  const data = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportTenantsToCSV = (tenants: Tenant[]) => {
  const headers = ['Tenant Name', 'Email', 'Phone', 'Room Number', 'Bed Number', 'Joining Date', 'Monthly Rent (INR)', 'Deposit (INR)', 'Emergency Contact', 'Status'];
  const rows = (tenants || []).map(t => [
    t.user?.name || 'N/A',
    t.user?.email || 'N/A',
    t.user?.phone || 'N/A',
    t.room?.room_number || 'N/A',
    t.bed?.bed_number || 'N/A',
    formatDate(t.joining_date),
    t.monthly_rent,
    t.deposit,
    `${t.emergency_name} (${t.emergency_phone})`,
    t.status
  ]);
  exportToCSV('Tenants_Directory_Report', headers, rows);
};

export const exportTenantsToExcel = (tenants: Tenant[]) => {
  const headers = ['Tenant Name', 'Email', 'Phone', 'Room Number', 'Bed Number', 'Joining Date', 'Monthly Rent (INR)', 'Deposit (INR)', 'Emergency Contact', 'Status'];
  const rows = (tenants || []).map(t => [
    t.user?.name || 'N/A',
    t.user?.email || 'N/A',
    t.user?.phone || 'N/A',
    t.room?.room_number || 'N/A',
    t.bed?.bed_number || 'N/A',
    formatDate(t.joining_date),
    t.monthly_rent,
    t.deposit,
    `${t.emergency_name} (${t.emergency_phone})`,
    t.status
  ]);
  exportToExcel('Tenants_Directory_Report', 'Tenants', headers, rows);
};

export const exportPaymentsToCSV = (payments: Payment[]) => {
  const headers = ['Receipt No', 'Tenant Name', 'Room No', 'Amount (INR)', 'Late Fee (INR)', 'Due Date', 'Payment Date', 'Payment Method', 'Status'];
  const rows = (payments || []).map(p => [
    p.receipt_no,
    p.tenant?.user?.name || 'N/A',
    p.tenant?.room?.room_number || 'N/A',
    p.amount,
    p.late_fee || 0,
    formatDate(p.due_date),
    p.payment_date ? formatDate(p.payment_date) : 'N/A',
    p.payment_method,
    p.status.toUpperCase()
  ]);
  exportToCSV('Payments_Ledger_Report', headers, rows);
};

export const exportPaymentsToExcel = (payments: Payment[]) => {
  const headers = ['Receipt No', 'Tenant Name', 'Room No', 'Amount (INR)', 'Late Fee (INR)', 'Due Date', 'Payment Date', 'Payment Method', 'Status'];
  const rows = (payments || []).map(p => [
    p.receipt_no,
    p.tenant?.user?.name || 'N/A',
    p.tenant?.room?.room_number || 'N/A',
    p.amount,
    p.late_fee || 0,
    formatDate(p.due_date),
    p.payment_date ? formatDate(p.payment_date) : 'N/A',
    p.payment_method,
    p.status.toUpperCase()
  ]);
  exportToExcel('Payments_Ledger_Report', 'Payments', headers, rows);
};

export const exportOccupancyToCSV = (rooms: Room[]) => {
  const headers = ['Room Number', 'Floor', 'Room Type', 'Total Beds', 'Occupied Beds', 'Vacant Beds', 'Monthly Rent (INR)', 'Occupancy %'];
  const rows = (rooms || []).map(r => {
    const occupied = r.beds?.filter(b => b.status === 'occupied').length || 0;
    const vacant = r.total_beds - occupied;
    const rate = Math.round((occupied / r.total_beds) * 100);
    return [
      r.room_number,
      r.floor,
      r.room_type,
      r.total_beds,
      occupied,
      vacant,
      r.monthly_rent,
      `${rate}%`
    ];
  });
  exportToCSV('Occupancy_Matrix_Report', headers, rows);
};
