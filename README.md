<img width="1376" height="768" alt="hostelsphere_saas_cover_1788602558333" src="https://github.com/user-attachments/assets/47aa437f-6355-4480-8ad3-78d35dc940d9" />
# 🏢 HostelSphere SaaS — Enterprise Hostel & PG Management System

[![React](https://img.shields.io/badge/React-18.x-blue.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**HostelSphere SaaS** is an enterprise-grade, commercial Hostel & Paying Guest (PG) Management System designed for hostel owners, facility managers, and tenants. It features single-owner Manager authentication, tenant portals, a 5-tier WhatsApp automated reminder engine, live room & bed matrix trackers, identity verification with live camera capture, automated PDF receipts, and multi-format data exports (Excel, CSV, PDF, JSON Backups).

---

## 🌟 Key Features

### 1. 📲 Smart WhatsApp Reminder Engine
- **Automated 5-Tier Due Categorization**: `Due in 2 Days`, `Due Tomorrow`, `Due Today`, `Overdue 1–7 Days`, `Overdue > 7 Days`.
- **1-Click Direct WhatsApp Dispatches**: Formats templates with tenant name, rent amount, due date, and opens `wa.me` links pre-filled.
- **Instant Payment Synchronization**: Paid tenants are automatically removed from reminder queues in real-time.

### 2. 🛏️ Interactive Room & Bed Management Grid
- Visual room matrix displaying real-time bed statuses (`Occupied` vs `Vacant`).
- Floor-wise filtering, room type categories, and live Empty Bed Tracker.

### 3. 🆔 Tenant Onboarding & Identity Security Vault
- Direct tenant account provisioning with temporary login passwords.
- **Identity Documents**: Aadhaar, PAN, Driving License, Passport upload with masked ID numbers (`XXXX XXXX 9012`).
- **Live WebRTC Camera Capture**: Capture live resident identity photos directly during onboarding.
- **Police Verification Generator**: 1-click PDF export of official Police Verification forms pre-populated with tenant details.

### 4. 💰 Payment Ledger & UPI QR Gateway
- Automated **PDF Rent Receipt Generator** with unique receipt numbers (`REC-2026-XXXX`).
- **Instant UPI QR Code Generator**: Dynamic UPI QR codes (`upi://pay`) for 1-click scanning on PhonePe, GPay, Paytm, and BHIM UPI.

### 5. 📊 Multi-Format Analytics & Data Exports
- Export Tenants Directory, Payment Ledger, and Occupancy Matrix to **Excel (`.xlsx`)**, **CSV**, and **PDF**.
- **JSON System Backup & Recovery**: 1-click export of complete database JSON backups with instant file restoration.

### 6. 🎨 Dark Mode & Global AI Command Palette
- Smooth **Dark & Light Mode Theme Toggle** with `localStorage` preference persistence.
- **Global Search Palette (`Ctrl + K`)**: Instant search across tenants, mobile numbers, rooms, beds, receipt numbers, complaints, and visitor logs.

---

## 🛠️ Quick Start & Installation

```bash
# 1. Clone Repository
git clone https://github.com/your-username/hostelsphere-saas.git
cd hostelsphere-saas

# 2. Install Dependencies
npm install

# 3. Start Development Server
npm run dev
