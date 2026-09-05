-- ===================================================
-- HOSTELSPHERE SAAS - SUPABASE POSTGRESQL DDL MIGRATION
-- ===================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'tenant')),
    avatar_url TEXT,
    must_change_password BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(50) NOT NULL UNIQUE,
    floor INT NOT NULL,
    room_type VARCHAR(50) NOT NULL CHECK (room_type IN ('Single', 'Double Sharing', 'Triple Sharing', 'Four Sharing', 'Dormitory')),
    total_beds INT NOT NULL DEFAULT 1,
    monthly_rent DECIMAL(10,2) NOT NULL,
    is_ac BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BEDS TABLE
CREATE TABLE IF NOT EXISTS beds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    bed_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance', 'reserved')),
    tenant_id UUID,
    tenant_name VARCHAR(255),
    UNIQUE(room_id, bed_number)
);

-- 4. TENANTS TABLE
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    bed_id UUID REFERENCES beds(id) ON DELETE SET NULL,
    joining_date DATE NOT NULL,
    deposit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    monthly_rent DECIMAL(10,2) NOT NULL,
    id_type VARCHAR(50) DEFAULT 'aadhaar' CHECK (id_type IN ('aadhaar', 'pan', 'passport', 'driving_license')),
    id_proof_url TEXT NOT NULL,
    id_proof_number VARCHAR(255),
    masked_id_number VARCHAR(255),
    live_photo_url TEXT,
    emergency_name VARCHAR(255) NOT NULL,
    emergency_phone VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'vacated')),
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE,
    due_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash' CHECK (payment_method IN ('Cash', 'UPI', 'Razorpay', 'Bank Transfer')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
    late_fee DECIMAL(10,2) DEFAULT 0.00,
    receipt_no VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General' CHECK (category IN ('Plumbing', 'Electrical', 'Cleaning', 'Wi-Fi', 'General')),
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. VISITORS TABLE
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    visitor_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    check_out TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'inside' CHECK (status IN ('inside', 'checked_out'))
);

-- 8. AUDIT LOGS TABLE (ENTERPRISE IDENTITY TRACKING)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('IDENTITY_UPLOAD', 'LIVE_PHOTO_CAPTURE', 'ROOM_ASSIGNMENT', 'PROFILE_UPDATE', 'CHECKOUT_ARCHIVE')),
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. PROFILE CORRECTIONS REQUEST TABLE
CREATE TABLE IF NOT EXISTS profile_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    requested_value TEXT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_name VARCHAR(255) NOT NULL DEFAULT 'HavenStays Executive PG',
    contact_phone VARCHAR(50) DEFAULT '+91 98765 43210',
    contact_email VARCHAR(255) DEFAULT 'contact@havenstays.com',
    address TEXT DEFAULT '124 Executive Heights, Tech Park Road, Bengaluru',
    upi_id VARCHAR(100) DEFAULT 'havenstays@upi',
    late_fee_per_day DECIMAL(10,2) DEFAULT 100.00,
    rent_due_day INT DEFAULT 5,
    razorpay_key_id VARCHAR(100) DEFAULT 'rzp_test_9988776655'
);

-- 11. WHATSAPP LOGS TABLE
CREATE TABLE IF NOT EXISTS whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('upcoming', 'due', 'overdue', 'custom', 'welcome', 'birthday', 'festival', 'instructions')),
    phone VARCHAR(50) NOT NULL,
    message_text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PRIVATE SUPABASE STORAGE BUCKETS POLICIES
-- Create buckets for tenant-id-proofs and tenant-photos
INSERT INTO storage.buckets (id, name, public) VALUES ('tenant-id-proofs', 'tenant-id-proofs', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('tenant-photos', 'tenant-photos', false) ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage Buckets (Manager Only Access)
CREATE POLICY "Manager Full Access to Private Tenant ID Proofs" ON storage.objects
    FOR ALL USING (bucket_id = 'tenant-id-proofs');

CREATE POLICY "Manager Full Access to Private Tenant Photos" ON storage.objects
    FOR ALL USING (bucket_id = 'tenant-photos');
