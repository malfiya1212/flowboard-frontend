import React, { useState } from 'react';
import { 
  Search, Plus, Settings, MoreHorizontal, AlertCircle, CheckSquare, Bookmark, X, User, Trash2
} from 'lucide-react';

export default function KanbanDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Kanban Columns with WIP Limits (Fully customizable via Board Settings)
  const [columns, setColumns] = useState([
    { id: 'backlog', title: 'Backlog', wip: 0 },
    { id: 'todo', title: 'To Do', wip: 5 },
    { id: 'in-progress', title: 'In Progress', wip: 3 },
    { id: 'testing', title: 'Testing', wip: 2 },
    { id: 'done', title: 'Done', wip: 0 }
  ]);

  // Real Kanban Issues State
  const [issues, setIssues] = useState([
    {
      id: 'FB-101',
      type: 'Task',
      summary: 'Implement landing page UI wireframes',
      description: 'Build responsive landing page layout with Tailwind CSS.',
      assignee: 'Malefiya',
      priority: 'High',
      status: 'todo',
      dueDate: '2026-10-20',
      labels: ['frontend', 'UI']
    },
    {
      id: 'FB-102',
      type: 'Bug',
      summary: 'Fix database connection timeout error',
      description: 'Mongoose connection drops during heavy traffic spikes.',
      assignee: 'Admin',
      priority: 'Highest',
      status: 'in-progress',
      dueDate: '2026-10-18',
      labels: ['backend', 'database']
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'Task',
    summary: '',
    description: '',
    assignee: 'Malefiya',
    priority: 'Medium',
    status: 'todo',
    dueDate: '2026-10-20',
    labels: 'frontend'
  });

  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!formData.summary.trim()) return;

    // Check WIP Limits before adding
    const targetCol = columns.find(c => c.id === formData.status);
    const currentCount = issues.filter(i => i.status === formData.status).length;
    
    if (targetCol && targetCol.wip > 0 && currentCount >= targetCol.wip) {
      alert(`⚠ WIP Limit Reached! Column "${targetCol.title}" already contains ${currentCount} issues (Limit: ${targetCol.wip}).`);
      return;
    }

    const newIssue = {
      ...formData,
      id: `FB-${120 + issues.length + 1}`,
      labels: formData.labels.split(',').map(l => l.trim())
    };

    setIssues([newIssue, ...issues]);
    setIsModalOpen(false);
    setFormData({
      type: 'Task',
      summary: '',
      description: '',
      assignee: 'Malefiya',
      priority: 'Medium',
      status: 'todo',
      dueDate: '2026-10-20',
      labels: 'frontend'
    });
  };

  const moveIssue = (issueId, newStatus) => {
    const targetCol = columns.find(c => c.id === newStatus);
    const currentCount = issues.filter(i => i.status === newStatus).length;

    if (targetCol && targetCol.wip > 0 && currentCount >= targetCol.wip) {
      alert(`⚠ WIP Limit Reached! "${targetCol.title}" is capped at ${targetCol.wip} items.`);
      return;
    }

    setIssues(issues.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
  };

  const deleteIssue = (issueId) => {
    setIssues(issues.filter(i => i.id !== issueId));
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Bug': return <AlertCircle size={14} className="text-red-500" />;
      case 'Task': return <CheckSquare size={14} className="text-blue-500" />;
      default: return <Bookmark size={14} className="text-emerald-600" />;
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
      <div className="p-8 max-w-[1400px] mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-stone-500 font-medium mb-1">
              Workspace / FlowBoard / Kanban Board
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Kanban Flow Board
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="h-9 px-3 bg-white border border-stone-200 text-stone-700 rounded-lg text-sm font-semibold hover:bg-stone-50 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Settings size={16} />
              Board Settings & WIP
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              Create Issue
            </button>
          </div>
        </div>

        {/* --- SEARCH & QUICK FILTERS --- */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text"
              placeholder="Search Kanban issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-3 w-72 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
            />
          </div>
        </div>

        {/* --- KANBAN COLUMNS (CONTINUOUS FLOW) --- */}
        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[600px]">
          {columns.map(col => {
            const colIssues = issues.filter(i => 
              i.status === col.id && 
              i.summary.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const isWipExceeded = col.wip > 0 && colIssues.length >= col.wip;

            return (
              <div 
                key={col.id} 
                className={`flex-1 min-w-[260px] max-w-[300px] bg-stone-100/90 border rounded-xl flex flex-col ${isWipExceeded ? 'border-red-300 bg-red-50/30' : 'border-stone-200/80'}`}
              >
                {/* Column Header */}
                <div className="p-3.5 flex items-center justify-between border-b border-stone-200/60 bg-white/50 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      {col.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isWipExceeded ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-700'}`}>
                      {colIssues.length} {col.wip > 0 && `/ ${col.wip}`}
                    </span>
                  </div>
                  <MoreHorizontal size={16} className="text-stone-400 cursor-pointer" />
                </div>

                {/* Column Body / Cards Container */}
                <div className="flex-1 p-2.5 flex flex-col gap-3 overflow-y-auto">
                  {colIssues.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-stone-200 rounded-lg my-2">
                      <p className="text-xs text-stone-400">No tasks</p>
                    </div>
                  ) : (
                    colIssues.map(issue => (
                      <div 
                        key={issue.id} 
                        className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs hover:border-indigo-400 transition-all group flex flex-col gap-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
                            {getTypeIcon(issue.type)} {issue.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${issue.priority === 'Highest' || issue.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-stone-100 text-stone-600'}`}>
                              {issue.priority}
                            </span>
                            <button 
                              onClick={() => deleteIssue(issue.id)}
                              className="text-stone-300 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Issue"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-stone-900 leading-snug">
                          {issue.summary}
                        </p>

                        {/* Labels */}
                        {issue.labels && issue.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {issue.labels.map((l, idx) => (
                              <span key={idx} className="text-[10px] font-medium px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                                #{l}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Footer: Assignee & Quick Move Controls */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 mt-1">
                          <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                            <User size={12} className="text-stone-400" /> {issue.assignee || 'Unassigned'}
                          </span>

                          <select 
                            value={issue.status}
                            onChange={(e) => moveIssue(issue.id, e.target.value)}
                            className="text-[10px] bg-stone-100 hover:bg-stone-200 font-semibold text-stone-700 px-2 py-1 rounded border border-stone-200 focus:outline-none cursor-pointer transition-colors"
                          >
                            {columns.map(c => (
                              <option key={c.id} value={c.id}>Move: {c.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* --- BOARD SETTINGS & WIP LIMITS MODAL --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h2 className="text-base font-bold text-stone-900">Board Settings & WIP Limits</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-stone-500">
                Customize column titles and define Work-In-Progress (WIP) constraints to prevent team bottlenecks. Set WIP to 0 for unlimited capacity.
              </p>

              <div className="space-y-3 pt-2">
                {columns.map((col, index) => (
                  <div key={col.id} className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="text-xs font-bold text-stone-400 w-6">#{index + 1}</span>
                    <input 
                      type="text" 
                      value={col.title}
                      onChange={(e) => {
                        const updated = [...columns];
                        updated[index].title = e.target.value;
                        setColumns(updated);
                      }}
                      className="flex-1 h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:border-indigo-600"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-stone-600 uppercase">WIP Limit:</span>
                      <input 
                        type="number"
                        min="0"
                        value={col.wip}
                        onChange={(e) => {
                          const updated = [...columns];
                          updated[index].wip = parseInt(e.target.value) || 0;
                          setColumns(updated);
                        }}
                        className="w-16 h-9 px-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-center text-stone-800 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-stone-50 border-t border-stone-200">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE ISSUE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h2 className="text-base font-bold text-stone-900">Create Kanban Issue</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateIssue} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Issue Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Task">Task</option>
                    <option value="Bug">Bug</option>
                    <option value="Story">Story</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Initial Column Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    {columns.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Summary *</label>
                <input 
                  type="text" 
                  required
                  placeholder="What needs to be done?"
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Assignee</label>
                  <select 
                    value={formData.assignee}
                    onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                    className="w-full h-8 px-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="Malefiya">Malefiya</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full h-8 px-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="Highest">Highest</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Labels (comma)</label>
                  <input 
                    type="text"
                    value={formData.labels}
                    onChange={(e) => setFormData({...formData, labels: e.target.value})}
                    className="w-full h-8 px-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Create Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}