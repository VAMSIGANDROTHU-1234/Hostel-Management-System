import React, { createContext, useContext, useState, useMemo } from 'react';
import { Room, Tenant, Payment, Complaint, Visitor, HostelSettings, User, OccupancyStats, RevenueStats, Bed, WhatsAppLog, WhatsAppTemplate, WhatsAppConfig, WhatsAppMessageType, AuditLog, ProfileCorrection, IdDocumentType } from '../types';
import { LocalDataService } from '../services/api';
import { generateReceiptNumber, maskIdNumber } from '../utils/formatters';
import { parseWhatsAppTemplate, openWhatsAppWeb } from '../services/whatsappService';

export interface SmartReminderBuckets {
  dueIn2Days: Tenant[];
  dueTomorrow: Tenant[];
  dueToday: Tenant[];
  overdue1to7: Tenant[];
  overdueMoreThan7: Tenant[];
}

export interface ReminderAnalytics {
  todaysMessages: number;
  thisWeeksMessages: number;
  delivered: number;
  failed: number;
  pending: number;
}

interface DataContextType {
  rooms: Room[];
  tenants: Tenant[];
  payments: Payment[];
  complaints: Complaint[];
  visitors: Visitor[];
  settings: HostelSettings;
  whatsappLogs: WhatsAppLog[];
  whatsappTemplates: WhatsAppTemplate[];
  whatsappConfig: WhatsAppConfig;
  auditLogs: AuditLog[];
  profileCorrections: ProfileCorrection[];
  occupancyStats: OccupancyStats;
  revenueStats: RevenueStats;
  vacantBedsList: { room: Room; bed: Bed }[];
  smartReminderBuckets: SmartReminderBuckets;
  reminderAnalytics: ReminderAnalytics;
  addRoom: (roomData: Omit<Room, 'id' | 'created_at'>) => void;
  editRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  provisionTenant: (data: {
    name: string;
    email: string;
    phone: string;
    room_id: string;
    bed_id: string;
    joining_date: string;
    monthly_rent: number;
    deposit: number;
    id_type: IdDocumentType;
    id_proof_url: string;
    id_proof_number: string;
    live_photo_url?: string;
    emergency_name: string;
    emergency_phone: string;
    temporary_password: string;
  }) => { tenant: Tenant; user: User };
  editTenant: (tenant: Tenant) => void;
  transferTenant: (tenantId: string, newRoomId: string, newBedId: string) => void;
  vacateBed: (tenantId: string) => void;
  resetTenantPassword: (tenantId: string, newTempPassword: string) => void;
  deactivateTenant: (tenantId: string) => void;
  activateTenant: (tenantId: string) => void;
  recordPayment: (data: Omit<Payment, 'id' | 'created_at' | 'receipt_no'>) => void;
  addComplaint: (data: Omit<Complaint, 'id' | 'created_at' | 'status'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  checkInVisitor: (data: Omit<Visitor, 'id' | 'check_in' | 'status'>) => void;
  checkOutVisitor: (id: string) => void;
  updateSettings: (newSettings: HostelSettings) => void;
  // Audit & Identity
  logAudit: (action_type: AuditLog['action_type'], details: string, tenantId?: string) => void;
  requestProfileCorrection: (tenantId: string, field_name: string, requested_value: string, reason: string) => void;
  approveProfileCorrection: (correctionId: string) => void;
  // WhatsApp Actions
  sendWhatsAppReminder: (tenantId: string, categoryKeyOrType: string) => Promise<{ success: boolean; error?: string }>;
  sendBulkWhatsAppReminders: (targetTenants: Tenant[], messageType: WhatsAppMessageType) => Promise<number>;
  resendFailedWhatsApp: () => Promise<number>;
  sendCustomWhatsApp: (tenantId: string, customMessage: string) => Promise<{ success: boolean; error?: string }>;
  updateWhatsAppTemplate: (id: string, newBody: string) => void;
  updateWhatsAppConfig: (newConfig: WhatsAppConfig) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRoomsState] = useState<Room[]>(() => LocalDataService.getRooms() || []);
  const [tenants, setTenantsState] = useState<Tenant[]>(() => LocalDataService.getTenants() || []);
  const [payments, setPaymentsState] = useState<Payment[]>(() => LocalDataService.getPayments() || []);
  const [complaints, setComplaintsState] = useState<Complaint[]>(() => LocalDataService.getComplaints() || []);
  const [visitors, setVisitorsState] = useState<Visitor[]>(() => LocalDataService.getVisitors() || []);
  const [settings, setSettingsState] = useState<HostelSettings>(() => LocalDataService.getSettings());

