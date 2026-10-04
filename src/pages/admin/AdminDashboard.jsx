import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- SECURITY & LOGIN ENFORCEMENT ---
  useEffect(() => {
    const role = localStorage.getItem('flowboard_role');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // Must be logged in AND have an Admin role
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

  // 5 Main Stats (Simplified 3-color enterprise style, no icons)
  const stats = [
    { title: 'Total Users', value: 14 },
    { title: 'Total Projects', value: 5 },
    { title: 'Total Issues', value: 47 },
    { title: 'Active Sprints', value: 2 },
    { title: 'Completed Issues', value: 31 },
  ];

  const systemActivities = [
    { id: '1', user: 'Malefiya', role: 'Admin', action: 'Created project FlowBoard (FLW)', time: '1 hour ago' },
    { id: '2', user: 'Sarah Smith', role: 'Project Manager', action: 'Started Sprint 1 in FlowBoard', time: '3 hours ago' },
    { id: '3', user: 'Malefiya', role: 'Admin', action: 'Updated user role for John Doe to Developer', time: '5 hours ago' },
    { id: '4', user: 'Alex Johnson', role: 'Developer', action: 'Closed issue FLW-3 (Create REST API)', time: '1 day ago' },
    { id: '5', user: 'System', role: 'Audit', action: 'Automated daily backup completed successfully', time: '1 day ago' },
  ];

  const usersList = [
    { id: '1', name: 'Malefiya', email: 'malefiya@flowboard.dev', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Sarah Smith', email: 'sarah.smith@flowboard.dev', role: 'Project Manager', status: 'Active' },
    { id: '3', name: 'John Doe', email: 'john.doe@flowboard.dev', role: 'Developer', status: 'Active' },
    { id: '4', name: 'Alex Johnson', email: 'alex.j@flowboard.dev', role: 'Developer', status: 'Active' },
    { id: '5', name: 'Emily Davis', email: 'emily.d@flowboard.dev', role: 'Reporter', status: 'Active' },
  ];

  const rolePermissions = [
    { role: 'Admin', permissions: 'Manage users, projects, teams, delete projects, manage permissions, system activity' },
    { role: 'Project Manager', permissions: 'Create projects, manage members, epics, issues, sprints, backlog, reports' },
    { role: 'Developer', permissions: 'View assigned issues, update & move issues, comments, attachments, subtasks' },
    { role: 'Reporter', permissions: 'Create issues, view issues, comment, track progress' },
  ];

  // Prevent flicker while verifying clearance
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fafaf9] min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Shield size={18} />
              </div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                Admin Management Console
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Restricted workspace administration, user authorization, role permissions, and global audit logs.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-sm cursor-pointer"
          >
            <LogOut size={14} />
            <span>Exit Console</span>
          </button>
        </div>

        {/* 5 Main Admin Metric Cards (Simplified 3-Color Style, No Rainbows or Icons) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s) => (
            <div
              key={s.title}
              className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
            >
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                {s.title}
              </p>
              <div className="text-2xl font-bold text-stone-900 font-mono">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Activity' },
            { id: 'users', label: 'User Management' },
            { id: 'roles', label: 'Role Permissions Matrix' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                activeSection === sec.id
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Section 1: Overview & System Activity */}
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* System Activity Feed */}
            <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-600" />
                  <span>System Activity Log</span>
                </h2>
                <span className="text-[11px] text-stone-400">Live Workspace Audit</span>
              </div>

              <div className="space-y-2.5">
                {systemActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-stone-50 border border-stone-100 rounded-lg flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-stone-900">{act.user}</span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                        {act.role}
                      </span>
                      <span className="text-stone-600">{act.action}</span>
                    </div>
                    <span className="text-[11px] text-stone-400 whitespace-nowrap">
                      {act.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Privileges Info Panel */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-1 border-b border-stone-100">
                <Shield size={16} className="text-indigo-600" />
                <span>Admin Privileges</span>
              </h2>
              <p className="text-stone-500 leading-relaxed">
                As a verified System Administrator, you hold full privileges to invite and deactivate accounts, assign security roles, manage team boards, and audit actions.
              </p>
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 space-y-1">
                <span className="font-bold text-stone-900 block">Security Status: Enforced</span>
                <span className="text-[11px] text-stone-600 block">
                  Hardware key verification and RBAC guards active across all operations.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: User Management Table */}
        {activeSection === 'users' && (
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-stone-900">{u.name}</td>
                    <td className="px-5 py-3.5 text-stone-600 font-mono">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`font-bold text-[10px] px-2 py-0.5 rounded border ${
                          u.role === 'Admin'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-stone-700 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-[10px]">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 3: Role Management Matrix */}
        {activeSection === 'roles' && (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-stone-900 pb-1 border-b border-stone-100">
              Role Permissions Matrix
            </h2>
            <div className="space-y-2.5 text-xs">
              {rolePermissions.map((rp) => (
                <div
                  key={rp.role}
                  className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <span className="font-bold text-stone-900 w-36 shrink-0">
                    {rp.role}:
                  </span>
                  <span className="text-stone-600 flex-1 leading-relaxed">
                    {rp.permissions}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}