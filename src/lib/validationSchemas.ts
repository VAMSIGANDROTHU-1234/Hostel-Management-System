import { z } from 'zod';

export const roomSchema = z.object({
  room_number: z.string().min(1, 'Room number is required'),
  floor: z.number().min(0, 'Floor must be 0 or higher'),
  room_type: z.enum(['Single', 'Double Sharing', 'Triple Sharing', 'Four Sharing', 'Dormitory']),
  total_beds: z.number().min(1, 'At least 1 bed is required').max(10, 'Max 10 beds per room'),
  monthly_rent: z.number().min(500, 'Monthly rent must be at least ₹500'),
});

export const tenantProvisionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  room_id: z.string().min(1, 'Please select a room'),
  bed_id: z.string().min(1, 'Please select a bed'),
  joining_date: z.string().min(1, 'Joining date is required'),
  monthly_rent: z.number().min(500, 'Rent must be at least ₹500'),
  deposit: z.number().min(0, 'Deposit cannot be negative'),
  emergency_name: z.string().min(2, 'Emergency contact name required'),
  emergency_phone: z.string().min(10, 'Emergency phone required'),
  temporary_password: z.string().min(6, 'Temporary password must be at least 6 characters'),
});

export const paymentSchema = z.object({
  tenant_id: z.string().min(1, 'Select a tenant'),
  amount: z.number().min(100, 'Amount must be at least ₹100'),
  due_date: z.string().min(1, 'Due date is required'),
  payment_method: z.enum(['Cash', 'UPI', 'Razorpay', 'Bank Transfer']),
  status: z.enum(['paid', 'pending', 'overdue']),
  late_fee: z.number().min(0, 'Late fee cannot be negative').default(0),
});

export const complaintSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.enum(['Plumbing', 'Electrical', 'Cleaning', 'Wi-Fi', 'General']),
  description: z.string().min(10, 'Please enter detailed description (10+ chars)'),
  image_url: z.string().optional(),
});

export const visitorSchema = z.object({
  tenant_id: z.string().min(1, 'Select host tenant'),
  visitor_name: z.string().min(2, 'Visitor name is required'),
  phone: z.string().min(10, 'Visitor phone is required'),
  purpose: z.string().min(3, 'Purpose is required'),
});

export const changePasswordSchema = z.object({
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string().min(6, 'Confirm password required'),
}).refine(data => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});