  const [whatsappLogs, setWhatsAppLogsState] = useState<WhatsAppLog[]>(() => LocalDataService.getWhatsAppLogs() || []);
  const [whatsappTemplates, setWhatsAppTemplatesState] = useState<WhatsAppTemplate[]>(() => LocalDataService.getWhatsAppTemplates() || []);
  const [whatsappConfig, setWhatsAppConfigState] = useState<WhatsAppConfig>(() => LocalDataService.getWhatsAppConfig());

  // Audit Logs State
  const [auditLogs, setAuditLogsState] = useState<AuditLog[]>(() => [
    {
      id: 'audit-1',
      actor_name: 'Vamsi Gandrothu (Manager)',
      action_type: 'LIVE_PHOTO_CAPTURE',
      details: 'Captured live Identity photo during onboarding for Aarav Patel.',
      timestamp: '2026-07-30T10:00:00Z',
    },
    {
      id: 'audit-2',
      actor_name: 'Vamsi Gandrothu (Manager)',
      action_type: 'IDENTITY_UPLOAD',
      details: 'Uploaded verified Aadhaar Card (Masked: XXXX XXXX 9012) for Aarav Patel.',
      timestamp: '2026-07-30T10:05:00Z',
    },
  ]);

  // Profile Corrections State
  const [profileCorrections, setProfileCorrectionsState] = useState<ProfileCorrection[]>([]);

  // Persistence helpers
  const saveRooms = (newRooms: Room[]) => {
    setRoomsState(newRooms);
    LocalDataService.setRooms(newRooms);
  };

  const saveTenants = (newTenants: Tenant[]) => {
    setTenantsState(newTenants);
    LocalDataService.setTenants(newTenants);
  };

  const savePayments = (newPayments: Payment[]) => {
    setPaymentsState(newPayments);
    LocalDataService.setPayments(newPayments);
  };

  const saveComplaints = (newComplaints: Complaint[]) => {
    setComplaintsState(newComplaints);
    LocalDataService.setComplaints(newComplaints);
  };

  const saveVisitors = (newVisitors: Visitor[]) => {
    setVisitorsState(newVisitors);
    LocalDataService.setVisitors(newVisitors);
  };

  const saveWhatsAppLogs = (newLogs: WhatsAppLog[]) => {
    setWhatsAppLogsState(newLogs);
    LocalDataService.setWhatsAppLogs(newLogs);
  };

  const saveWhatsAppTemplates = (newTemplates: WhatsAppTemplate[]) => {
    setWhatsAppTemplatesState(newTemplates);
    LocalDataService.setWhatsAppTemplates(newTemplates);
  };

  const saveWhatsAppConfig = (newConfig: WhatsAppConfig) => {
    setWhatsAppConfigState(newConfig);
    LocalDataService.setWhatsAppConfig(newConfig);
  };

