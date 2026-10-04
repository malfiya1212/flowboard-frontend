import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-14 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <Link to="/projects" className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs">
          <FolderKanban size={18} strokeWidth={2.4} />
        </div>
        <span className="font-bold text-base text-stone-900 tracking-tight">FlowBoard</span>
      </Link>

      {currentUser && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-600 border-r border-stone-200 pr-4">
            <User size={14} className="text-stone-400" />
            <span className="font-medium">{currentUser.name}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </header>
  );
}