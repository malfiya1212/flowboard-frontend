import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Plus, Kanban } from 'lucide-react';
import NotificationsMenu from './notifications/NotificationsMenu';
import UserMenu from './UserMenu';
import Breadcrumbs from '../common/Breadcrumbs';
import Tooltip from '../common/Tooltip';

const searchableIssues = [
  { key: 'FLW-25', title: 'Login authentication failure on Safari', type: 'Bug', status: 'OPEN' },
  { key: 'FLW-10', title: 'Login page layout and form validation', type: 'Story', status: 'TO DO' },
  { key: 'FLW-11', title: 'User registration with email verification', type: 'Story', status: 'TO DO' },
  { key: 'FLW-4', title: 'Agile dashboard with project metrics and workload', type: 'Task', status: 'IN REVIEW' },
  { key: 'FLW-7', title: 'Backend REST API authentication endpoints', type: 'Task', status: 'IN PROGRESS' },
  { key: 'FLW-24', title: 'OAuth Google login integration', type: 'Story', status: 'BACKLOG' },
  { key: 'FLW-12', title: 'Forgot password reset email workflow', type: 'Bug', status: 'IN PROGRESS' },
];

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Keyboard shortcut Ctrl + K
  useEffect(() => {
    const handleKeydown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const input = searchContainerRef.current?.querySelector('input');
        if (input) {
          input.focus();
          setIsSearchOpen(true);
        }
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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

  const handleSelectIssue = (issueKey) => {
    setSearchQuery('');
    setDebouncedQuery('');
    setIsSearchOpen(false);
    navigate(`/issues?search=${encodeURIComponent(issueKey)}`);
  };

  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-stone-200 flex items-center justify-between px-4 shadow-sm">
      {/* Left: Mobile Toggle, Site Logo, & Breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-md text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
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

        {/* Subtle Divider & Breadcrumbs */}
        <div className="hidden lg:block h-4 w-px bg-stone-200" />
        <Breadcrumbs />
      </div>

      {/* Center: Global Search Input with Debounce */}
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
          <Tooltip content="Quick search">
            <span className="absolute right-2.5 text-[10px] font-medium text-stone-400 bg-white border border-stone-200 rounded px-1.5 py-0.5 pointer-events-none">
              Ctrl K
            </span>
          </Tooltip>
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
                    key={issue.key}
                    type="button"
                    onClick={() => handleSelectIssue(issue.key)}
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
                <p className="text-xs font-semibold text-stone-700 mt-1">
                  "{debouncedQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions, Notifications, & User Dropdown */}
      <div className="flex items-center gap-2">
        <Tooltip content="Create new issue">
          <button
            type="button"
            onClick={() => navigate('/issues?create=true')}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Create</span>
          </button>
        </Tooltip>

        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}