  const logAudit = (action_type: AuditLog['action_type'], details: string, tenantId?: string) => {
    const newAudit: AuditLog = {
      id: `audit-${Date.now()}`,
      tenant_id: tenantId,
      actor_name: 'Vamsi Gandrothu (Manager)',
      action_type,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogsState(prev => [newAudit, ...prev]);
  };

  // Dynamic Computation of Occupancy Stats
  const occupancyStats: OccupancyStats = useMemo(() => {
    let totalBeds = 0;
    let occupiedBeds = 0;

    (rooms || []).forEach(r => {
      if (!r) return;
      totalBeds += r.total_beds || 0;
      r.beds?.forEach(b => {
        if (b && b.status === 'occupied') occupiedBeds++;
      });
    });

    const vacantBeds = Math.max(0, totalBeds - occupiedBeds);
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    return {
      totalRooms: rooms?.length || 0,
      totalBeds,
      occupiedBeds,
      vacantBeds,
      occupancyRate,
    };
  }, [rooms]);

  const vacantBedsList = useMemo(() => {
    const list: { room: Room; bed: Bed }[] = [];
    (rooms || []).forEach(room => {
      if (!room) return;
      room.beds?.forEach(bed => {
        if (bed && bed.status === 'vacant') {
          list.push({ room, bed });
        }
      });
    });
    return list;
  }, [rooms]);

  // Dynamic Computation of Revenue Stats
  const revenueStats: RevenueStats = useMemo(() => {
    let totalTarget = 0;
    let collectedRevenue = 0;
    let pendingRevenue = 0;
    let overdueRevenue = 0;

    (tenants || []).filter(t => t && t.status === 'active').forEach(t => {
      totalTarget += t.monthly_rent || 0;
    });

    (payments || []).forEach(p => {
      if (!p) return;
      if (p.status === 'paid') {
        collectedRevenue += p.amount || 0;
      } else if (p.status === 'pending') {
        pendingRevenue += p.amount || 0;
      } else if (p.status === 'overdue') {
        overdueRevenue += p.amount || 0;
      }
    });

    const collectionRate = totalTarget > 0 ? Math.min(100, Math.round((collectedRevenue / totalTarget) * 100)) : 0;

    return {
      totalTarget,
      collectedRevenue,
      pendingRevenue,
      overdueRevenue,
      collectionRate,
    };
  }, [tenants, payments]);

  // Dynamic 5-Tier Smart Categorization Engine
  const smartReminderBuckets: SmartReminderBuckets = useMemo(() => {
    const activeTenants = (tenants || []).filter(t => t && t.status === 'active' && !t.is_archived);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueIn2Days: Tenant[] = [];
    const dueTomorrow: Tenant[] = [];
    const dueToday: Tenant[] = [];
    const overdue1to7: Tenant[] = [];
    const overdueMoreThan7: Tenant[] = [];

    activeTenants.forEach(tenant => {
      if (!tenant) return;
      const pay = (payments || []).find(p => p && p.tenant_id === tenant.id && (p.status === 'pending' || p.status === 'overdue'));
      if (!pay || !pay.due_date || pay.status === 'paid') return;

      const dueDate = new Date(pay.due_date);
      if (isNaN(dueDate.getTime())) return;
      dueDate.setHours(0, 0, 0, 0);

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 2) {
        dueIn2Days.push(tenant);
      } else if (diffDays === 1) {
        dueTomorrow.push(tenant);
      } else if (diffDays === 0) {
        dueToday.push(tenant);
      } else if (diffDays < 0) {
        const overdueDays = Math.abs(diffDays);
        if (overdueDays >= 1 && overdueDays <= 7) {
          overdue1to7.push(tenant);
        } else if (overdueDays > 7) {
          overdueMoreThan7.push(tenant);
        }
      }
    });

    return {
      dueIn2Days,
      dueTomorrow,
      dueToday,
      overdue1to7,
      overdueMoreThan7,
    };
  }, [tenants, payments]);

  // Dynamic Reminder Analytics Counters
  const reminderAnalytics: ReminderAnalytics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let todaysMessages = 0;
    let thisWeeksMessages = 0;
    let delivered = 0;
    let failed = 0;
    let pending = 0;

    (whatsappLogs || []).forEach(log => {
      if (!log || !log.sent_at) return;
      const sentDateStr = new Date(log.sent_at).toISOString().split('T')[0];
      const sentTime = new Date(log.sent_at);

      if (sentDateStr === todayStr) todaysMessages++;
      if (sentTime >= sevenDaysAgo) thisWeeksMessages++;

      if (log.status === 'delivered' || log.status === 'read') delivered++;
      else if (log.status === 'failed') failed++;
      else if (log.status === 'queued' || log.status === 'sent') pending++;
    });

