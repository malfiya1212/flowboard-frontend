import React, { useState } from 'react';
import { Filter } from 'lucide-react';

export default function ScrumBoard() {
  const [columns] = useState({
    todo: [
      { id: 'FLW-10', title: 'Login page layout and form validation', priority: 'High', category: 'Frontend', points: 3 },
      { id: 'FLW-11', title: 'Registration flow with email verification', priority: 'High', category: 'Auth', points: 5 },
    ],
    inProgress: [
      { id: 'FLW-7', title: 'REST API authentication and RBAC guards', priority: 'Highest', category: 'API', points: 5 },
      { id: 'FLW-8', title: 'Database schema configuration and pooling', priority: 'Medium', category: 'Backend', points: 5 },
    ],
    inReview: [
      { id: 'FLW-4', title: 'Agile dashboard with project metrics', priority: 'Highest', category: 'Frontend', points: 5 },
    ],
    done: [
      { id: 'FLW-1', title: 'Repository Initialization & Tailwind setup', priority: 'Medium', category: 'Frontend', points: 2 },
    ]
  });

  return (
    <div className="flex-1 h-full flex flex-col bg-[#fafaf9] font-sans text-stone-900 overflow-hidden">
      
      {/* --- SLIM SPRINT METRICS STRIP (No duplicate header/navbar) --- */}
      <div className="px-6 py-3 bg-white border-b border-stone-200/60 flex items-center justify-between gap-4 shrink-0 text-xs">
        <div className="flex items-center gap-3 text-stone-500">
          <span className="font-bold text-stone-900">Sprint 1 Board</span>
          <span className="text-stone-300">•</span>
          <span>Goal: <strong className="text-stone-800">Core auth & dashboard polish</strong></span>
          <span className="text-stone-300">•</span>
          <span>Total Points: <strong className="text-emerald-700 font-bold">25 pts</strong></span>
        </div>
        <button className="px-3 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 flex items-center gap-1.5 transition-colors font-medium">
          <Filter size={13} /> Only My Issues
        </button>
      </div>

      {/* --- COMPACT BOARD COLUMNS --- */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex items-start gap-5 h-full min-w-[1050px]">
          
          {[
            { key: 'todo', title: 'To Do', color: 'bg-stone-400' },
            { key: 'inProgress', title: 'In Progress', color: 'bg-blue-500' },
            { key: 'inReview', title: 'In Review', color: 'bg-amber-500' },
            { key: 'done', title: 'Done', color: 'bg-emerald-500' },
          ].map(col => {
            const issues = columns[col.key];
            const totalPoints = issues.reduce((acc, curr) => acc + curr.points, 0);

            return (
              <div key={col.key} className="w-80 flex flex-col h-full bg-stone-100/70 rounded-2xl border border-stone-200/80 p-3.5">
                
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-stone-200/60 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">{col.title}</h3>
                    <span className="text-[10px] bg-stone-200/80 text-stone-700 font-bold px-1.5 py-0.5 rounded-full">{issues.length}</span>
                  </div>
                  <span className="text-xs font-semibold text-stone-500">{totalPoints} pts</span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {issues.map(issue => (
                    <div 
                      key={issue.id} 
                      className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-2xs hover:border-emerald-500/50 transition-all group cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-emerald-700">{issue.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          issue.priority === 'Highest' ? 'bg-red-50 text-red-700 border border-red-200/60' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {issue.priority}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {issue.title}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                        <span className="bg-stone-50 text-stone-600 px-2 py-0.5 rounded font-medium border border-stone-200/60">
                          {issue.category}
                        </span>
                        <span className="font-semibold text-stone-500">{issue.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}