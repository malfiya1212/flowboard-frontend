import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound,
  Terminal, Zap, Eye, EyeOff, Activity, ShieldCheck
} from 'lucide-react';

const AdminLogin = () => {
  // --- STATES ---
  const [email, setEmail] = useState('malefiya@flowboard.com');
  const [password, setPassword] = useState('admin123');
  const [adminSecurityKey, setAdminSecurityKey] = useState('FB-ADM-9941');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState('Checking...');

  const navigate = useNavigate();

  // --- FEATURE: MOCK SYSTEM HEALTH ---
  useEffect(() => {
    const timer = setTimeout(() => setSystemStatus('System Secure'), 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- HANDLERS ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Professional practice: Simulate a secure delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Store Admin Session
      localStorage.setItem('flowboard_role', 'Admin');
      localStorage.setItem('flowboard_user', JSON.stringify({
        name: 'Malefiya',
        role: 'Admin',
        lastLogin: new Date().toISOString()
      }));

      navigate('/admin');
    } catch (err) {
      setErrorMessage('Access Denied: Invalid security clearance or credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillAdmin = () => {
    setEmail('malefiya@flowboard.com');
    setPassword('admin123');
    setAdminSecurityKey('FB-ADM-9941');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans select-none">
      
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP STATUS BAR (Enterprise Detail) */}
      <div className="absolute top-6 right-8 hidden md:flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
        <div className="flex items-center gap-2 text-slate-500">
          <Activity size={12} className="text-emerald-500 animate-pulse" />
          <span>Server: {systemStatus}</span>
        </div>
        <div className="text-slate-700">|</div>
        <div className="flex items-center gap-2 text-slate-500">
          <ShieldCheck size={12} className="text-blue-500" />
          <span>SSL: AES-256</span>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-7 relative z-10 text-slate-100">
        
        {/* HEADER SECTION */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-red-950/40 ring-4 ring-red-950/50 mb-2">
            <Shield size={32} strokeWidth={2.5} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/40 border border-red-500/20 text-red-400 rounded-full text-[10px] font-bold tracking-widest uppercase">
            <KeyRound size={12} />
            <span>Restricted Access Console</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin System Login</h1>
            <p className="text-xs text-slate-400 mt-1 px-4 leading-relaxed">
              Log in with your Master credentials and Hardware Security Token to access the management layer.
            </p>
          </div>
        </div>

        {/* DEMO AUTOFILL CHIP */}
        <button
          onClick={handleAutofillAdmin}
          className="w-full p-3 bg-slate-950/50 border border-slate-800 hover:border-red-500/30 rounded-2xl flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-400 group-hover:scale-125 transition-transform" />
            <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Autofill Master Admin</span>
          </div>
          <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-900/30">
            FB-MASTER-99
          </span>
        </button>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-xs text-red-300 flex items-center gap-3 animate-shake">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Admin Identity</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-mono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@flowboard.com"
              />
            </div>
          </div>

          {/* PASSWORD WITH TOGGLE */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Master Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* SECURITY TOKEN */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Security Clearance Key</label>
              <span className="text-[9px] font-mono text-slate-600">Encrypted Path</span>
            </div>
            <div className="relative">
              <Terminal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-amber-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-mono tracking-widest"
                value={adminSecurityKey}
                onChange={(e) => setAdminSecurityKey(e.target.value)}
                placeholder="FB-ADM-XXXX"
              />
            </div>
          </div>

          {/* REMEMBER ME */}
          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              id="adminRemember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-red-600 cursor-pointer"
            />
            <label htmlFor="adminRemember" className="text-[11px] text-slate-500 cursor-pointer hover:text-slate-300">
              Maintain administrative session for 24 hours
            </label>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-red-950/20 active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Activity size={18} className="animate-spin" /> Verifying Credentials...
              </span>
            ) : (
              <>
                <span>Access Admin Console</span>
                <ArrowRight size={18} strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="pt-6 border-t border-slate-800/50 flex flex-col items-center gap-3">
          <p className="text-[10px] text-slate-500 font-medium">NOT AN ADMINISTRATOR?</p>
          <Link
            to="/login"
            className="group flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold transition-all"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Return to Team Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;