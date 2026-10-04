import React from 'react';

export function StatusBadge({ status }) {
  const styles = {
    Todo: 'bg-stone-100 text-stone-700 border-stone-200',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
        styles[status] || styles['Todo']
      }`}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styles = {
    Low: 'bg-stone-100 text-stone-600 border-stone-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
        styles[priority] || styles['Medium']
      }`}
    >
      {priority}
    </span>
  );
}