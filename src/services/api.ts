import { Room, Tenant, Payment, Complaint, Visitor, HostelSettings, User, WhatsAppLog, WhatsAppTemplate, WhatsAppConfig } from '../types';

const STORAGE_KEYS = {
  USERS: 'hostelsphere_users',
  ROOMS: 'hostelsphere_rooms',
  TENANTS: 'hostelsphere_tenants',
  PAYMENTS: 'hostelsphere_payments',
  COMPLAINTS: 'hostelsphere_complaints',
  VISITORS: 'hostelsphere_visitors',
  SETTINGS: 'hostelsphere_settings',
  WHATSAPP_LOGS: 'hostelsphere_whatsapp_logs',
  WHATSAPP_TEMPLATES: 'hostelsphere_whatsapp_templates',
  WHATSAPP_CONFIG: 'hostelsphere_whatsapp_config',
};

// Permanent Manager Account
const managerUser: User = {
  id: 'user-mgr-1',
  name: 'Vamsi Gandrothu',
  email: 'vamsigandrothu@gmail.com',
  password: 'vamsigandu',
  phone: '+91 98765 43210',
  role: 'manager',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  must_change_password: false,
  is_deactivated: false,
  created_at: new Date().toISOString(),
};

const initialTenantUser: User = {
  id: 'user-ten-aarav',
  name: 'Aarav Patel',
  email: 'tenant@hostelsphere.com',
  password: 'Tenant@1234',
  phone: '+91 98123 45678',
  role: 'tenant',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
  must_change_password: false,
  is_deactivated: false,
  created_at: new Date().toISOString(),
};

const initialTenantUser2: User = {
  id: 'user-ten-priya',
  name: 'Priya Sharma',
  email: 'priya@hostelsphere.com',
  password: 'Tenant@1234',
  phone: '+91 98765 88888',
  role: 'tenant',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  must_change_password: false,
  is_deactivated: false,
  created_at: new Date().toISOString(),
};

const initialUsers: User[] = [managerUser, initialTenantUser, initialTenantUser2];

const initialRooms: Room[] = [
  {
    id: 'room-101',
    room_number: '101',
    floor: 1,
    room_type: 'Double Sharing',
    monthly_rent: 8500,
    total_beds: 2,
    beds: [
      { id: 'bed-101-A', room_id: 'room-101', bed_number: '101-A', status: 'occupied', tenant_id: 'ten-1', tenant_name: 'Aarav Patel' },
      { id: 'bed-101-B', room_id: 'room-101', bed_number: '101-B', status: 'occupied', tenant_id: 'ten-2', tenant_name: 'Priya Sharma' },
    ],
    created_at: '2026-01-01',
  },
  {
    id: 'room-102',
    room_number: '102',
    floor: 1,
    room_type: 'Single',
    monthly_rent: 12000,
    total_beds: 1,
    beds: [
      { id: 'bed-102-A', room_id: 'room-102', bed_number: '102-A', status: 'vacant' },
    ],
    created_at: '2026-01-01',
  },
  {
    id: 'room-201',
    room_number: '201',
    floor: 2,
    room_type: 'Triple Sharing',
    monthly_rent: 7000,
    total_beds: 3,
    beds: [
      { id: 'bed-201-A', room_id: 'room-201', bed_number: '201-A', status: 'vacant' },
      { id: 'bed-201-B', room_id: 'room-201', bed_number: '201-B', status: 'vacant' },
      { id: 'bed-201-C', room_id: 'room-201', bed_number: '201-C', status: 'vacant' },
    ],
    created_at: '2026-01-01',
  },
];

