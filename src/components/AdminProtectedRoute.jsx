import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtectedRoute() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('flowboard_role');

  // If NOT logged in or role is NOT Admin, immediately block and send to Admin Login
  if (!isAuthenticated || role !== 'Admin') {
    return <Navigate to="/admin/login" replace />;
  }

  // Only renders the dashboard if logged in as Admin
  return <Outlet />;
}