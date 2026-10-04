import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

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

export default function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handleNotificationClick = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  // Close when clicking outside
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {unreadCount} unread
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline font-semibold cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto mt-2">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  notification={item}
                  onClick={handleNotificationClick}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <Bell size={22} className="mx-auto text-stone-300 mb-2" />
                <p className="text-xs font-medium text-stone-600">No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}