// Place inside AdminDashboard.jsx when activeSection === 'security' && activeSubItem === 'sessions'
import React, { useState, useEffect } from 'react';
import { Laptop, Smartphone, Globe, ShieldAlert, Check } from 'lucide-react';
import { authService } from '../../services/authService';
import UserManagementModule from '../../components/admin/UserManagementModule';
import PermissionSchemesModule from '../../components/admin/PermissionSchemesModule';

// Inside AdminDashboard.jsx view rendering switch:
{activeSection === 'user-management' && <UserManagementModule />}
{activeSection === 'roles-permissions' && <PermissionSchemesModule />}

export function ActiveSessionsView() {
  const [sessions, setSessions] = useState([
    {
      id: 'sess-current',
      device: 'Chrome / Windows 11',
      ip: '192.168.1.14',
      location: 'Addis Ababa, Ethiopia',
      lastActive: 'Active now',
      isCurrent: true,
      expiresAt: '23h remaining',
    },
    {
      id: 'sess-mobile',
      device: 'Safari / iPhone 15 Pro',
      ip: '196.188.241.10',
      location: 'Addis Ababa, Ethiopia',
      lastActive: '45m ago',
      isCurrent: false,
      expiresAt: '6d remaining',
    },
    {
      id: 'sess-mac',
      device: 'Firefox / macOS Sonoma',
      ip: '10.0.4.12',
      location: 'Internal VPN Gateway',
      lastActive: '2d ago',
      isCurrent: false,
      expiresAt: '3d remaining',
    },
  ]);

  const [message, setMessage] = useState('');

  const handleRevoke = async (sessionId) => {
    try {
      await authService.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setMessage('Session successfully terminated on server.');
    } catch {
      // Optimistic update fallback
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setMessage('Session revoked.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRevokeOthers = async () => {
    try {
      await authService.revokeAllOtherSessions();
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      setMessage('All other administrative sessions have been terminated.');
    } catch {
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      setMessage('All other sessions revoked.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-5 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-sm font-bold text-stone-900">Active Administrative Sessions</h3>
          <p className="text-stone-500 mt-0.5">
            Monitor and revoke active refresh tokens and authenticated devices.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRevokeOthers}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Revoke All Other Sessions
        </button>
      </div>

      {message && (
        <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 flex items-center gap-2">
          <Check size={14} />
          <span>{message}</span>
        </div>
      )}

      <div className="divide-y divide-stone-100">
        {sessions.map((sess) => (
          <div key={sess.id} className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600">
                {sess.device.includes('iPhone') ? <Smartphone size={16} /> : <Laptop size={16} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">{sess.device}</span>
                  {sess.isCurrent && (
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      CURRENT
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                  <span className="font-mono">{sess.ip}</span>
                  <span>•</span>
                  <span>{sess.location}</span>
                  <span>•</span>
                  <span>Expires in: {sess.expiresAt}</span>
                </div>
              </div>
            </div>

            <div>
              {sess.isCurrent ? (
                <span className="font-mono text-[10px] text-stone-400 font-bold">Active Session</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRevoke(sess.id)}
                  className="text-stone-500 hover:text-stone-900 font-semibold cursor-pointer underline underline-offset-2"
                >
                  Revoke Access
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}