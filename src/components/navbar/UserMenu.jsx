import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, Settings, Shield, LogOut } from 'lucide-react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open user menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
          M
        </div>
        <ChevronDown
          size={14}
          className={`text-stone-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50">
          <div className="px-4 py-3 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                M
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-stone-900">Malefiya</div>
                <div className="text-[11px] text-stone-600 truncate">
                  malefiya@flowboard.com
                </div>
              </div>
            </div>
            <span className="inline-block mt-2 font-bold text-[10px] text-stone-700 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </div>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors text-sm"
          >
            <User size={15} />
            <span>Profile & Stats</span>
          </Link>

          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors text-sm"
          >
            <Shield size={15} className="text-stone-700" />
            <span>Admin Dashboard</span>
          </Link>

          <Link
            to="/projects/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors text-sm"
          >
            <Settings size={15} />
            <span>Project Settings</span>
          </Link>

          <div className="my-1 border-t border-stone-100" />

          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer text-sm"
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}