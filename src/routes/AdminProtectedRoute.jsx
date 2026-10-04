import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminLogin from '../pages/auth/AdminLogin';
import ChooseMethod from '../pages/auth/ChooseMethod';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';

// Main App Pages
import MainLayout from '../components/common/MainLayout';
import Dashboard from '../pages/dashboard/Dashboard';

// Guards
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminProtectedRoute from '../components/common/AdminProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* --- Standard Protected Routes (Requires Login) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/choose-method" element={<ChooseMethod />} />
        
        {/* App Layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      {/* --- ADMIN ONLY PROTECTED ROUTES (Requires Admin Role & Key) --- */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Default Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}