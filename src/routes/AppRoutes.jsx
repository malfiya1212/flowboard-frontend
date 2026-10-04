import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../components/common/MainLayout';

import Login from '../pages/auth/Login';
import AdminLogin from '../pages/auth/AdminLogin';
import Register from '../pages/auth/Register';
import ChooseMethod from '../pages/auth/ChooseMethod';
import Dashboard from '../pages/dashboard/Dashboard';
import Projects from '../pages/projects/Projects';
import ProjectDetails from '../pages/projects/ProjectDetails';
import ProjectSettings from '../pages/projects/ProjectSettings';
import KanbanBoard from '../pages/kanban/KanbanBoard';
import ScrumBoard from '../pages/scrum/ScrumBoard';
import Backlog from '../pages/scrum/Backlog';
import Sprints from '../pages/scrum/Sprints';
import Issues from '../pages/issues/Issues';
import IssueDetails from '../pages/issues/IssueDetails';
import Users from '../pages/users/Users';
import Profile from '../pages/users/Profile';
import Reports from '../pages/reports/Reports';
import AdminDashboard from '../pages/admin/AdminDashboard';

// =========================================================================
// 1. STANDARD USER GUARD: User must be logged in
// =========================================================================
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// =========================================================================
// 2. STRICT ADMIN GUARD: User MUST be logged in AND have role === 'Admin'
// =========================================================================
const AdminProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('flowboard_role');

  // Not logged in at all -> send to Admin Login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in, but NOT an Admin -> kick out of admin area
  if (role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- Public Auth & Onboarding Routes --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/register" element={<Register />} />

      {/* --- Standard Protected App Routes (Requires Login) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/choose-method" element={<ChooseMethod />} />

        {/* Main Application Shell Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/settings" element={<ProjectSettings />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/:id/settings" element={<ProjectSettings />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/scrum" element={<ScrumBoard />} />
          <Route path="/scrum/backlog" element={<Backlog />} />
          <Route path="/scrum/sprints" element={<Sprints />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issues/:key" element={<IssueDetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      {/* --- STRICT ADMIN ROUTE (Only accessible after Admin Login) --- */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* --- Catch-all route (Send unauthenticated users to login) --- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;