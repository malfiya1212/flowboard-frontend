import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'projects' | 'settings' | 'audit'
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- 1. JIRA ADMIN STATE DATA ---
  
  // Users Management State
  const [users, setUsers] = useState([
    { id: 'usr-1', name: 'Malefiya', email: 'malefiya@flowboard.dev', role: 'System Admin', status: 'Active', lastActive: 'Just now' },
    { id: 'usr-2', name: 'Sarah Smith', email: 'sarah.smith@flowboard.dev', role: 'Project Manager', status: 'Active', lastActive: '12m ago' },
    { id: 'usr-3', name: 'John Doe', email: 'john.doe@flowboard.dev', role: 'Software Developer', status: 'Active', lastActive: '2h ago' },
    { id: 'usr-4', name: 'Alex Johnson', email: 'alex.j@flowboard.dev', role: 'Software Developer', status: 'Suspended', lastActive: '3d ago' },
    { id: 'usr-5', name: 'Emily Davis', email: 'emily.d@flowboard.dev', role: 'Reporter', status: 'Active', lastActive: '1d ago' },
  ]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'Software Developer' });

  // Project Management State
  const [projects, setProjects] = useState([
    { id: 'prj-1', key: 'FLW', name: 'FlowBoard Core App', lead: 'Malefiya', type: 'Kanban', issuesCount: 47, status: 'Active' },
    { id: 'prj-2', key: 'AUTH', name: 'Identity & Authentication', lead: 'Sarah Smith', type: 'Scrum', issuesCount: 22, status: 'Active' },
    { id: 'prj-3', key: 'API', name: 'Cloud REST Gateway', lead: 'John Doe', type: 'Scrum', issuesCount: 18, status: 'Active' },
    { id: 'prj-4', key: 'LEG', name: 'Legacy Data Migration', lead: 'Alex Johnson', type: 'Kanban', issuesCount: 31, status: 'Archived' },
  ]);

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowPublicSignups: true,
    enforceHardware2FA: true,
    sessionTimeoutHours: 24,
    defaultWorkspaceRole: 'Software Developer',
  });

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState([
    { id: 'aud-1', category: 'Security', user: 'Malefiya', action: 'Administrative hardware clearance verified', time: '10 mins ago', ip: '192.168.1.14' },
    { id: 'aud-2', category: 'User Management', user: 'Malefiya', action: 'Updated Alex Johnson account status to Suspended', time: '1 hour ago', ip: '192.168.1.14' },
    { id: 'aud-3', category: 'Project', user: 'Sarah Smith', action: 'Created sprint iteration Sprint-04 in AUTH', time: '3 hours ago', ip: '10.0.4.21' },
    { id: 'aud-4', category: 'Security', user: 'System Guard', action: 'Automated database schema backup encrypted & stored', time: '12 hours ago', ip: '127.0.0.1' },
  ]);
  const [auditCategoryFilter, setAuditCategoryFilter] = useState('All');

  // --- 2. AUTHENTICATION ROUTE GUARD ---
  useEffect(() => {
    const role = localStorage.getItem('flowboard_role');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated || role !== 'Admin') {
      navigate('/admin/login', { replace: true });
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  const handleAdminLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('flowboard_role');
    localStorage.removeItem('flowboard_user');
    sessionStorage.clear();
    navigate('/admin/login', { replace: true });
  };

  // --- 3. JIRA ADMINISTRATIVE HANDLERS ---

  // Live Role Modification
  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    addAuditLog('User Management', `Changed role of user ${userId} to ${newRole}`);
  };

  // Live Status Toggle (Active <-> Suspended)
  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          addAuditLog('User Management', `Changed status of ${u.name} to ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Remove/Delete User
  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to revoke access for ${userName}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      addAuditLog('Security', `Revoked access and deleted user account: ${userName}`);
    }
  };

  // Invite / Add New User
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;

    const createdUser = {
      id: `usr-${Date.now()}`,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      status: 'Active',
      lastActive: 'Never',
    };

    setUsers((prev) => [createdUser, ...prev]);
    addAuditLog('User Management', `Provisioned new workspace account: ${createdUser.email} (${createdUser.role})`);
    setNewUserData({ name: '', email: '', role: 'Software Developer' });
    setShowInviteModal(false);
  };

  // Project Archiving Toggle
  const handleToggleProjectArchive = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedStatus = p.status === 'Active' ? 'Archived' : 'Active';
          addAuditLog('Project', `${updatedStatus} project workspace: ${p.name} [${p.key}]`);
          return { ...p, status: updatedStatus };
        }
        return p;
      })
    );
  };

  // System Setting Toggle
  const handleToggleSetting = (settingKey) => {
    setSystemSettings((prev) => {
      const nextValue = !prev[settingKey];
      addAuditLog('System Configuration', `Modified global policy [${settingKey}] to ${nextValue}`);
      return { ...prev, [settingKey]: nextValue };
    });
  };

  // Add Dynamic Audit Entry
  const addAuditLog = (category, action) => {
    const entry = {
      id: `aud-${Date.now()}`,
      category,
      user: 'Malefiya (Admin)',
      action,
      time: 'Just now',
      ip: '192.168.1.14',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole =
      selectedRoleFilter === 'All' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditCategoryFilter === 'All') return true;
    return log.category === auditCategoryFilter;
  });

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center font-sans">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-widest animate-pulse">
          Authenticating Administrative Clearance...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 font-sans p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ================= TOP HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                JIRA CONSOLE
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                Workspace Administration
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Global administration for users, permissions schemes, projects, and security audit policies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Return to Boards
            </button>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Exit Console
            </button>
          </div>
        </div>

        {/* ================= SUMMARY STATS (MINIMAL, ZERO ICONS) ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Total Managed Users
            </span>
            <div className="text-2xl font-bold text-stone-900 font-mono mt-1">
              {users.length}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Active Projects
            </span>
            <div className="text-2xl font-bold text-stone-900 font-mono mt-1">
              {projects.filter((p) => p.status === 'Active').length}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Enforced 2FA Users
            </span>
            <div className="text-2xl font-bold text-stone-900 font-mono mt-1">
              100%
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              System Audit Entries
            </span>
            <div className="text-2xl font-bold text-stone-900 font-mono mt-1">
              {auditLogs.length}
            </div>
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="flex items-center gap-1 border-b border-stone-200 pb-2 text-xs font-semibold">
          {[
            { id: 'users', label: 'User Directory' },
            { id: 'projects', label: 'Project Schemes' },
            { id: 'settings', label: 'System Configuration' },
            { id: 'audit', label: 'Audit Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: USER DIRECTORY ================= */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 p-3 rounded-xl">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="System Admin">System Admin</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Reporter">Reporter</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                + Invite User
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Email Address</th>
                    <th className="px-5 py-3">Assigned Role</th>
                    <th className="px-5 py-3">Access Status</th>
                    <th className="px-5 py-3">Last Active</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-stone-900">{u.name}</td>
                        <td className="px-5 py-3.5 text-stone-600 font-mono">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-[11px] font-semibold text-stone-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
                          >
                            <option value="System Admin">System Admin</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Software Developer">Software Developer</option>
                            <option value="Reporter">Reporter</option>
                          </select>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id)}
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border cursor-pointer ${
                              u.status === 'Active'
                                ? 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200'
                                : 'bg-stone-200 text-stone-500 border-stone-300 hover:bg-stone-300'
                            }`}
                          >
                            {u.status}
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-stone-400 font-mono text-[11px]">
                          {u.lastActive}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="text-[11px] font-semibold text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-stone-400 text-xs">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROJECT SCHEMES ================= */}
        {activeTab === 'projects' && (
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900">Registered Project Workspaces</h2>
                <p className="text-xs text-stone-400 mt-0.5">Manage board methodologies, issue tracking keys, and leads.</p>
              </div>
            </div>

            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-5 py-3">Key</th>
                  <th className="px-5 py-3">Project Name</th>
                  <th className="px-5 py-3">Project Lead</th>
                  <th className="px-5 py-3">Workflow Type</th>
                  <th className="px-5 py-3">Open Issues</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-600 bg-indigo-50/40 w-16 text-center">
                      {p.key}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-stone-900">{p.name}</td>
                    <td className="px-5 py-3.5 text-stone-600">{p.lead}</td>
                    <td className="px-5 py-3.5 font-mono text-stone-500">{p.type}</td>
                    <td className="px-5 py-3.5 font-mono text-stone-800">{p.issuesCount}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-stone-200 bg-stone-100 text-stone-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleProjectArchive(p.id)}
                        className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                      >
                        {p.status === 'Active' ? 'Archive' : 'Restore'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= TAB 3: SYSTEM CONFIGURATION ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Global Workspace Policies</h2>
              <p className="text-xs text-stone-500 mt-0.5">Control tenant authentication enforcement and operational state.</p>
            </div>

            <div className="space-y-4 divide-y divide-stone-100 text-xs">
              
              {/* Policy 1: Maintenance Mode */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="font-bold text-stone-900">System Maintenance Mode</div>
                  <p className="text-stone-500 mt-0.5">Locks all project boards into read-only mode for maintenance operations.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('maintenanceMode')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    systemSettings.maintenanceMode ? 'bg-indigo-600' : 'bg-stone-200'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                      systemSettings.maintenanceMode ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Policy 2: Public Signups */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="font-bold text-stone-900">Allow Self-Registration (/register)</div>
                  <p className="text-stone-500 mt-0.5">Allow new team members to sign up without an administrative invitation.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('allowPublicSignups')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    systemSettings.allowPublicSignups ? 'bg-indigo-600' : 'bg-stone-200'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                      systemSettings.allowPublicSignups ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Policy 3: Enforce Hardware 2FA */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="font-bold text-stone-900">Enforce Hardware Key / 2FA for Administrators</div>
                  <p className="text-stone-500 mt-0.5">Requires the security clearance key on every administrative access portal.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('enforceHardware2FA')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    systemSettings.enforceHardware2FA ? 'bg-indigo-600' : 'bg-stone-200'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                      systemSettings.enforceHardware2FA ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: AUDIT LOG ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white border border-stone-200 p-3 rounded-xl">
              <span className="text-xs font-bold text-stone-700">Filter Event Category:</span>
              <div className="flex gap-1.5">
                {['All', 'Security', 'User Management', 'Project'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAuditCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-[11px] rounded font-semibold cursor-pointer transition-colors ${
                      auditCategoryFilter === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Actor</th>
                    <th className="px-5 py-3">Action Description</th>
                    <th className="px-5 py-3 text-right">Origin IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-stone-400 text-[11px]">{log.time}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-stone-200 bg-stone-100 text-stone-700">
                          {log.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-stone-900">{log.user}</td>
                      <td className="px-5 py-3.5 text-stone-700">{log.action}</td>
                      <td className="px-5 py-3.5 font-mono text-stone-400 text-right text-[11px]">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ================= INVITE USER MODAL ================= */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-sm text-stone-900">Provision New User Account</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@flowboard.dev"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Initial Role Permission</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="Software Developer">Software Developer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Reporter">Reporter</option>
                  <option value="System Admin">System Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Create & Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}