    return {
      todaysMessages,
      thisWeeksMessages,
      delivered,
      failed,
      pending,
    };
  }, [whatsappLogs]);

  // Handlers for Rooms
  const addRoom = (roomData: Omit<Room, 'id' | 'created_at'>) => {
    const newRoomId = `room-${Date.now()}`;
    const generatedBeds: Bed[] = Array.from({ length: roomData.total_beds }).map((_, i) => ({
      id: `bed-${newRoomId}-${String.fromCharCode(65 + i)}`,
      room_id: newRoomId,
      bed_number: `${roomData.room_number}-${String.fromCharCode(65 + i)}`,
      status: 'vacant',
    }));

    const newRoom: Room = {
      ...roomData,
      id: newRoomId,
      created_at: new Date().toISOString(),
      beds: generatedBeds,
    };

    saveRooms([...rooms, newRoom]);
  };

  const editRoom = (updatedRoom: Room) => {
    const updated = rooms.map(r => (r.id === updatedRoom.id ? updatedRoom : r));
    saveRooms(updated);
  };

  const deleteRoom = (id: string) => {
    saveRooms(rooms.filter(r => r.id !== id));
  };

  // Enhanced Provision Tenant
  const provisionTenant = (data: {
    name: string;
    email: string;
    phone: string;
    room_id: string;
    bed_id: string;
    joining_date: string;
    monthly_rent: number;
    deposit: number;
    id_type: IdDocumentType;
    id_proof_url: string;
    id_proof_number: string;
    live_photo_url?: string;
    emergency_name: string;
    emergency_phone: string;
    temporary_password: string;
  }) => {
    const newUserId = `user-ten-${Date.now()}`;
    const newTenantId = `ten-${Date.now()}`;

    const maskedId = maskIdNumber(data.id_type, data.id_proof_number);

    const newUser: User = {
      id: newUserId,
      name: data.name,
      email: data.email,
      password: data.temporary_password,
      phone: data.phone,
      role: 'tenant',
      avatar_url: data.live_photo_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
      must_change_password: true,
      is_deactivated: false,
      created_at: new Date().toISOString(),
    };

    const existingUsers = LocalDataService.getUsers();
    LocalDataService.setUsers([...existingUsers, newUser]);

    let assignedRoom: Room | undefined;
    let assignedBed: Bed | undefined;

    const updatedRooms = rooms.map(room => {
      if (room.id === data.room_id) {
        assignedRoom = room;
        const updatedBeds = room.beds?.map(bed => {
          if (bed.id === data.bed_id) {
            assignedBed = { ...bed, status: 'occupied' as const, tenant_id: newTenantId, tenant_name: data.name };
            return assignedBed;
          }
          return bed;
        });
        return { ...room, beds: updatedBeds };
      }
      return room;
    });

    saveRooms(updatedRooms);

    const newTenant: Tenant = {
      id: newTenantId,
      user_id: newUserId,
      room_id: data.room_id,
      bed_id: data.bed_id,
      joining_date: data.joining_date,
      deposit: data.deposit,
      monthly_rent: data.monthly_rent,
      id_type: data.id_type,
      id_proof_url: data.id_proof_url,
      id_proof_number: data.id_proof_number,
      masked_id_number: maskedId,
      id_proof_filename: `${data.id_type}_${data.name.toLowerCase().replace(/\s+/g, '_')}.png`,
      id_proof_upload_date: new Date().toISOString(),
      live_photo_url: data.live_photo_url,
      emergency_name: data.emergency_name,
      emergency_phone: data.emergency_phone,
      status: 'active',
      is_archived: false,
      user: newUser,
      room: assignedRoom,
      bed: assignedBed,
    };

    saveTenants([...tenants, newTenant]);

    // Initial Payment
    const initialPayment: Payment = {
      id: `pay-${Date.now()}`,
      tenant_id: newTenantId,
      amount: data.monthly_rent,
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      payment_method: 'UPI',
      status: 'pending',
      late_fee: 0,
      receipt_no: generateReceiptNumber(),
      tenant: newTenant,
    };

    savePayments([initialPayment, ...payments]);

    // Audit Logging
    logAudit('IDENTITY_UPLOAD', `Uploaded verified ${data.id_type.toUpperCase()} Card (Masked: ${maskedId}) for ${data.name}.`, newTenantId);
    if (data.live_photo_url) {
      logAudit('LIVE_PHOTO_CAPTURE', `Captured live identity photo during admission for ${data.name}.`, newTenantId);
    }
    logAudit('ROOM_ASSIGNMENT', `Assigned Room ${assignedRoom?.room_number} (Bed ${assignedBed?.bed_number}) to ${data.name}.`, newTenantId);

    return { tenant: newTenant, user: newUser };
  };

  const editTenant = (updatedTenant: Tenant) => {
    const updated = tenants.map(t => (t.id === updatedTenant.id ? updatedTenant : t));
    saveTenants(updated);
    logAudit('PROFILE_UPDATE', `Updated profile & identity information for tenant ${updatedTenant.user?.name}.`, updatedTenant.id);
  };

  const transferTenant = (tenantId: string, newRoomId: string, newBedId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    const oldBedId = tenant.bed_id;
    let targetRoom: Room | undefined;
    let targetBed: Bed | undefined;

    const updatedRooms = rooms.map(room => {
      let updatedBeds = room.beds ? [...room.beds] : [];
      updatedBeds = updatedBeds.map(b => {
        if (b.id === oldBedId) {
          return { ...b, status: 'vacant' as const, tenant_id: undefined, tenant_name: undefined };
        }
        if (b.id === newBedId) {
          targetBed = { ...b, status: 'occupied' as const, tenant_id: tenantId, tenant_name: tenant.user?.name };
          return targetBed;
        }
        return b;
      });

      if (room.id === newRoomId) targetRoom = room;
      return { ...room, beds: updatedBeds };
    });

    saveRooms(updatedRooms);

    const updatedTenants = tenants.map(t => {
      if (t.id === tenantId) {
        return { ...t, room_id: newRoomId, bed_id: newBedId, room: targetRoom, bed: targetBed };
      }
      return t;
    });

    saveTenants(updatedTenants);
    logAudit('ROOM_ASSIGNMENT', `Transferred tenant ${tenant.user?.name} to Room ${targetRoom?.room_number} (Bed ${targetBed?.bed_number}).`, tenantId);
  };

  const vacateBed = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    const oldBedId = tenant.bed_id;
    const updatedRooms = rooms.map(room => {
      const updatedBeds = room.beds?.map(b => {
        if (b.id === oldBedId) {
          return { ...b, status: 'vacant' as const, tenant_id: undefined, tenant_name: undefined };
        }
        return b;
      });
      return { ...room, beds: updatedBeds };
    });

    saveRooms(updatedRooms);

    const updatedTenants = tenants.map(t =>
      t.id === tenantId ? { ...t, status: 'vacated' as const, is_archived: true } : t
    );
    saveTenants(updatedTenants);

    logAudit('CHECKOUT_ARCHIVE', `Tenant ${tenant.user?.name} checked out. Identity documents and photo records archived securely.`, tenantId);
  };

  // Manager Reset Tenant Password
  const resetTenantPassword = (tenantId: string, newTempPassword: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    const users = LocalDataService.getUsers();
    const updatedUsers = users.map(u => {
      if (u.id === tenant.user_id) {
        return { ...u, password: newTempPassword, must_change_password: true };
      }
      return u;
    });
    LocalDataService.setUsers(updatedUsers);

    logAudit('PROFILE_UPDATE', `Manager reset login password for tenant ${tenant.user?.name}. Mandatory first-login password change set.`, tenantId);
  };

  // Manager Deactivate Tenant
  const deactivateTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    const users = LocalDataService.getUsers();
    const updatedUsers = users.map(u => {
      if (u.id === tenant.user_id) {
        return { ...u, is_deactivated: true };
      }
      return u;
    });
    LocalDataService.setUsers(updatedUsers);

    logAudit('PROFILE_UPDATE', `Manager deactivated tenant login account for ${tenant.user?.name}.`, tenantId);
  };

  // Manager Activate Tenant
  const activateTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    const users = LocalDataService.getUsers();
    const updatedUsers = users.map(u => {
      if (u.id === tenant.user_id) {
        return { ...u, is_deactivated: false };
      }
      return u;
    });
    LocalDataService.setUsers(updatedUsers);

    logAudit('PROFILE_UPDATE', `Manager re-activated tenant login account for ${tenant.user?.name}.`, tenantId);
  };

  // Tenant Profile Correction Requests
  const requestProfileCorrection = (tenantId: string, field_name: string, requested_value: string, reason: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    const newCorrection: ProfileCorrection = {
      id: `corr-${Date.now()}`,
      tenant_id: tenantId,
      field_name,
      requested_value,
      reason,
      status: 'pending',
      created_at: new Date().toISOString(),
      tenant,
    };

    setProfileCorrectionsState(prev => [newCorrection, ...prev]);
    logAudit('PROFILE_UPDATE', `Tenant ${tenant?.user?.name} submitted profile correction request for field: ${field_name}.`, tenantId);
  };

  const approveProfileCorrection = (correctionId: string) => {
    const corr = profileCorrections.find(c => c.id === correctionId);
    if (!corr) return;

    const updatedCorrections = profileCorrections.map(c => (c.id === correctionId ? { ...c, status: 'approved' as const } : c));
    setProfileCorrectionsState(updatedCorrections);

    logAudit('PROFILE_UPDATE', `Manager approved profile correction request #${correctionId} for field: ${corr.field_name}.`, corr.tenant_id);
  };

  // Handlers for Payments
  const recordPayment = (data: Omit<Payment, 'id' | 'created_at' | 'receipt_no'>) => {
    const tenant = tenants.find(t => t.id === data.tenant_id);
    const newPayment: Payment = {
      ...data,
      id: `pay-${Date.now()}`,
      receipt_no: generateReceiptNumber(),
      created_at: new Date().toISOString(),
      tenant,
    };

    // Update existing pending payment for this tenant to 'paid'
    const updatedPayments = payments.map(p => {
      if (p.tenant_id === data.tenant_id && (p.status === 'pending' || p.status === 'overdue')) {
        return { ...p, status: 'paid' as const, payment_date: new Date().toISOString().split('T')[0] };
      }
      return p;
    });

    savePayments([newPayment, ...updatedPayments]);
  };

  const addComplaint = (data: Omit<Complaint, 'id' | 'created_at' | 'status'>) => {
    const tenant = tenants.find(t => t.id === data.tenant_id);
    const newComplaint: Complaint = {
      ...data,
      id: `comp-${Date.now()}`,
      status: 'open',
      created_at: new Date().toISOString(),
      tenant,
    };
    saveComplaints([newComplaint, ...complaints]);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    const updated = complaints.map(c => (c.id === id ? { ...c, status } : c));
    saveComplaints(updated);
  };

  const checkInVisitor = (data: Omit<Visitor, 'id' | 'check_in' | 'status'>) => {
    const tenant = tenants.find(t => t.id === data.tenant_id);
    const newVisitor: Visitor = {
      ...data,
      id: `vis-${Date.now()}`,
      check_in: new Date().toISOString(),
      status: 'inside',
      tenant,
    };
    saveVisitors([newVisitor, ...visitors]);
  };

  const checkOutVisitor = (id: string) => {
    const updated = visitors.map(v => (v.id === id ? { ...v, status: 'checked_out' as const, check_out: new Date().toISOString() } : v));
    saveVisitors(updated);
  };

  const updateSettings = (newSettings: HostelSettings) => {
    setSettingsState(newSettings);
    LocalDataService.setSettings(newSettings);
  };

  // Real WhatsApp Dispatch Handlers
  const sendWhatsAppReminder = async (tenantId: string, categoryKeyOrType: string): Promise<{ success: boolean; error?: string }> => {
    const tenant = (tenants || []).find(t => t.id === tenantId);
    if (!tenant || !tenant.user) {
      return { success: false, error: 'Tenant record not found.' };
    }

    if (!tenant.user.phone || !tenant.user.phone.trim()) {
      return { success: false, error: 'Tenant phone number not available.' };
    }

    const pay = (payments || []).find(p => p.tenant_id === tenant.id && (p.status === 'pending' || p.status === 'overdue'));
    const dueDateStr = pay?.due_date || new Date().toISOString().split('T')[0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - dueDate.getTime();
    const daysOverdue = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));

    let tplObj: WhatsAppTemplate | undefined;

    if (categoryKeyOrType === 'dueIn2Days' || categoryKeyOrType === 'upcoming') {
      tplObj = (whatsappTemplates || []).find(t => t.name.includes('2 Days') || t.category === 'UPCOMING_REMINDER');
    } else if (categoryKeyOrType === 'dueTomorrow') {
      tplObj = (whatsappTemplates || []).find(t => t.name.includes('Tomorrow'));
    } else if (categoryKeyOrType === 'dueToday' || categoryKeyOrType === 'due') {
      tplObj = (whatsappTemplates || []).find(t => t.name.includes('Today') || t.category === 'DUE_DATE_REMINDER');
    } else if (categoryKeyOrType === 'overdue1to7') {
      tplObj = (whatsappTemplates || []).find(t => t.name.includes('1 to 7'));
    } else if (categoryKeyOrType === 'overdueMoreThan7' || categoryKeyOrType === 'overdue') {
      tplObj = (whatsappTemplates || []).find(t => t.name.includes('Over 7') || t.category === 'OVERDUE_REMINDER');
    }

    if (!tplObj) {
      tplObj = (whatsappTemplates || [])[0];
    }

    const renderedText = parseWhatsAppTemplate(tplObj.template_body, {
      tenantName: tenant.user.name,
      amount: tenant.monthly_rent,
      dueDate: dueDateStr,
      days: daysOverdue,
      roomNumber: tenant.room?.room_number || 'N/A',
      bedNumber: tenant.bed?.bed_number || 'N/A',
      hostelName: settings?.hostel_name || 'HostelSphere',
    });

    const res = openWhatsAppWeb(tenant.user.phone, renderedText);

    const newLog: WhatsAppLog = {
      id: `walog-${Date.now()}`,
      tenant_id: tenant.id,
      message_type: categoryKeyOrType.includes('overdue') ? 'overdue' : categoryKeyOrType.includes('due') ? 'due' : 'upcoming',
      phone: tenant.user.phone,
      message_text: renderedText,
      status: res.success ? 'delivered' : 'failed',
      error_message: res.error,
      sent_at: new Date().toISOString(),
      tenant,
    };

    saveWhatsAppLogs([newLog, ...(whatsappLogs || [])]);
    return res;
  };

  const sendBulkWhatsAppReminders = async (targetTenants: Tenant[], messageType: WhatsAppMessageType): Promise<number> => {
    let sentCount = 0;
    for (const t of targetTenants) {
      const res = await sendWhatsAppReminder(t.id, messageType);
      if (res.success) sentCount++;
    }
    return sentCount;
  };

  const resendFailedWhatsApp = async (): Promise<number> => {
    const failedLogs = (whatsappLogs || []).filter(l => l.status === 'failed');
    let retryCount = 0;

    const updatedLogs = (whatsappLogs || []).map(log => {
      if (log.status === 'failed') {
        const res = openWhatsAppWeb(log.phone, log.message_text);
        if (res.success) {
          retryCount++;
          return { ...log, status: 'delivered' as const, error_message: undefined, sent_at: new Date().toISOString() };
        }
      }
      return log;
    });

    saveWhatsAppLogs(updatedLogs);
    return retryCount;
  };

  const sendCustomWhatsApp = async (tenantId: string, customMessage: string): Promise<{ success: boolean; error?: string }> => {
    const tenant = (tenants || []).find(t => t.id === tenantId);
    if (!tenant || !tenant.user) {
      return { success: false, error: 'Tenant record not found.' };
    }

    if (!tenant.user.phone || !tenant.user.phone.trim()) {
      return { success: false, error: 'Tenant phone number not available.' };
    }

    const res = openWhatsAppWeb(tenant.user.phone, customMessage);

    const newLog: WhatsAppLog = {
      id: `walog-${Date.now()}`,
      tenant_id: tenant.id,
      message_type: 'custom',
      phone: tenant.user.phone,
      message_text: customMessage,
      status: res.success ? 'delivered' : 'failed',
      error_message: res.error,
      sent_at: new Date().toISOString(),
      tenant,
    };

    saveWhatsAppLogs([newLog, ...(whatsappLogs || [])]);
    return res;
  };

  const updateWhatsAppTemplate = (id: string, newBody: string) => {
    const updated = whatsappTemplates.map(t => (t.id === id ? { ...t, template_body: newBody } : t));
    saveWhatsAppTemplates(updated);
  };

  const updateWhatsAppConfig = (newConfig: WhatsAppConfig) => {
    saveWhatsAppConfig(newConfig);
  };

  return (
    <DataContext.Provider
      value={{
        rooms,
        tenants,
        payments,
        complaints,
        visitors,
        settings,
        whatsappLogs,
        whatsappTemplates,
        whatsappConfig,
        auditLogs,
        profileCorrections,
        occupancyStats,
        revenueStats,
        vacantBedsList,
        smartReminderBuckets,
        reminderAnalytics,
        addRoom,
        editRoom,
        deleteRoom,
        provisionTenant,
        editTenant,
        transferTenant,
        vacateBed,
        resetTenantPassword,
        deactivateTenant,
        activateTenant,
        recordPayment,
        addComplaint,
        updateComplaintStatus,
        checkInVisitor,
        checkOutVisitor,
        updateSettings,
        logAudit,
        requestProfileCorrection,
        approveProfileCorrection,
        sendWhatsAppReminder,
        sendBulkWhatsAppReminders,
        resendFailedWhatsApp,
        sendCustomWhatsApp,
        updateWhatsAppTemplate,
        updateWhatsAppConfig,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
