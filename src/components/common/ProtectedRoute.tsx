import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isAuthenticated, role, user } = useAuth();
  const location = useLocation();

  // 1. Unauthenticated Access Protection
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Mandatory First-Login Password Change for Tenants
  if (user.role === 'tenant' && user.must_change_password && location.pathname !== '/tenant/change-password') {
    return <Navigate to="/tenant/change-password" replace />;
  }

  // 3. Strict Role Boundary Guards
  if (allowedRole && role !== allowedRole) {
    if (role === 'tenant') {
      // Tenant attempting to access manager routes -> redirect to tenant dashboard
      return <Navigate to="/tenant/dashboard" replace />;
    } else if (role === 'manager') {
      // Manager attempting to access tenant routes -> redirect to manager dashboard
      return <Navigate to="/manager/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
