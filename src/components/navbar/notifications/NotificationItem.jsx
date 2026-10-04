import React from 'react';

export default function NotificationItem({ notification, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(notification.link)}
      className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 text-xs transition-colors cursor-pointer ${
        notification.isRead
          ? 'bg-white hover:bg-stone-50'
          : 'bg-indigo-50/70 hover:bg-indigo-100/50'
      }`}
    >
      <span className="text-base shrink-0">{notification.icon}</span>

      <div className="flex-1 min-w-0">
        <div className="font-bold text-stone-900 truncate">
          {notification.title}
        </div>
        <div className="text-[11px] text-stone-600 mt-0.5 line-clamp-1">
          {notification.subtitle}
        </div>
        <div className="text-[10px] text-stone-400 mt-1">
          {notification.time}
        </div>
      </div>

      {!notification.isRead && (
        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
      )}
    </button>
  );
}