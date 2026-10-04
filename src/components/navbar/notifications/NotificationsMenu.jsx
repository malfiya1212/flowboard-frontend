import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Coffee, Check } from 'lucide-react';
import NotificationItem from './NotificationItem';
import Tooltip from '../../common/Tooltip';

const initialNotifications = [
  {
    id: 'n1',
    icon: '🔔',
    title: 'You were assigned FLW-24',
    subtitle: 'OAuth Google login integration',
    time: '10m ago',
    isRead: false,
    link: '/dashboard',
  },
  {
    id: 'n2',
    icon: '💬',
    title: 'Sara commented on FLW-12',
    subtitle: '"The login validation needs fixing."',
    time: '35m ago',
    isRead: false,
    link: '/dashboard',
  },
];

export default function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  // Close dropdown on outside click
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
      <Tooltip content={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Open notifications"
          aria-expanded={isOpen}
          className="relative p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-indigo-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Notifications</h3>
              <p className="text-[10px] text-stone-400 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="text-[11px] text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Body: Loading, List, or Empty State */}
          <div className="space-y-1.5 max-h-80 overflow-y-auto mt-2">
            {isLoading ? (
              /* Loading State */
              <div className="py-6 space-y-3 px-2">
                <div className="h-4 bg-stone-100 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-stone-100 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-stone-100 rounded animate-pulse w-4/5"></div>
              </div>
            ) : notifications.length > 0 ? (
              /* Populated List */
              notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  notification={item}
                  onClick={handleNotificationClick}
                />
              ))
            ) : (
              /* Empty State */
              <div className="py-10 text-center px-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 mb-3">
                  <Coffee size={22} className="text-stone-500" />
                </div>
                <h4 className="text-xs font-bold text-stone-900 mb-1">
                  You're all caught up! ☕
                </h4>
                <p className="text-[11px] text-stone-400 max-w-[200px]">
                  No new notifications right now. Check back later for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}