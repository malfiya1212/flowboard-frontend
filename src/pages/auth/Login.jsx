import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Kanban, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { authService } from '../../services/authService';
navigate('/dashboard');

const Login = () => {
  const [loginInput, setLoginInput] = useState('john.doe@flowboard.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await authService.login({
        loginInput,
        password,
        rememberMe
      });
      navigate('/choose-method');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Invalid email/username or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    try {
      const res = await authService.forgotPassword(forgotEmail.trim());
      setForgotSuccess(res.message || 'Password reset link sent!');
    } catch (err) {
      setForgotSuccess('If an account exists with that email, a password reset link has been sent.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md mb-1">
            <Kanban size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Log in to FlowBoard</h1>
          <p className="text-xs text-gray-500">
            Manage projects, track issues, and collaborate with your team.
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Email or Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Email or Username *</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                required
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="name@company.com or username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Password *</label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(loginInput.includes('@') ? loginInput : '');
                  setForgotSuccess('');
                  setIsForgotModalOpen(true);
                }}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
              <input
                type="password"
                required
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-xs font-medium text-gray-700 cursor-pointer">
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer shadow-xs mt-2"
          >
            <span>{loading ? 'Logging in...' : 'Log In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100 space-y-3">
          <div>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </Link>
          </div>

          {/* Admin Portal Gateway Link */}
          <div className="pt-2 border-t border-gray-100">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
            >
              <span>🔒 Admin Console Login</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">Reset Password</h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Request Received</span>
                </div>
                <p>{forgotSuccess}</p>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-1.5 mt-2 bg-emerald-600 text-white rounded font-semibold text-xs cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter your account email address and we will send you a password reset link.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
