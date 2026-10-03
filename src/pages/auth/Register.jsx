import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, AtSign, Mail, Lock, ArrowRight, AlertCircle, Kanban 
} from 'lucide-react';
import { authService } from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (formData.password !== formData.confirmPassword) return setErrorMessage('Passwords do not match.');
    if (formData.password.length < 6) return setErrorMessage('Password must be at least 6 characters.');

    setLoading(true);
    try {
      await authService.register({
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans antialiased">
      {/* Background Decorative Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[460px] relative z-10">
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-xl shadow-indigo-200 mb-4">
            F
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium text-center px-4">
            Join FlowBoard for agile project management and task tracking.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-slate-200/60">
          
          {/* Modernized Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <span className="text-xs font-bold text-red-700 tracking-tight">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* GRID FOR NAME AND USERNAME (High Density) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={16} />
                  <input name="fullName" type="text" required placeholder="John Doe" value={formData.fullName} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={16} />
                  <input name="username" type="text" required placeholder="johndoe" value={formData.username} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={16} />
                <input name="email" type="email" required placeholder="name@company.com" value={formData.email} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
              </div>
            </div>

            {/* PASSWORDS GRID */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={16} />
                  <input name="password" type="password" required placeholder="••••••••" value={formData.password} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={16} />
                  <input name="confirmPassword" type="password" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Creating Account...' : 'Get Started'} 
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p className="text-center mt-8 text-xs font-medium text-slate-500">
          Already have an account? {' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4 tracking-tight">Log in instead</Link>
        </p>

        <div className="mt-12 flex justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-70">
          <span>Secure</span>
          <span>•</span>
          <span>Encrypted</span>
          <span>•</span>
          <span>Agile</span>
        </div>
      </div>
    </div>
  );
};

export default Register;