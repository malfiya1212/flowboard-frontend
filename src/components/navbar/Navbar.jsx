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

// =====================================================
// SAMPLE SEARCH DATA
// =====================================================

const searchableIssues = [
  {
    key: 'FLW-25',
    title: 'Login authentication failure on Safari',
    type: 'Bug',
    status: 'OPEN',
  },
  {
    key: 'FLW-10',
    title: 'Login page layout and form validation',
    type: 'Story',
    status: 'TO DO',
  },
  {
    key: 'FLW-11',
    title: 'User registration with email verification',
    type: 'Story',
    status: 'TO DO',
  },
  {
    key: 'FLW-4',
    title: 'Agile dashboard with project metrics and workload',
    type: 'Task',
    status: 'IN REVIEW',
  },
  {
    key: 'FLW-7',
    title: 'Backend REST API authentication endpoints',
    type: 'Task',
    status: 'IN PROGRESS',
  },
  {
    key: 'FLW-24',
    title: 'OAuth Google login integration',
    type: 'Story',
    status: 'BACKLOG',
  },
  {
    key: 'FLW-12',
    title: 'Forgot password reset email workflow',
    type: 'Bug',
    status: 'IN PROGRESS',
  },
];

// =====================================================
// SAMPLE NOTIFICATIONS
// =====================================================

const initialNotifications = [
  {
    id: 'n1',
    icon: '🔔',
    title: 'You were assigned FLW-24',
    subtitle: 'Malefiya assigned you OAuth Google login integration',
    time: '10m ago',
    isRead: false,
    link: '/scrum',
  },
  {
    id: 'n2',
    icon: '💬',
    title: 'Sara commented on FLW-12',
    subtitle: '"The login validation needs fixing."',
    time: '35m ago',
    isRead: false,
    link: '/scrum',
  },
  {
    id: 'n3',
    icon: '🚀',
    title: 'Sprint 1 starts tomorrow',
    subtitle: 'Goal: Build authentication system',
    time: '1h ago',
    isRead: false,
    link: '/scrum',
  },
  {
    id: 'n4',
    icon: '⚠️',
    title: 'Due date approaching for FLW-10',
    subtitle: 'Login page is due in 2 days',
    time: '3h ago',
    isRead: true,
    link: '/scrum',
  },
];

