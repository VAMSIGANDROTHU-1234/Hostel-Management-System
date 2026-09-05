import{q as c,v as g}from"./index-CmhwYX__.js";const x=(t,o)=>{var p,e,s,d,r,a,n,l;const i=window.open("","_blank");if(!i)return;const b=`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Receipt - ${t.receipt_no}</title>
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
              <div class="brand">${o.hostel_name}</div>
              <div style="font-size: 12px; color: #64748b;">${o.address}</div>
              <div style="font-size: 12px; color: #64748b;">Phone: ${o.contact_phone} | Email: ${o.contact_email}</div>
            </div>
            <div>
              <div class="receipt-title">PAYMENT RECEIPT</div>
              <div style="font-size: 12px; color: #64748b; text-align: right;">Receipt No: ${t.receipt_no}</div>
              <div style="font-size: 12px; color: #64748b; text-align: right;">Date: ${c(t.payment_date||new Date().toISOString())}</div>
            </div>
          </div>

          <div class="details-grid">
            <div>
              <strong>Tenant Details:</strong><br/>
              Name: ${((e=(p=t.tenant)==null?void 0:p.user)==null?void 0:e.name)||"Tenant"}<br/>
              Room: ${((d=(s=t.tenant)==null?void 0:s.room)==null?void 0:d.room_number)||"N/A"} (Bed ${((a=(r=t.tenant)==null?void 0:r.bed)==null?void 0:a.bed_number)||"N/A"})<br/>
              Phone: ${((l=(n=t.tenant)==null?void 0:n.user)==null?void 0:l.phone)||"N/A"}
            </div>
            <div>
              <strong>Payment Summary:</strong><br/>
              Payment Method: ${t.payment_method}<br/>
              Status: <span style="color: #16a34a; font-weight: bold;">${t.status.toUpperCase()}</span><br/>
              Due Date: ${c(t.due_date)}
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
                <td>Monthly Rent Fee (${c(t.due_date)})</td>
                <td style="text-align: right;">₹${t.amount.toLocaleString()}</td>
              </tr>
              ${t.late_fee>0?`
              <tr>
                <td>Late Charges Fee</td>
                <td style="text-align: right;">₹${t.late_fee.toLocaleString()}</td>
              </tr>`:""}
              <tr class="total-row">
                <td>Total Amount Paid</td>
                <td style="text-align: right;">₹${(t.amount+t.late_fee).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            This is a computer-generated receipt issued by ${o.hostel_name}. No signature required.
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        <\/script>
      </body>
    </html>
  `;i.document.write(b),i.document.close()},f=(t,o)=>{var e,s,d,r,a,n,l,h;const i=window.open("","_blank");if(!i)return;const b=g(t.id_type,t.id_proof_number||t.masked_id_number),p=`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Police Verification Form - ${(e=t.user)==null?void 0:e.name}</title>
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
            <div class="subtitle">Issued under Local Station Jurisdiction Regulations • ${o.hostel_name}</div>
          </div>

          <div class="profile-section">
            <div class="photo-box">
              ${t.live_photo_url||(s=t.user)!=null&&s.avatar_url?`<img src="${t.live_photo_url||((d=t.user)==null?void 0:d.avatar_url)}" alt="Tenant Photo" />`:"OFFICIAL LIVE CAPTURED PHOTO"}
            </div>
            <div style="flex: 1;">
              <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #0f172a;">${(r=t.user)==null?void 0:r.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #64748b;">Hostel Resident • Active Occupant</p>
              <div style="margin-top: 10px; font-size: 12px;">
                <strong>Assigned Accommodation:</strong> Room ${((a=t.room)==null?void 0:a.room_number)||"102"} (Bed ${((n=t.bed)==null?void 0:n.bed_number)||"102-A"})<br/>
                <strong>Admission Joining Date:</strong> ${c(t.joining_date)}
              </div>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <td class="label">Full Legal Name</td>
              <td>${(l=t.user)==null?void 0:l.name}</td>
            </tr>
            <tr>
              <td class="label">Mobile Phone Number</td>
              <td>${(h=t.user)==null?void 0:h.phone}</td>
            </tr>
            <tr>
              <td class="label">Identity Proof Document Type</td>
              <td style="text-transform: uppercase; font-weight: 700;">${t.id_type||"aadhaar"} CARD</td>
            </tr>
            <tr>
              <td class="label">Masked Identity Document No</td>
              <td style="font-family: monospace; font-weight: 700; color: #dc2626;">${b}</td>
            </tr>
            <tr>
              <td class="label">Emergency Contact Person</td>
              <td>${t.emergency_name} (${t.emergency_phone})</td>
            </tr>
            <tr>
              <td class="label">Hostel Facility Name & Address</td>
              <td>${o.hostel_name}, ${o.address}</td>
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
        <\/script>
      </body>
    </html>
  `;i.document.write(p),i.document.close()},_=(t,o)=>{const i=window.open("","_blank");if(!i)return;const b=t.map((e,s)=>{var d,r,a,n,l;return`
    <tr>
      <td>${s+1}</td>
      <td><strong>${((d=e.user)==null?void 0:d.name)||"N/A"}</strong></td>
      <td>${((r=e.user)==null?void 0:r.email)||"N/A"}<br/><span style="color:#64748b; font-size:11px;">${((a=e.user)==null?void 0:a.phone)||""}</span></td>
      <td>Room ${((n=e.room)==null?void 0:n.room_number)||"N/A"} (Bed ${((l=e.bed)==null?void 0:l.bed_number)||"N/A"})</td>
      <td>${c(e.joining_date)}</td>
      <td>₹${(e.monthly_rent||0).toLocaleString()}</td>
      <td>${e.emergency_name||"N/A"} (${e.emergency_phone||"N/A"})</td>
      <td><span style="color: ${e.status==="active"?"#16a34a":"#64748b"}; font-weight: bold;">${e.status.toUpperCase()}</span></td>
    </tr>
  `}).join(""),p=`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tenants Master Report - ${o.hostel_name}</title>
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
            <div class="brand">${o.hostel_name}</div>
            <div style="font-size: 12px; color: #64748b;">${o.address}</div>
          </div>
          <div>
            <div class="report-title">TENANTS MASTER DIRECTORY REPORT</div>
            <div style="font-size: 11px; color: #64748b; text-align: right;">Generated on: ${c(new Date().toISOString())}</div>
            <div style="font-size: 11px; color: #64748b; text-align: right;">Total Residents: ${t.length}</div>
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
            ${b}
          </tbody>
        </table>

        <div class="footer">
          Confidential Document • Computer Generated Master Directory Report for ${o.hostel_name}.
        </div>

        <script>
          window.onload = function() { window.print(); }
        <\/script>
      </body>
    </html>
  `;i.document.write(p),i.document.close()};export{x as a,_ as e,f as g};
