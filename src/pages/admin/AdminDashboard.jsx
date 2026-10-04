import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Key,
  FolderKanban,
  CheckSquare,
  GitBranch,
  Bell,
  Cpu,
  Lock,
  Sliders,
  FileText,
  Search,
  ChevronRight,
  LogOut,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  Trash2,
  Laptop,
  Smartphone
} from 'lucide-react';

// Relative timestamp formatter
const formatRelativeTime = (mins) => {
  if (mins === 0) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const getIsoTimestamp = (mins = 0) => {
  const d = new Date(Date.now() - mins * 60 * 1000);
  return d.toISOString().replace('T', ' ').substring(0, 19);
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);

  // Active Navigation: section / subItem
  const [activeSection, setActiveSection] = useState('user-management');
  const [activeSubItem, setActiveSubItem] = useState('users');

  // --- STRICT AUTHENTICATION GUARD ---
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('flowboard_role');

    if (!isAuth || role !== 'Admin') {
      navigate('/admin/login', { replace: true });
    } else {
      setIsAuthenticatedAdmin(true);
    }
  }, [navigate]);

  const handleAdminLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('flowboard_role');
    localStorage.removeItem('flowboard_user');
    localStorage.removeItem('flowboard_access_token');
    localStorage.removeItem('flowboard_refresh_token');
    sessionStorage.clear();
    navigate('/admin/login', { replace: true });
  };

  // --- STATE: USERS ---
  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      name: 'Malefiya',
      email: 'malefiya@flowboard.dev',
      groups: ['jira-administrators', 'flowboard-developers'],
      assignedRole: 'role-sys-admin',
      status: 'Active',
      lastActiveMins: 2,
      projects: ['FLW', 'AUTH'],
    },
    {
      id: 'usr-2',
      name: 'Sarah Smith',
      email: 'sarah.smith@flowboard.dev',
      groups: ['flowboard-managers'],
      assignedRole: 'role-pm',
      status: 'Active',
      lastActiveMins: 25,
      projects: ['FLW', 'AUTH', 'API'],
    },
    {
      id: 'usr-3',
      name: 'John Doe',
      email: 'john.doe@flowboard.dev',
      groups: ['flowboard-developers'],
      assignedRole: 'role-dev',
      status: 'Active',
      lastActiveMins: 110,
      projects: ['API'],
    },
    {
      id: 'usr-4',
      name: 'Alex Johnson',
      email: 'alex.j@flowboard.dev',
      groups: ['flowboard-developers'],
      assignedRole: 'role-qa',
      status: 'Suspended',
      lastActiveMins: 2880,
      projects: ['FLW'],
    },
  ]);

  // --- STATE: GROUPS ---
  const [groups, setGroups] = useState([
    { id: 'jira-administrators', name: 'jira-administrators', description: 'System Administrators with site-wide access' },
    { id: 'flowboard-managers', name: 'flowboard-managers', description: 'Project Leads and Product Owners' },
    { id: 'flowboard-developers', name: 'flowboard-developers', description: 'Core Software Developers and QA' },
  ]);

  // --- STATE: CONFIGURABLE ROLES ---
  const [roles] = useState([
    { id: 'role-sys-admin', name: 'System Administrator', description: 'Complete site control and configuration access' },
    { id: 'role-proj-admin', name: 'Project Administrator', description: 'Manage project settings, components, and versions' },
    { id: 'role-pm', name: 'Project Manager', description: 'Schedule sprints, manage backlogs, and roadmap tracking' },
    { id: 'role-dev', name: 'Developer', description: 'Create and transition issues, branch code, and log work' },
    { id: 'role-qa', name: 'Tester', description: 'File defects, execute test cycles, and verify fixes' },
    { id: 'role-rep', name: 'Reporter', description: 'Log initial issues and track issue progress' },
    { id: 'role-view', name: 'Viewer', description: 'Read-only access to boards, roadmaps, and reports' },
  ]);

  // --- STATE: PERMISSION SCHEMES ---
  const [permissionSchemes, setPermissionSchemes] = useState([
    {
      id: 'scheme-default-software',
      name: 'Default Software Permission Scheme',
      description: 'Standard Atlassian-style permissions for Scrum & Kanban boards',
      grants: [
        { permission: 'BROWSE_PROJECT', targetId: 'role-dev', targetName: 'Developers' },
        { permission: 'BROWSE_PROJECT', targetId: 'role-pm', targetName: 'Project Managers' },
        { permission: 'CREATE_ISSUE', targetId: 'role-dev', targetName: 'Developers' },
        { permission: 'CREATE_ISSUE', targetId: 'role-pm', targetName: 'Project Managers' },
        { permission: 'MANAGE_SPRINT', targetId: 'role-pm', targetName: 'Project Managers' },
        { permission: 'ADMINISTER_PROJECT', targetId: 'role-proj-admin', targetName: 'Project Administrators' },
      ],
    },
  ]);

  // --- STATE: PROJECTS ---
  const [projectsList, setProjectsList] = useState([
    { key: 'FLW', name: 'FlowBoard Core App', lead: 'Malefiya', template: 'Scrum', status: 'Active' },
    { key: 'AUTH', name: 'Identity & Authentication', lead: 'Sarah Smith', template: 'Scrum', status: 'Active' },
    { key: 'API', name: 'Cloud REST Gateway', lead: 'John Doe', template: 'Kanban', status: 'Active' },
    { key: 'LEG', name: 'Data Pipeline Migration', lead: 'Alex Johnson', template: 'Kanban', status: 'Archived' },
  ]);

  // --- STATE: SESSIONS ---
  const [sessions, setSessions] = useState([
    { id: 's-1', device: 'Chrome on Windows 11', ip: '192.168.1.14', isCurrent: true, expiresIn: '23h 40m' },
    { id: 's-2', device: 'Safari on iPhone 15', ip: '10.0.4.88', isCurrent: false, expiresIn: '4h 10m' },
  ]);

  // Modals & UI States
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', roleId: 'role-dev', group: 'flowboard-developers' });
  const [newGroupName, setNewGroupName] = useState('');

  // Handlers: Users
  const handleToggleUserStatus = (userId) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u)));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Revoke access and delete user account?')) {
      setUsers(users.filter((u) => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(null);
    }
  };

  const handleInviteUser = (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;

    const created = {
      id: `usr-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      groups: [inviteForm.group],
      assignedRole: inviteForm.roleId,
      status: 'Active',
      lastActiveMins: 0,
      projects: [],
    };

    setUsers([created, ...users]);
    setInviteForm({ name: '', email: '', roleId: 'role-dev', group: 'flowboard-developers' });
    setShowInviteModal(false);
  };

  // Handlers: Groups
  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setGroups([...groups, { id: newGroupName.toLowerCase().replace(/\s+/g, '-'), name: newGroupName.trim(), description: 'Organizational Team Group' }]);
    setNewGroupName('');
  };

  const handleDeleteGroup = (groupId) => {
    if (groupId === 'jira-administrators') {
      alert('Cannot delete the root administrator group.');
      return;
    }
    setGroups(groups.filter((g) => g.id !== groupId));
    setUsers(users.map((u) => ({ ...u, groups: u.groups.filter((g) => g !== groupId) })));
  };

  // Handlers: Permissions
  const handleAddGrant = (permissionKey, roleId, roleName) => {
    const scheme = permissionSchemes[0];
    if (scheme.grants.some((g) => g.permission === permissionKey && g.targetId === roleId)) return;
    const updated = {
      ...scheme,
      grants: [...scheme.grants, { permission: permissionKey, targetId: roleId, targetName: roleName }],
    };
    setPermissionSchemes([updated]);
  };

  const handleRemoveGrant = (permissionKey, targetId) => {
    const scheme = permissionSchemes[0];
    const updated = {
      ...scheme,
      grants: scheme.grants.filter((g) => !(g.permission === permissionKey && g.targetId === targetId)),
    };
    setPermissionSchemes([updated]);
  };

  // Handlers: Sessions
  const handleTerminateSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  // Nav Tree Layout
  const navigationScheme = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Shield,
      subItems: [{ id: 'overview', label: 'System Overview' }],
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      subItems: [
        { id: 'users', label: 'Users' },
        { id: 'groups', label: 'Groups' },
        { id: 'roles', label: 'Configurable Roles' },
      ],
    },
    {
      id: 'permissions',
      label: 'Permission Schemes',
      icon: Key,
      subItems: [{ id: 'scheme-matrix', label: 'Permission Schemes' }],
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      subItems: [{ id: 'all-projects', label: 'All Projects' }],
    },
    {
      id: 'security',
      label: 'Security & Sessions',
      icon: Lock,
      subItems: [{ id: 'sessions', label: 'Active Sessions' }],
    },
    {
      id: 'audit-log',
      label: 'Audit Log',
      icon: FileText,
      subItems: [{ id: 'system-audit', label: 'Audit Log' }],
    },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.assignedRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!isAuthenticatedAdmin) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center font-sans text-xs text-stone-500">
        Verifying Administrative Session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans text-stone-900 antialiased">
      {/* HEADER */}
      <header className="h-14 bg-white border-b border-stone-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Shield size={16} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-stone-900 tracking-tight leading-none">FlowBoard</span>
              <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.5 rounded leading-none uppercase">
                Admin Console
              </span>
            </div>
            <div className="text-[11px] text-stone-400 font-medium">Enterprise Management & Permission Schemes</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
          >
            <span>Workspace Boards</span>
            <ExternalLink size={12} className="text-stone-400" />
          </button>
          <button
            type="button"
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* DUAL PANE LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white border-r border-stone-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-stone-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">Console Schemes</div>
          </div>

          <nav className="p-2 space-y-1 flex-1 text-xs">
            {navigationScheme.map((item) => {
              const isGroupActive = activeSection === item.id;
              const Icon = item.icon;

              return (
                <div key={item.id} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      setActiveSubItem(item.subItems[0].id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer text-left ${
                      isGroupActive ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isGroupActive ? 'text-indigo-600' : 'text-stone-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.subItems.length > 1 && (
                      <ChevronRight size={12} className={`text-stone-400 transition-transform ${isGroupActive ? 'rotate-90' : ''}`} />
                    )}
                  </button>

                  {isGroupActive && item.subItems.length > 1 && (
                    <div className="ml-7 pl-2 border-l border-stone-200 space-y-0.5 my-1">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setActiveSubItem(sub.id)}
                          className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                            activeSubItem === sub.id ? 'text-indigo-700 bg-indigo-50/70 font-bold' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-3 border-t border-stone-100 text-[10px] text-stone-400 font-mono">
            FlowBoard Enterprise v2.4
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Managed Users</span>
                    <div className="text-2xl font-bold text-stone-900 font-mono mt-1">{users.length}</div>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Active Groups</span>
                    <div className="text-2xl font-bold text-stone-900 font-mono mt-1">{groups.length}</div>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Project Schemes</span>
                    <div className="text-2xl font-bold text-stone-900 font-mono mt-1">{projectsList.length}</div>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Active Sessions</span>
                    <div className="text-2xl font-bold text-stone-900 font-mono mt-1">{sessions.length}</div>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">System Node Status</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="font-semibold text-stone-900">Database Engine</div>
                      <div className="text-stone-500 text-[11px] mt-0.5">PostgreSQL Pool • Latency 2ms</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="font-semibold text-stone-900">Permission Matrix</div>
                      <div className="text-stone-500 text-[11px] mt-0.5">Jira RBAC Evaluator • Synced</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="font-semibold text-stone-900">Security Gateways</div>
                      <div className="text-stone-500 text-[11px] mt-0.5">Hardware 2FA / Session Policy • Enforced</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT (Users, Groups, Configurable Roles) */}
            {activeSection === 'user-management' && (
              <div className="space-y-4">
                {activeSubItem === 'users' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-stone-200 p-3 rounded-xl shadow-xs">
                      <div className="flex items-center gap-2 flex-1 w-full max-w-md">
                        <Search size={14} className="text-stone-400 ml-1" />
                        <input
                          type="text"
                          placeholder="Search users by name or email..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                        >
                          <option value="All">All Roles</option>
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowInviteModal(true)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus size={14} />
                          <span>Invite User</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs text-stone-700">
                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                          <tr>
                            <th className="px-5 py-3">User & Email</th>
                            <th className="px-5 py-3">Assigned Role</th>
                            <th className="px-5 py-3">Group Membership</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                              <td className="px-5 py-3.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedUser(u)}
                                  className="font-bold text-stone-900 hover:text-indigo-600 cursor-pointer text-left block"
                                >
                                  {u.name}
                                </button>
                                <div className="text-[11px] text-stone-400 font-mono">{u.email}</div>
                              </td>
                              <td className="px-5 py-3.5">
                                <select
                                  value={u.assignedRole}
                                  onChange={(e) => {
                                    const next = e.target.value;
                                    setUsers(users.map((x) => (x.id === u.id ? { ...x, assignedRole: next } : x)));
                                  }}
                                  className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-[11px] font-semibold text-stone-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
                                >
                                  {roles.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex flex-wrap gap-1">
                                  {u.groups.map((g) => (
                                    <span key={g} className="font-mono text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                                      {g}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserStatus(u.id)}
                                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border cursor-pointer ${
                                    u.status === 'Active' ? 'bg-stone-100 text-stone-800 border-stone-200' : 'bg-stone-200 text-stone-500 border-stone-300'
                                  }`}
                                >
                                  {u.status}
                                </button>
                              </td>
                              <td className="px-5 py-3.5 text-right space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedUser(u)}
                                  className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                                >
                                  Permissions
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="text-[11px] font-semibold text-stone-400 hover:text-stone-900 cursor-pointer"
                                >
                                  Revoke
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSubItem === 'groups' && (
                  <div className="space-y-4">
                    <form onSubmit={handleCreateGroup} className="flex gap-2 max-w-md bg-white border border-stone-200 p-3 rounded-xl shadow-xs">
                      <input
                        type="text"
                        placeholder="e.g. security-auditors"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-indigo-600"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                      >
                        Create Group
                      </button>
                    </form>

                    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs text-stone-700">
                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                          <tr>
                            <th className="px-5 py-3">Group Name</th>
                            <th className="px-5 py-3">Description</th>
                            <th className="px-5 py-3">Enrolled Members</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {groups.map((g) => {
                            const count = users.filter((u) => u.groups.includes(g.id)).length;
                            return (
                              <tr key={g.id} className="hover:bg-stone-50/70 transition-colors">
                                <td className="px-5 py-3.5 font-mono font-bold text-stone-900">{g.name}</td>
                                <td className="px-5 py-3.5 text-stone-500">{g.description}</td>
                                <td className="px-5 py-3.5 font-mono text-stone-700">{count} users</td>
                                <td className="px-5 py-3.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGroup(g.id)}
                                    className="text-[11px] font-semibold text-stone-400 hover:text-stone-900 cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSubItem === 'roles' && (
                  <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs text-stone-700">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                        <tr>
                          <th className="px-5 py-3">Configured Role Name</th>
                          <th className="px-5 py-3">Description & Scope</th>
                          <th className="px-5 py-3 text-right">Assigned Users</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {roles.map((r) => {
                          const count = users.filter((u) => u.assignedRole === r.id).length;
                          return (
                            <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                              <td className="px-5 py-3.5 font-bold text-stone-900">{r.name}</td>
                              <td className="px-5 py-3.5 text-stone-500">{r.description}</td>
                              <td className="px-5 py-3.5 font-mono text-stone-700 text-right">{count} users</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PERMISSION SCHEMES (Jira-style RBAC Matrix) */}
            {activeSection === 'permissions' && (
              <div className="space-y-4">
                <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                  <h3 className="font-bold text-sm text-stone-900">{permissionSchemes[0].name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{permissionSchemes[0].description}</p>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                      <tr>
                        <th className="px-5 py-3 w-1/3">Project Permission</th>
                        <th className="px-5 py-3">Granted Roles / Groups</th>
                        <th className="px-5 py-3 text-right">Add Grant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {['BROWSE_PROJECT', 'CREATE_ISSUE', 'EDIT_ISSUE', 'MANAGE_SPRINT', 'ADMINISTER_PROJECT'].map((perm) => {
                        const grants = permissionSchemes[0].grants.filter((g) => g.permission === perm);
                        return (
                          <tr key={perm} className="hover:bg-stone-50/70 transition-colors">
                            <td className="px-5 py-3.5 font-mono font-bold text-stone-900">{perm}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex flex-wrap gap-1.5">
                                {grants.length > 0 ? (
                                  grants.map((g) => (
                                    <span key={g.targetId} className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold bg-stone-100 border border-stone-200 text-stone-800 px-2 py-0.5 rounded">
                                      {g.targetName}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveGrant(perm, g.targetId)}
                                        className="text-stone-400 hover:text-stone-900 cursor-pointer"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-stone-400 italic text-[11px]">Unassigned (Deny all)</span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const r = roles.find((x) => x.id === e.target.value);
                                    if (r) handleAddGrant(perm, r.id, r.name);
                                    e.target.value = '';
                                  }
                                }}
                                className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-[11px] font-semibold text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                              >
                                <option value="">+ Grant Role</option>
                                {roles.map((r) => (
                                  <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: PROJECTS */}
            {activeSection === 'projects' && (
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Key</th>
                      <th className="px-5 py-3">Project Name</th>
                      <th className="px-5 py-3">Lead</th>
                      <th className="px-5 py-3">Template</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {projectsList.map((p) => (
                      <tr key={p.key} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-indigo-700 bg-indigo-50/30 w-16 text-center">{p.key}</td>
                        <td className="px-5 py-3.5 font-bold text-stone-900">{p.name}</td>
                        <td className="px-5 py-3.5 text-stone-600">{p.lead}</td>
                        <td className="px-5 py-3.5 font-mono text-stone-500">{p.template}</td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-stone-200 bg-stone-100 text-stone-700">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 5: SECURITY & SESSIONS */}
            {activeSection === 'security' && (
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Active Administrative Sessions</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Manage and terminate active console authentication tokens.</p>
                </div>

                <div className="divide-y divide-stone-100">
                  {sessions.map((sess) => (
                    <div key={sess.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600">
                          {sess.device.includes('iPhone') ? <Smartphone size={16} /> : <Laptop size={16} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">{sess.device}</span>
                            {sess.isCurrent && (
                              <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                            IP: {sess.ip} • Expires: {sess.expiresIn}
                          </div>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleTerminateSession(sess.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-md cursor-pointer"
                        >
                          Terminate
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: AUDIT LOG */}
            {activeSection === 'audit-log' && (
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Logged Timestamp</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Actor</th>
                      <th className="px-5 py-3">Action Description</th>
                      <th className="px-5 py-3 text-right">Origin IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {[
                      { mins: 2, cat: 'Security', actor: 'Malefiya', act: 'Admin session authenticated with hardware token', ip: '192.168.1.14' },
                      { mins: 45, cat: 'Users', actor: 'Malefiya', act: 'Suspended user Alex Johnson', ip: '192.168.1.14' },
                      { mins: 120, cat: 'Projects', actor: 'Sarah Smith', act: 'Created project version v1.2.0 in AUTH', ip: '10.0.4.21' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-stone-500 text-[11px]">{getIsoTimestamp(log.mins)}</td>
                        <td className="px-5 py-3.5 font-mono text-[9px] font-bold text-stone-700">{log.cat}</td>
                        <td className="px-5 py-3.5 font-bold text-stone-900">{log.actor}</td>
                        <td className="px-5 py-3.5 text-stone-700">{log.act}</td>
                        <td className="px-5 py-3.5 font-mono text-stone-400 text-right text-[11px]">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* INSPECTOR DRAWER */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 space-y-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-stone-900">{selectedUser.name}</h3>
                <div className="text-xs font-mono text-stone-400">{selectedUser.email}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-stone-400 hover:text-stone-700 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Role & Permissions</span>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 space-y-1">
                <div>Role: <span className="font-bold">{roles.find((r) => r.id === selectedUser.assignedRole)?.name}</span></div>
                <div>Status: <span className="font-mono">{selectedUser.status}</span></div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Enrolled Groups</span>
              <div className="flex flex-wrap gap-1">
                {selectedUser.groups.map((g) => (
                  <span key={g} className="font-mono text-[10px] bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-stone-700">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="w-full mt-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* INVITE USER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-sm text-stone-900">Provision FlowBoard Account</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.m@flowboard.dev"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Assigned Role</label>
                <select
                  value={inviteForm.roleId}
                  onChange={(e) => setInviteForm({ ...inviteForm, roleId: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Primary Group</label>
                <select
                  value={inviteForm.group}
                  onChange={(e) => setInviteForm({ ...inviteForm, group: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
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
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
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