const initialTenants: Tenant[] = [
  {
    id: 'ten-1',
    user_id: 'user-ten-aarav',
    room_id: 'room-101',
    bed_id: 'bed-101-A',
    joining_date: '2026-01-15',
    deposit: 17000,
    monthly_rent: 8500,
    id_type: 'aadhaar',
    id_proof_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    id_proof_number: '1234 5678 9012',
    masked_id_number: 'XXXX XXXX 9012',
    live_photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    emergency_name: 'Rajesh Patel',
    emergency_phone: '+91 98765 11111',
    status: 'active',
    is_archived: false,
    user: initialTenantUser,
    room: initialRooms[0],
    bed: initialRooms[0].beds![0],
  },
  {
    id: 'ten-2',
    user_id: 'user-ten-priya',
    room_id: 'room-101',
    bed_id: 'bed-101-B',
    joining_date: '2026-02-01',
    deposit: 17000,
    monthly_rent: 8500,
    id_type: 'pan',
    id_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    id_proof_number: 'ABCDE1234F',
    masked_id_number: 'XXXXXX1234F',
    live_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    emergency_name: 'Sunil Sharma',
    emergency_phone: '+91 98765 88888',
    status: 'active',
    is_archived: false,
    user: initialTenantUser2,
    room: initialRooms[0],
    bed: initialRooms[0].beds![1],
  },
];

const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    tenant_id: 'ten-1',
    amount: 8500,
    payment_date: '2026-07-02',
    due_date: '2026-07-05',
    payment_method: 'UPI',
    status: 'paid',
    late_fee: 0,
    receipt_no: 'REC-2026-889123',
    tenant: initialTenants[0],
  },
  {
    id: 'pay-2',
    tenant_id: 'ten-2',
    amount: 8500,
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_method: 'Razorpay',
    status: 'pending',
    late_fee: 0,
    receipt_no: 'REC-2026-889124',
    tenant: initialTenants[1],
  },
];

const initialComplaints: Complaint[] = [
  {
    id: 'comp-1',
    tenant_id: 'ten-1',
    title: 'Wi-Fi Speed Slow in Room 101',
    description: 'Internet connection is dropping frequently during evening hours.',
    category: 'Wi-Fi',
    status: 'in_progress',
    created_at: '2026-07-28T14:30:00Z',
    tenant: initialTenants[0],
  },
];

const initialVisitors: Visitor[] = [
  {
    id: 'vis-1',
    tenant_id: 'ten-1',
    visitor_name: 'Anil Kumar',
    phone: '+91 98989 12345',
    purpose: 'Family Visit',
    check_in: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: 'inside',
    tenant: initialTenants[0],
  },
];

const initialSettings: HostelSettings = {
  hostel_name: 'HavenStays Executive PG',
  contact_phone: '+91 98765 43210',
  contact_email: 'vamsigandrothu@gmail.com',
  address: '124 Executive Heights, Tech Park Road, Bengaluru',
  upi_id: 'havenstays@upi',
  late_fee_per_day: 100,
  rent_due_day: 5,
  razorpay_key_id: 'rzp_test_9988776655',
  gst_number: '29ABCDE1234F1ZH',
  tax_percentage: 18,
};

const initialWhatsAppLogs: WhatsAppLog[] = [
  {
    id: 'walog-1',
    tenant_id: 'ten-2',
    message_type: 'upcoming',
    phone: '+91 98765 88888',
    message_text: 'Hi Priya Sharma,\nFriendly reminder 😊\n\nYour monthly rent of ₹8,500\nis due on 2026-08-03.\n\nPlease make the payment on time.\n\nThank you.',
    status: 'delivered',
    sent_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    tenant: initialTenants[1],
  },
];

const initialWhatsAppTemplates: WhatsAppTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Rent Due in 2 Days',
    category: 'UPCOMING_REMINDER',
    template_body: `Hi {TenantName},\nFriendly reminder 😊\n\nYour monthly rent of ₹{Amount}\nis due on {DueDate}.\n\nPlease make the payment on time.\n\nThank you.`,
  },
  {
    id: 'tpl-2',
    name: 'Rent Due Tomorrow',
    category: 'UPCOMING_REMINDER',
    template_body: `Hi {TenantName},\nYour rent of ₹{Amount}\nis due tomorrow.\n\nPlease make the payment.\n\nThank you.`,
  },
  {
    id: 'tpl-3',
    name: 'Rent Due Today',
    category: 'DUE_DATE_REMINDER',
    template_body: `Hi {TenantName},\nToday is your rent due date.\n\nRent Amount:\n₹{Amount}\n\nPlease pay today.\n\nThank you.`,
  },
  {
    id: 'tpl-4',
    name: 'Overdue 1 to 7 Days',
    category: 'OVERDUE_REMINDER',
    template_body: `Hi {TenantName},\nOur records show that your rent of ₹{Amount}\nis overdue by {Days} day(s).\n\nKindly clear the payment as soon as possible.\n\nThank you.`,
  },
  {
    id: 'tpl-5',
    name: 'Overdue Over 7 Days',
    category: 'OVERDUE_REMINDER',
    template_body: `Hi {TenantName},\n\nYour rent is overdue by {Days} days.\n\nOutstanding Amount:\n₹{Amount}\n\nPlease contact the manager immediately.\n\nThank you.`,
  },
];

