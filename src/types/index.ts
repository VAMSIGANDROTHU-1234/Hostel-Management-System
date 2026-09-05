export type UserRole = 'manager' | 'tenant';

export type RoomType = 'Single' | 'Double Sharing' | 'Triple Sharing' | 'Four Sharing' | 'Dormitory';

export type BedStatus = 'vacant' | 'occupied' | 'maintenance' | 'reserved';

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export type PaymentMethod = 'Cash' | 'UPI' | 'Razorpay' | 'Bank Transfer';

export type ComplaintCategory = 'Plumbing' | 'Electrical' | 'Cleaning' | 'Wi-Fi' | 'General';

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved';

export type VisitorStatus = 'inside' | 'checked_out';

export type WhatsAppMessageType = 'upcoming' | 'due' | 'overdue' | 'custom' | 'welcome' | 'birthday' | 'festival' | 'instructions';

export type WhatsAppDeliveryStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

export type IdDocumentType = 'aadhaar' | 'pan' | 'passport' | 'driving_license';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  avatar_url?: string;
  must_change_password?: boolean;
  is_deactivated?: boolean;
  created_at?: string;
}

export interface Bed {
  id: string;
  room_id: string;
  bed_number: string;
  status: BedStatus;
  tenant_id?: string;
  tenant_name?: string;
}

export interface Room {
  id: string;
  room_number: string;
  floor: number;
  room_type: RoomType;
  total_beds: number;
  monthly_rent: number;
  is_ac?: boolean;
  created_at?: string;
  occupied_beds?: number;
  vacant_beds?: number;
  beds?: Bed[];
}

export interface Tenant {
  id: string;
  user_id: string;
  room_id: string;
  bed_id: string;
  joining_date: string;
  deposit: number;
  monthly_rent: number;
  id_type?: IdDocumentType;
  id_proof_url?: string;
  id_proof_back_url?: string;
  id_proof_filename?: string;
  id_proof_upload_date?: string;
  id_proof_number?: string;
  masked_id_number?: string;
  live_photo_url?: string;
  emergency_name: string;
  emergency_phone: string;
  status: 'active' | 'vacated';
  is_archived?: boolean;
  created_at?: string;
  // Joined fields
  user?: User;
  room?: Room;
  bed?: Bed;
}

export interface Payment {
  id: string;
  tenant_id: string;
  amount: number;
  payment_date?: string;
  due_date: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  late_fee: number;
  receipt_no: string;
  created_at?: string;
  // Joined fields
  tenant?: Tenant;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Electricity' | 'Water' | 'Maintenance' | 'Internet' | 'Staff Salary' | 'Other';
  amount: number;
  expense_date: string;
  notes?: string;
}

export interface Complaint {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  image_url?: string;
  status: ComplaintStatus;
  created_at: string;
  tenant?: Tenant;
}

export interface Visitor {
  id: string;
  tenant_id: string;
  visitor_name: string;
  phone: string;
  purpose: string;
  check_in: string;
  check_out?: string;
  status: VisitorStatus;
  tenant?: Tenant;
}

export interface HostelSettings {
  hostel_name: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  upi_id: string;
  late_fee_per_day: number;
  rent_due_day: number;
  razorpay_key_id: string;
  gst_number?: string;
  tax_percentage?: number;
  logo_url?: string;
  theme_color?: string;
}

export interface WhatsAppLog {
  id: string;
  tenant_id: string;
  message_type: WhatsAppMessageType;
  phone: string;
  message_text: string;
  status: WhatsAppDeliveryStatus;
  error_message?: string;
  sent_at: string;
  tenant?: Tenant;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'UPCOMING_REMINDER' | 'DUE_DATE_REMINDER' | 'OVERDUE_REMINDER' | 'WELCOME' | 'BIRTHDAY' | 'FESTIVAL' | 'INSTRUCTIONS';
  template_body: string;
}

export interface WhatsAppConfig {
  access_token: string;
  phone_number_id: string;
  business_account_id: string;
  webhook_url: string;
  sandbox_mode: boolean;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  type: 'payment' | 'tenant' | 'room' | 'visitor' | 'complaint' | 'whatsapp' | 'identity';
  timestamp: string;
}

export interface AuditLog {
  id: string;
  tenant_id?: string;
  actor_name: string;
  action_type: 'IDENTITY_UPLOAD' | 'LIVE_PHOTO_CAPTURE' | 'ROOM_ASSIGNMENT' | 'PROFILE_UPDATE' | 'CHECKOUT_ARCHIVE';
  details: string;
  timestamp: string;
}

export interface ProfileCorrection {
  id: string;
  tenant_id: string;
  field_name: string;
  requested_value: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  tenant?: Tenant;
}

export interface OccupancyStats {
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  vacantBeds: number;
  occupancyRate: number;
}

export interface RevenueStats {
  totalTarget: number;
  collectedRevenue: number;
  pendingRevenue: number;
  overdueRevenue: number;
  collectionRate: number;
}
