import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800'; // Todo
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle()}`}>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const getPriorityStyle = () => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800'; // Low
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle()}`}>
      {priority}
    </span>
  );
};