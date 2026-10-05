import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Authentication Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminLogin from '../pages/auth/AdminLogin';

// 2. Onboarding Page
import ChooseMethod from '../pages/ChooseMethod';

// 3. Private / Workspace Pages
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';

// 4. Route Protector
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default route redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* --- PUBLIC ROUTES --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* --- PROTECTED ROUTES --- */}
      <Route 
        path="/choose-method" 
        element={
          <ProtectedRoute>
            <ChooseMethod />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } 
      />

      {/* Admin Dashboard */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}