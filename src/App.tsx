import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Layout & Common Pages
import { Layout } from './components/common/Layout';
import { LoginPage } from './pages/common/LoginPage';
import { FirstLoginPasswordPage } from './pages/common/FirstLoginPasswordPage';
import { SkeletonCard, SkeletonTable } from './components/ui/Skeleton';

// Lazy Loaded Manager Pages for High Performance Code Splitting
const ManagerDashboard = lazy(() => import('./pages/manager/ManagerDashboard').then(m => ({ default: m.ManagerDashboard })));
const RoomManagement = lazy(() => import('./pages/manager/RoomManagement').then(m => ({ default: m.RoomManagement })));
const TenantManagement = lazy(() => import('./pages/manager/TenantManagement').then(m => ({ default: m.TenantManagement })));
const PaymentManagement = lazy(() => import('./pages/manager/PaymentManagement').then(m => ({ default: m.PaymentManagement })));
const EmptyBedTrackerPage = lazy(() => import('./pages/manager/EmptyBedTrackerPage').then(m => ({ default: m.EmptyBedTrackerPage })));
const WhatsAppRemindersPage = lazy(() => import('./pages/manager/WhatsAppRemindersPage').then(m => ({ default: m.WhatsAppRemindersPage })));
const ComplaintsPage = lazy(() => import('./pages/manager/ComplaintsPage').then(m => ({ default: m.ComplaintsPage })));
const VisitorsPage = lazy(() => import('./pages/manager/VisitorsPage').then(m => ({ default: m.VisitorsPage })));
const ReportsPage = lazy(() => import('./pages/manager/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('./pages/manager/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Lazy Loaded Tenant Pages
const TenantDashboard = lazy(() => import('./pages/tenant/TenantDashboard').then(m => ({ default: m.TenantDashboard })));
const TenantPayments = lazy(() => import('./pages/tenant/TenantPayments').then(m => ({ default: m.TenantPayments })));
const TenantComplaints = lazy(() => import('./pages/tenant/TenantComplaints').then(m => ({ default: m.TenantComplaints })));
const TenantProfile = lazy(() => import('./pages/tenant/TenantProfile').then(m => ({ default: m.TenantProfile })));

// Loading Suspense Fallback
const PageLoadingFallback: React.FC = () => (
  <div className="space-y-6 w-full p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <SkeletonTable rows={6} />
  </div>
);

// Root Index Redirector Component
const RootRedirector: React.FC = () => {
  const { isAuthenticated, role, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'tenant' && user.must_change_password) {
    return <Navigate to="/tenant/change-password" replace />;
  }

  if (role === 'tenant') {
    return <Navigate to="/tenant/dashboard" replace />;
  }

  return <Navigate to="/manager/dashboard" replace />;
};

export const AppContent: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Root Route */}
      <Route path="/" element={<RootRedirector />} />

      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            role === 'tenant' ? (
              <Navigate to="/tenant/dashboard" replace />
            ) : (
              <Navigate to="/manager/dashboard" replace />
            )
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Mandatory First-Login Password Change Page */}
      <Route
        path="/tenant/change-password"
        element={
          <ProtectedRoute allowedRole="tenant">
            <FirstLoginPasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Manager Portal Routes (Strict Role Guard) */}
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute allowedRole="manager">
            <Layout>
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  <Route path="dashboard" element={<ManagerDashboard />} />
                  <Route path="rooms" element={<RoomManagement />} />
                  <Route path="tenants" element={<TenantManagement />} />
                  <Route path="payments" element={<PaymentManagement />} />
                  <Route path="empty-beds" element={<EmptyBedTrackerPage />} />
                  <Route path="whatsapp-reminders" element={<WhatsAppRemindersPage />} />
                  <Route path="complaints" element={<ComplaintsPage />} />
                  <Route path="visitors" element={<VisitorsPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Tenant Portal Routes (Strict Role Guard) */}
      <Route
        path="/tenant/*"
        element={
          <ProtectedRoute allowedRole="tenant">
            <Layout>
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  <Route path="dashboard" element={<TenantDashboard />} />
                  <Route path="payments" element={<TenantPayments />} />
                  <Route path="complaints" element={<TenantComplaints />} />
                  <Route path="profile" element={<TenantProfile />} />
                  <Route path="*" element={<Navigate to="/tenant/dashboard" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <DataProvider>
              <AppContent />
            </DataProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