// =====================================================
// NAVBAR
// =====================================================

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  // Dropdown states
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // References
  const searchContainerRef = useRef(null);
  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);

  // ===================================================
  // SEARCH RESULTS
  // ===================================================

  const searchResults = searchQuery.trim()
    ? searchableIssues.filter((issue) => {
        const query = searchQuery.toLowerCase();

        return (
          issue.key.toLowerCase().includes(query) ||
          issue.title.toLowerCase().includes(query) ||
          issue.type.toLowerCase().includes(query) ||
          issue.status.toLowerCase().includes(query)
        );
      })
    : [];

  // ===================================================
  // UNREAD NOTIFICATIONS
  // ===================================================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ===================================================
  // MARK ALL NOTIFICATIONS AS READ
  // ===================================================

  const markAllNotificationsRead = () => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  // ===================================================
  // SEARCH RESULT CLICK
  // ===================================================

  const handleSelectSearchResult = (issue) => {
    setSearchQuery('');
    setIsSearchOpen(false);

    navigate(`/issues?search=${encodeURIComponent(issue.key)}`);
  };

  // ===================================================
  // KEYBOARD SHORTCUT
  // CTRL + K / CMD + K
  // ===================================================

  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();

        const searchInput =
          searchContainerRef.current?.querySelector('input');

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

    document.addEventListener(
      'keydown',
      handleKeyboardShortcut
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyboardShortcut
      );
    };
  }, []);

  // ===================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ===================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Search
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }

      // Notifications
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      // User dropdown
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // ===================================================
  // TOGGLE NOTIFICATIONS
  // ===================================================

  const handleNotificationToggle = () => {
    setShowNotifications((previous) => !previous);
    setShowUserDropdown(false);
  };

  // ===================================================
  // TOGGLE USER MENU
  // ===================================================

  const handleUserDropdownToggle = () => {
    setShowUserDropdown((previous) => !previous);
    setShowNotifications(false);
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    setShowUserDropdown(false);

    // Later:
    // localStorage.removeItem('token');

    navigate('/login');
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 shadow-sm">

      {/* =================================================
          LEFT SECTION
      ================================================= */}

      <div className="flex items-center gap-4 min-w-0">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-md text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
          aria-label={
            isSidebarOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>

        {/* FlowBoard Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 no-underline shrink-0"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white rounded-lg flex items-center justify-center shadow-sm">
            <Kanban size={18} strokeWidth={2.2} />
          </div>

          <span className="font-bold text-lg text-[#0F172A] tracking-tight hidden sm:block">
            Flow<span className="text-[#4F46E5]">Board</span>
          </span>
        </Link>
      </div>

      {/* =================================================
          GLOBAL SEARCH
      ================================================= */}

      <div
        ref={searchContainerRef}
        className="hidden md:flex flex-1 max-w-xl mx-6 relative"
      >
        <div className="relative w-full flex items-center">

          <Search
            size={16}
            className="absolute left-3 text-[#94A3B8] pointer-events-none"
          />

          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Search issues..."
            aria-label="Search issues"
            className="w-full pl-9 pr-16 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] transition-all"
          />

          {/* Keyboard Shortcut */}
          <span className="absolute right-2.5 text-[10px] font-medium text-[#94A3B8] bg-white border border-[#E2E8F0] rounded px-1.5 py-0.5 pointer-events-none">
            Ctrl K
          </span>
        </div>

        {/* Search Results */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-2 z-50">

            <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-3 py-2">
              Matching Issues
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-1">

                {searchResults.map((issue) => (
                  <button
                    type="button"
                    key={issue.key}
                    onClick={() =>
                      handleSelectSearchResult(issue)
                    }
                    className="w-full text-left p-2.5 hover:bg-[#F8FAFC] rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">

                      <span className="font-mono font-bold text-[#4F46E5] bg-[#EEF2FF] px-1.5 py-0.5 rounded text-[11px] shrink-0">
                        {issue.key}
                      </span>

                      <span className="font-semibold text-[#334155] truncate">
                        {issue.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">

                      <span className="text-[10px] text-[#94A3B8]">
                        {issue.type}
                      </span>

                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">
                        {issue.status}
                      </span>
                    </div>
                  </button>
                ))}

              </div>
            ) : (
              <div className="p-5 text-center text-[#94A3B8]">
                <Search
                  size={20}
                  className="mx-auto mb-2 opacity-50"
                />

                <p className="text-xs">
                  No issues found matching
                </p>

                <p className="text-xs font-semibold text-[#475569] mt-1">
                  "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =================================================
          RIGHT SECTION
      ================================================= */}

      <div className="flex items-center gap-1.5">

        {/* Create Issue */}
        <button
          type="button"
          onClick={() =>
            navigate('/issues?create=true')
          }
          title="Create new issue"
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white px-3.5 py-1.5 rounded-lg font-semibold text-sm transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <Plus size={16} strokeWidth={2.5} />

          <span className="hidden sm:inline">
            Create
          </span>
        </button>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            onClick={handleNotificationToggle}
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            className="relative p-2 rounded-full text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-[#EF4444] text-white rounded-full text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-3 z-50">

              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">

                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">
                    Notifications
                  </h3>

                  {unreadCount > 0 && (
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      {unreadCount} unread
                    </p>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#4F46E5] hover:text-[#4338CA] hover:underline cursor-pointer font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications */}
              <div className="space-y-1.5 max-h-80 overflow-y-auto mt-2">

                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(notification.link);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 cursor-pointer transition-colors text-xs ${
                        notification.isRead
                          ? 'bg-white hover:bg-[#F8FAFC]'
                          : 'bg-[#EEF2FF] hover:bg-[#E0E7FF]'
                      }`}
                    >
                      <span className="text-base shrink-0">
                        {notification.icon}
                      </span>

                      <div className="flex-1 min-w-0">

                        <div className="font-bold text-[#0F172A]">
                          {notification.title}
                        </div>

                        <div className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">
                          {notification.subtitle}
                        </div>

                        <div className="text-[10px] text-[#94A3B8] mt-1">
                          {notification.time}
                        </div>
                      </div>

                      {!notification.isRead && (
                        <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full mt-1.5 shrink-0" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Bell
                      size={22}
                      className="mx-auto text-[#CBD5E1] mb-2"
                    />

                    <p className="text-xs font-medium text-[#64748B]">
                      No notifications
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            USER MENU
        ================================================= */}

        <div
          ref={userDropdownRef}
          className="relative"
        >
          <button
            type="button"
            onClick={handleUserDropdownToggle}
            aria-label="Open user menu"
            aria-expanded={showUserDropdown}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
              M
            </div>

            <ChevronDown
              size={14}
              className={`text-[#64748B] transition-transform ${
                showUserDropdown
                  ? 'rotate-180'
                  : ''
              }`}
            />
          </button>

          {/* User Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 z-50">

              {/* User Information */}
              <div className="px-4 py-3 border-b border-[#F1F5F9]">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    M
                  </div>

                  <div className="min-w-0">

                    <div className="font-bold text-sm text-[#0F172A]">
                      Malefiya
                    </div>

                    <div className="text-[11px] text-[#64748B] truncate">
                      malefiya@flowboard.com
                    </div>
                  </div>
                </div>

                <span className="inline-block mt-2 font-bold text-[10px] text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </div>

              {/* Profile */}
              <Link
                to="/profile"
                onClick={() =>
                  setShowUserDropdown(false)
                }
                className="flex items-center gap-2.5 px-4 py-2.5 text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
              >
                <User size={15} />
                <span>Profile & Stats</span>
              </Link>

              {/* Admin Dashboard */}
              <Link
                to="/admin"
                onClick={() =>
                  setShowUserDropdown(false)
                }
                className="flex items-center gap-2.5 px-4 py-2.5 text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
              >
                <Shield
                  size={15}
                  className="text-[#EF4444]"
                />

                <span>Admin Dashboard</span>
              </Link>

              {/* Project Settings */}
              <Link
                to="/projects/settings"
                onClick={() =>
                  setShowUserDropdown(false)
                }
                className="flex items-center gap-2.5 px-4 py-2.5 text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
              >
                <Settings size={15} />
                <span>Project Settings</span>
              </Link>

              {/* Divider */}
              <div className="my-1 border-t border-[#F1F5F9]" />

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[#EF4444] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;