import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Terminal,
  Zap,
} from 'lucide-react';

const MASTER_ADMIN_KEY = 'FB-ADM-9941';

export default function AdminLogin() {
  const [email, setEmail] = useState('malefiya@flowboard.com');
  const [password, setPassword] = useState('admin123');
  const [adminSecurityKey, setAdminSecurityKey] = useState('FB-ADM-9941');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // 1. Hardware Token / Clearance Key Verification
      if (adminSecurityKey.trim().toUpperCase() !== MASTER_ADMIN_KEY) {
        throw new Error('Invalid Security Clearance Key. Hardware token mismatch.');
      }

      // 2. Credentials Verification
      if (!email.trim() || password.length < 6) {
        throw new Error('Master password must be at least 6 characters.');
      }

      // 3. Set Strict Admin Session & Permissions in LocalStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('flowboard_role', 'Admin');
      localStorage.setItem('token', 'admin-secure-jwt-flw-99');
      localStorage.setItem(
        'flowboard_user',
        JSON.stringify({
          name: 'Malefiya',
          username: 'malefiya',
          email: email.trim(),
          role: 'Admin',
        })
      );

      // 4. Route directly to Admin Dashboard
      navigate('/admin', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Admin authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillAdmin = () => {
    setEmail('malefiya@flowboard.com');
    setPassword('admin123');
    setAdminSecurityKey('FB-ADM-9941');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-stone-100/60 flex items-center justify-center p-4 font-sans text-stone-900">
      <div className="w-full max-w-[440px]">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm mb-3">
            <Shield size={20} strokeWidth={2.2} />
          </div>

          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            System Administrator Console
          </span>

          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            Admin System Login
          </h1>
          <p className="text-stone-500 text-xs mt-1 max-w-[300px]">
            Restricted access for Workspace Management, Role Schemes, and Security Audits.
          </p>
        </div>

        {/* MAIN FORM CARD */}
        <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm space-y-4">
          
          {/* Demo Autofill Helper */}
          <button
            type="button"
            onClick={handleAutofillAdmin}
            className="w-full p-2.5 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-stone-700 font-medium">
              <Zap size={14} className="text-indigo-600" />
              <span>Autofill Admin Credentials</span>
            </div>
            <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded">
              FB-ADM-9941
            </span>
          </button>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs">
              <AlertCircle size={15} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {/* Admin Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Admin Email Address *
              </label>
              <div className="relative flex items-center">
                <Mail size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@flowboard.com"
                  className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Master Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Master Password *
              </label>
              <div className="relative flex items-center">
                <Lock size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Hardware Clearance Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Security Clearance Key *
                </label>
                <span className="text-[10px] text-stone-400 font-mono">2FA / Hardware Token</span>
              </div>
              <div className="relative flex items-center">
                <Terminal size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={adminSecurityKey}
                  onChange={(e) => setAdminSecurityKey(e.target.value)}
                  placeholder="FB-ADM-XXXX"
                  className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs font-mono font-bold text-indigo-700 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Remember Session */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="adminRemember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 text-indigo-600 border-stone-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="adminRemember" className="text-xs text-stone-600 cursor-pointer select-none">
                Maintain secure 30-day session
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <span>{loading ? 'Verifying Clearance...' : 'Access Admin Console'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-5">
          <p className="text-xs text-stone-500">
            Not a System Administrator?{' '}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
            >
              Standard User Login
            </Link>
          </p>

          <div className="mt-6 flex justify-center items-center gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <span>Enforced 2FA</span>
            <span>•</span>
            <span>Role Scheme</span>
            <span>•</span>
            <span>Audit Log</span>
          </div>
        </div>

      </div>
    </div>
  );
}