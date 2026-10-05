import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminLogin from '../pages/auth/AdminLogin';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Workspace Pages
import ChooseMethod from '../pages/ChooseMethod';
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/projects/Projects";
import KanbanDashboard from '../pages/KanbanDashboard';

// Route Protector
import ProtectedRoute from '../components/common/ProtectedRoute';
import CreateProject from '../pages/projects/CreateProject';

// Inside your Routes:


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* --- PUBLIC ROUTES --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />

      {/* --- PROTECTED ROUTES --- */}
      <Route 
        path="/choose-method" 
        element={
          <ProtectedRoute>
            <ChooseMethod />
          </ProtectedRoute>
        } 
      />
      
      {/* ADDED: Scrum and Kanban specific routes */}
      <Route 
        path="/scrum-dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/kanban-dashboard" 
        element={
          <ProtectedRoute>
            <KanbanDashboard />
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