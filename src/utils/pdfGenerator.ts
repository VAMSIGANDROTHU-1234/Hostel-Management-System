import { Payment, HostelSettings, Tenant } from '../types';
import { formatCurrency, formatDate, maskIdNumber } from './formatters';

export const generatePaymentPDFReceipt = (payment: Payment, settings: HostelSettings) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Receipt - ${payment.receipt_no}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
          .receipt-box { max-width: 700px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; border-b: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 20px; }
          .brand { font-size: 24px; font-weight: 800; color: #dc2626; }
          .receipt-title { font-size: 20px; font-weight: 700; text-align: right; color: #0f172a; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size: 14px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 14px; }
          .table th { background-color: #f8fafc; font-weight: 700; }
          .total-row { font-size: 16px; font-weight: 800; color: #dc2626; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #64748b; border-t: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <div>
              <div class="brand">${settings.hostel_name}</div>
              <div style="font-size: 12px; color: #64748b;">${settings.address}</div>
              <div style="font-size: 12px; color: #64748b;">Phone: ${settings.contact_phone} | Email: ${settings.contact_email}</div>
            </div>
            <div>
              <div class="receipt-title">PAYMENT RECEIPT</div>
              <div style="font-size: 12px; color: #64748b; text-align: right;">Receipt No: ${payment.receipt_no}</div>
              <div style="font-size: 12px; color: #64748b; text-align: right;">Date: ${formatDate(payment.payment_date || new Date().toISOString())}</div>
            </div>
          </div>

          <div class="details-grid">
            <div>
              <strong>Tenant Details:</strong><br/>
              Name: ${payment.tenant?.user?.name || 'Tenant'}<br/>
              Room: ${payment.tenant?.room?.room_number || 'N/A'} (Bed ${payment.tenant?.bed?.bed_number || 'N/A'})<br/>
              Phone: ${payment.tenant?.user?.phone || 'N/A'}
            </div>
            <div>
              <strong>Payment Summary:</strong><br/>
              Payment Method: ${payment.payment_method}<br/>
              Status: <span style="color: #16a34a; font-weight: bold;">${payment.status.toUpperCase()}</span><br/>
              Due Date: ${formatDate(payment.due_date)}
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly Rent Fee (${formatDate(payment.due_date)})</td>
                <td style="text-align: right;">₹${payment.amount.toLocaleString()}</td>
              </tr>
              ${payment.late_fee > 0 ? `
              <tr>
                <td>Late Charges Fee</td>
                <td style="text-align: right;">₹${payment.late_fee.toLocaleString()}</td>
              </tr>` : ''}
              <tr class="total-row">
                <td>Total Amount Paid</td>
                <td style="text-align: right;">₹${(payment.amount + payment.late_fee).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            This is a computer-generated receipt issued by ${settings.hostel_name}. No signature required.
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const generatePoliceVerificationPDF = (tenant: Tenant, settings: HostelSettings) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const maskedId = maskIdNumber(tenant.id_type, tenant.id_proof_number || tenant.masked_id_number);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Police Verification Form - ${tenant.user?.name}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #0f172a; line-height: 1.4; }
          .container { max-width: 800px; margin: auto; border: 2px solid #1e293b; padding: 30px; border-radius: 8px; }
          .header { text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: 800; text-transform: uppercase; color: #dc2626; letter-spacing: 1px; }
          .subtitle { font-size: 13px; font-weight: 600; color: #475569; margin-top: 4px; }
          .profile-section { display: flex; gap: 20px; margin-bottom: 20px; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; background: #f8fafc; }
          .photo-box { width: 120px; height: 140px; border: 2px border-dashed #94a3b8; border-radius: 6px; overflow: hidden; background: #e2e8f0; flex-shrink: 0; text-align: center; font-size: 10px; }
          .photo-box img { width: 100%; height: 100%; object-fit: cover; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .info-table td { padding: 8px 12px; border: 1px solid #cbd5e1; font-size: 13px; }
          .info-table td.label { font-weight: 700; background: #f1f5f9; width: 35%; color: #334155; }
          .declaration { margin-top: 25px; font-size: 12px; color: #334155; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          .signature-grid { display: flex; justify-content: space-between; margin-top: 50px; font-size: 12px; font-weight: 700; }
          .seal-box { border: 1px border-dashed #94a3b8; width: 120px; height: 60px; text-align: center; font-size: 10px; color: #94a3b8; line-height: 60px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">TENANT ADMISSION & POLICE VERIFICATION INTIMATION FORM</div>
            <div class="subtitle">Issued under Local Station Jurisdiction Regulations • ${settings.hostel_name}</div>
          </div>

          <div class="profile-section">
            <div class="photo-box">
              ${tenant.live_photo_url || tenant.user?.avatar_url
                ? `<img src="${tenant.live_photo_url || tenant.user?.avatar_url}" alt="Tenant Photo" />`
                : 'OFFICIAL LIVE CAPTURED PHOTO'}
            </div>
            <div style="flex: 1;">
              <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #0f172a;">${tenant.user?.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #64748b;">Hostel Resident • Active Occupant</p>
              <div style="margin-top: 10px; font-size: 12px;">
                <strong>Assigned Accommodation:</strong> Room ${tenant.room?.room_number || '102'} (Bed ${tenant.bed?.bed_number || '102-A'})<br/>
                <strong>Admission Joining Date:</strong> ${formatDate(tenant.joining_date)}
              </div>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <td class="label">Full Legal Name</td>
              <td>${tenant.user?.name}</td>
            </tr>
            <tr>
              <td class="label">Mobile Phone Number</td>
              <td>${tenant.user?.phone}</td>
            </tr>
            <tr>
              <td class="label">Identity Proof Document Type</td>
              <td style="text-transform: uppercase; font-weight: 700;">${tenant.id_type || 'aadhaar'} CARD</td>
            </tr>
            <tr>
              <td class="label">Masked Identity Document No</td>
              <td style="font-family: monospace; font-weight: 700; color: #dc2626;">${maskedId}</td>
            </tr>
            <tr>
              <td class="label">Emergency Contact Person</td>
              <td>${tenant.emergency_name} (${tenant.emergency_phone})</td>
            </tr>
            <tr>
              <td class="label">Hostel Facility Name & Address</td>
              <td>${settings.hostel_name}, ${settings.address}</td>
            </tr>
          </table>

          <div class="declaration">
            <strong>Declaration by Hostel Management:</strong><br/>
            I hereby certify that the resident information stated above has been verified against valid government-issued identity proof documents and live identity photo capture during admission onboarding.
          </div>

          <div class="signature-grid">
            <div>
              <div>______________________________</div>
              <div style="margin-top: 4px;">Resident Tenant Signature</div>
            </div>
            <div class="seal-box">HOSTEL SEAL STAMP</div>
            <div style="text-align: right;">
              <div>______________________________</div>
              <div style="margin-top: 4px;">Authorized Hostel Manager Signature</div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const exportTenantsPDF = (tenants: Tenant[], settings: HostelSettings) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const tenantRowsHtml = tenants.map((t, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${t.user?.name || 'N/A'}</strong></td>
      <td>${t.user?.email || 'N/A'}<br/><span style="color:#64748b; font-size:11px;">${t.user?.phone || ''}</span></td>
      <td>Room ${t.room?.room_number || 'N/A'} (Bed ${t.bed?.bed_number || 'N/A'})</td>
      <td>${formatDate(t.joining_date)}</td>
      <td>₹${(t.monthly_rent || 0).toLocaleString()}</td>
      <td>${t.emergency_name || 'N/A'} (${t.emergency_phone || 'N/A'})</td>
      <td><span style="color: ${t.status === 'active' ? '#16a34a' : '#64748b'}; font-weight: bold;">${t.status.toUpperCase()}</span></td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tenants Master Report - ${settings.hostel_name}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #0f172a; line-height: 1.4; }
          .header { display: flex; justify-content: space-between; border-b: 2px solid #dc2626; padding-bottom: 15px; margin-bottom: 20px; }
          .brand { font-size: 22px; font-weight: 800; color: #dc2626; }
          .report-title { font-size: 18px; font-weight: 700; text-align: right; color: #0f172a; }
          .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .table th, .table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
          .table th { background-color: #f8fafc; font-weight: 700; color: #334155; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">${settings.hostel_name}</div>
            <div style="font-size: 12px; color: #64748b;">${settings.address}</div>
          </div>
          <div>
            <div class="report-title">TENANTS MASTER DIRECTORY REPORT</div>
            <div style="font-size: 11px; color: #64748b; text-align: right;">Generated on: ${formatDate(new Date().toISOString())}</div>
            <div style="font-size: 11px; color: #64748b; text-align: right;">Total Residents: ${tenants.length}</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tenant Name</th>
              <th>Contact Info</th>
              <th>Accommodation</th>
              <th>Joining Date</th>
              <th>Monthly Rent</th>
              <th>Emergency Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tenantRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          Confidential Document • Computer Generated Master Directory Report for ${settings.hostel_name}.
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
