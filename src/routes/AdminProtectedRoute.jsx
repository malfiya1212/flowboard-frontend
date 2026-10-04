import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminLogin from '../pages/auth/AdminLogin';
import ChooseMethod from '../pages/auth/ChooseMethod';

// Admin & Dashboard
import AdminDashboard from '../pages/admin/AdminDashboard';
import Dashboard from '../pages/dashboard/Dashboard';
import MainLayout from '../components/common/MainLayout';

// Protection Guards
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminProtectedRoute from '../components/common/AdminProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 2. Standard Protected User Pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/choose-method" element={<ChooseMethod />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      {/* 3. STRICT ADMIN GUARD: No one can access /admin without logging in as Admin first */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}