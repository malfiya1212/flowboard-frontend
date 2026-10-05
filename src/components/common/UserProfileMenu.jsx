import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Shield, Check } from 'lucide-react';

export default function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Load stored user or default
  const user = JSON.parse(localStorage.getItem('flowboard_user') || '{"name": "Malefiya", "email": "malefiya@flowboard.com", "role": "Admin"}');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs hover:ring-2 hover:ring-indigo-300 transition-all cursor-pointer"
      >
        {user.name.charAt(0)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 text-stone-900 font-sans">
          <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-stone-900">{user.name}</p>
              <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="py-1">
            <div className="px-4 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Atlassian Account</div>
            <button className="w-full px-4 py-2 text-left text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2">
              <User size={14} className="text-stone-400" /> Profile & visibility
            </button>
            <button className="w-full px-4 py-2 text-left text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2">
              <Shield size={14} className="text-stone-400" /> Personal settings ({user.role})
            </button>
          </div>

          <div className="border-t border-stone-100 pt-1">
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}