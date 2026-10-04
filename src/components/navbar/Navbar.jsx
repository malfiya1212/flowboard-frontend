import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  Plus,
  Bell,
  Kanban,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Shield,
} from 'lucide-react';

const searchableIssues = [
  { key: 'FLW-25', title: 'Login authentication failure on Safari', type: 'Bug', status: 'OPEN' },
  { key: 'FLW-10', title: 'Login page layout and form validation', type: 'Story', status: 'TO DO' },
  { key: 'FLW-11', title: 'User registration with email verification', type: 'Story', status: 'TO DO' },
  { key: 'FLW-4', title: 'Agile dashboard with project metrics and workload', type: 'Task', status: 'IN REVIEW' },
  { key: 'FLW-7', title: 'Backend REST API authentication endpoints', type: 'Task', status: 'IN PROGRESS' },
  { key: 'FLW-24', title: 'OAuth Google login integration', type: 'Story', status: 'BACKLOG' },
  { key: 'FLW-12', title: 'Forgot password reset email workflow', type: 'Bug', status: 'IN PROGRESS' },
];

const initialNotifications = [
  { id: 'n1', icon: '🔔', title: 'You were assigned FLW-24', subtitle: 'Malefiya assigned you OAuth Google login integration', time: '10m ago', isRead: false, link: '/scrum' },
  { id: 'n2', icon: '💬', title: 'Sara commented on FLW-12', subtitle: '"The login validation needs fixing."', time: '35m ago', isRead: false, link: '/scrum' },
  { id: 'n3', icon: '🚀', title: 'Sprint 1 starts tomorrow', subtitle: 'Goal: Build authentication system', time: '1h ago', isRead: false, link: '/scrum' },
  { id: 'n4', icon: '⚠️', title: 'Due date approaching for FLW-10', subtitle: 'Login page is due in 2 days', time: '3h ago', isRead: true, link: '/scrum' },
];

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  // Dropdown states
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState(initialNotifications);

  // Search states (Input + Debounced)
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // References
  const searchContainerRef = useRef(null);
  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Debouncing effect: waits 300ms after last keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter against the debounced query
  const searchResults = debouncedQuery.trim()
    ? searchableIssues.filter((issue) => {
        const query = debouncedQuery.toLowerCase();
        return (
          issue.key.toLowerCase().includes(query) ||
          issue.title.toLowerCase().includes(query) ||
          issue.type.toLowerCase().includes(query) ||
          issue.status.toLowerCase().includes(query)
        );
      })
    : [];

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSelectSearchResult = (issue) => {
    setSearchQuery('');
    setDebouncedQuery('');
    setIsSearchOpen(false);
    navigate(`/issues?search=${encodeURIComponent(issue.key)}`);
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = searchContainerRef.current?.querySelector('input');
        if (searchInput) {
          searchInput.focus();
          setIsSearchOpen(true);
        }
      }

      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setShowNotifications(false);
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowUserDropdown(false);
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-stone-200 flex items-center justify-between px-4 shadow-sm">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-md text-stone-600 hover:bg-stone-100 transition-colors"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-sm">
            <Kanban size={18} strokeWidth={2.2} />
          </div>
          <span className="font-bold text-lg text-stone-900 tracking-tight hidden sm:block">
            FlowBoard
          </span>
        </Link>
      </div>

      {/* GLOBAL SEARCH */}
      <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl mx-6 relative">
        <div className="relative w-full flex items-center">
          <Search size={16} className="absolute left-3 text-stone-400 pointer-events-none" />

          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Search issues..."
            className="w-full pl-9 pr-16 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 transition-all"
          />

          <span className="absolute right-2.5 text-[10px] font-medium text-stone-400 bg-white border border-stone-200 rounded px-1.5 py-0.5 pointer-events-none">
            Ctrl K
          </span>
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && debouncedQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-2">
              Matching Issues
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((issue) => (
                  <button
                    type="button"
                    key={issue.key}
                    onClick={() => handleSelectSearchResult(issue)}
                    className="w-full text-left p-2.5 hover:bg-stone-50 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px] shrink-0">
                        {issue.key}
                      </span>
                      <span className="font-semibold text-stone-700 truncate">
                        {issue.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-[10px] text-stone-400">{issue.type}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                        {issue.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-stone-400">
                <Search size={20} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">No issues found matching</p>
                <p className="text-xs font-semibold text-stone-700 mt-1">"{debouncedQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => navigate('/issues?create=true')}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg font-semibold text-sm transition-all shadow-sm"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Create</span>
        </button>

        {/* NOTIFICATIONS */}
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="relative p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-indigo-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-[10px] text-stone-400 mt-0.5">{unreadCount} unread</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-80 overflow-y-auto mt-2">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(n.link);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 text-xs transition-colors ${
                      n.isRead ? 'bg-white hover:bg-stone-50' : 'bg-indigo-50 hover:bg-indigo-100/50'
                    }`}
                  >
                    <span className="text-base shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-900">{n.title}</div>
                      <div className="text-[11px] text-stone-600 mt-0.5 line-clamp-1">{n.subtitle}</div>
                      <div className="text-[10px] text-stone-400 mt-1">{n.time}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* USER PROFILE */}
        <div ref={userDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-100 transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
              M
            </div>
            <ChevronDown size={14} className={`text-stone-600 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-stone-100">
                <div className="font-bold text-sm text-stone-900">Malefiya</div>
                <div className="text-[11px] text-stone-600 truncate">malefiya@flowboard.com</div>
              </div>

              <Link to="/profile" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-stone-600 hover:bg-stone-50 text-sm">
                <User size={15} /> <span>Profile</span>
              </Link>
              <Link to="/projects/settings" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-stone-600 hover:bg-stone-50 text-sm">
                <Settings size={15} /> <span>Settings</span>
              </Link>
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-stone-700 hover:bg-stone-50 text-sm">
                <LogOut size={15} /> <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;