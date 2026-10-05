import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim()) errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address.';
    
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters.';
    
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(name, email, password);
      // Redirect strictly to login page after successful registration
      navigate('/login', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-900">
      <div className="w-full max-w-[420px] bg-white border border-stone-200 rounded-2xl p-7 shadow-xs space-y-5">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-xs">
            <FolderKanban size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Create Account</h1>
          <p className="text-xs text-stone-500 mt-1">Start tracking projects and team deliverables</p>
        </div>

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle size={15} className="shrink-0 text-red-600" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Malefiya Abebaw"
              className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
            />
            {errors.name && <p className="text-[11px] text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="user@example.com"
              className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
            />
            {errors.email && <p className="text-[11px] text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="Minimum 8 characters"
              className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
            />
            {errors.password && <p className="text-[11px] text-red-600">{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Re-enter password"
              className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
          >
            <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <p className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}