const initialWhatsAppConfig: WhatsAppConfig = {
  access_token: 'EAAG1234567890_MOCK_TOKEN',
  phone_number_id: '109876543210',
  business_account_id: '10099887766',
  webhook_url: 'https://api.hostelsphere.com/webhooks/whatsapp',
  sandbox_mode: true,
};

export const LocalDataService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
      return initialUsers;
    }
    try {
      const parsed = JSON.parse(data);
      const hasManager = parsed.some((u: User) => u.email === managerUser.email);
      if (!hasManager) {
        const merged = [managerUser, ...parsed];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      return initialUsers;
    }
  },
  setUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),

  getRooms: (): Room[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(initialRooms));
      return initialRooms;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialRooms;
    }
  },
  setRooms: (rooms: Room[]) => localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms)),

  getTenants: (): Tenant[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TENANTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(initialTenants));
      return initialTenants;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialTenants;
    }
  },
  setTenants: (tenants: Tenant[]) => localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants)),

  getPayments: (): Payment[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(initialPayments));
      return initialPayments;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialPayments;
    }
  },
  setPayments: (payments: Payment[]) => localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)),

  getComplaints: (): Complaint[] => {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(initialComplaints));
      return initialComplaints;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialComplaints;
    }
  },
  setComplaints: (complaints: Complaint[]) => localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints)),

  getVisitors: (): Visitor[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VISITORS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(initialVisitors));
      return initialVisitors;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialVisitors;
    }
  },
  setVisitors: (visitors: Visitor[]) => localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(visitors)),

  getSettings: (): HostelSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
      return initialSettings;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialSettings;
    }
  },
  setSettings: (settings: HostelSettings) => localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)),

  getWhatsAppLogs: (): WhatsAppLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.WHATSAPP_LOGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_LOGS, JSON.stringify(initialWhatsAppLogs));
      return initialWhatsAppLogs;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialWhatsAppLogs;
    }
  },
  setWhatsAppLogs: (logs: WhatsAppLog[]) => localStorage.setItem(STORAGE_KEYS.WHATSAPP_LOGS, JSON.stringify(logs)),

  getWhatsAppTemplates: (): WhatsAppTemplate[] => {
    const data = localStorage.getItem(STORAGE_KEYS.WHATSAPP_TEMPLATES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_TEMPLATES, JSON.stringify(initialWhatsAppTemplates));
      return initialWhatsAppTemplates;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialWhatsAppTemplates;
    }
  },
  setWhatsAppTemplates: (templates: WhatsAppTemplate[]) => localStorage.setItem(STORAGE_KEYS.WHATSAPP_TEMPLATES, JSON.stringify(templates)),

  getWhatsAppConfig: (): WhatsAppConfig => {
    const data = localStorage.getItem(STORAGE_KEYS.WHATSAPP_CONFIG);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(initialWhatsAppConfig));
      return initialWhatsAppConfig;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialWhatsAppConfig;
    }
  },
  setWhatsAppConfig: (config: WhatsAppConfig) => localStorage.setItem(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(config)),

  // Database JSON Backup Export & Import Restore
  exportBackupJSON: () => {
    const backupData: Record<string, any> = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          backupData[key] = JSON.parse(item);
        } catch {
          backupData[key] = item;
        }
      }
    });

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `HostelSphere_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  restoreBackupJSON: (jsonContent: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (typeof parsed !== 'object' || !parsed) {
        return { success: false, error: 'Invalid backup file format.' };
      }

      Object.entries(parsed).forEach(([key, val]) => {
        if (Object.values(STORAGE_KEYS).includes(key)) {
          localStorage.setItem(key, JSON.stringify(val));
        }
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to parse backup JSON file.' };
    }
  },
};
