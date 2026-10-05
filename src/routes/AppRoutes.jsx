import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Import your Authentication Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminLogin from '../pages/auth/AdminLogin';


import ChooseMethod from '../pages/ChooseMethod';


// 4. Import the Route Protector
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default route redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* --- PUBLIC ROUTES (No login required) --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* --- PROTECTED ROUTES (Requires login) --- */}
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

      {/* Admin Dashboard (Protected) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            {/* You can change this to a specific AdminDashboard component later */}
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}