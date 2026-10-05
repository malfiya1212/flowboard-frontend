import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Lock, Mail } from 'lucide-react';
import axios from 'axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Connects to your backend admin authentication route
      const res = await axios.post('http://localhost:5000/api/auth/admin-login', {
        email,
        password
      });

      // Save tokens and authenticated admin user info securely
      localStorage.setItem('flowboard_token', res.data.accessToken);
      localStorage.setItem('flowboard_user', JSON.stringify(res.data.user));

      // Redirect to workspace framework selector
      navigate('/choose-method');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-900">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 shadow-xs">
        
        {/* Header Branding */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs">
            <ShieldAlert size={18} strokeWidth={2.4} />
          </div>
          <div>
            <span className="font-bold text-lg text-stone-900 tracking-tight leading-none block">FlowBoard</span>
            <span className="text-[10px] text-stone-400 font-medium">Enterprise Admin Portal</span>
          </div>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-stone-900 mb-1">
          Administrator Login
        </h1>
        <p className="text-xs text-stone-500 mb-6">
          Enter your elevated administrative credentials to access workspace settings and user controls.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Admin Email *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="email" 
                required
                placeholder="admin@flowboard.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Password *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Admin'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs text-indigo-600 hover:underline font-semibold">
            Back to Standard User Login
          </Link>
        </div>

      </div>
    </div>
  );
}