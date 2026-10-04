import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtectedRoute() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('flowboard_role');

  // If NOT logged in OR role is NOT Admin, immediately kick them to /admin/login
  if (!isAuthenticated || role !== 'Admin') {
    return <Navigate to="/admin/login" replace />;
  }

  // Only allow access if verified as Admin
  return <Outlet />;
}