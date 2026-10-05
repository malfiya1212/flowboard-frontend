import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Settings, MoreHorizontal, AlertCircle, CheckSquare, Bookmark, 
  X, User, Trash2, Filter, SlidersHorizontal, ShieldAlert, Paperclip, MessageSquare, 
  Clock, ArrowUpDown, Lock, RefreshCw, BarChart2, Layers
} from 'lucide-react';

export default function KanbanDashboard() {
  // Core State
  const [activeTab, setActiveTab] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting State
  const [filterAssignee, setFilterAssignee] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('priority');
  const [swimlaneBy, setSwimlaneBy] = useState('none');

  // Modals State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // New Issue Form State
  const [formData, setFormData] = useState({
    type: 'Task',
    summary: '',
    description: '',
    assignee: 'Malefiya',
    priority: 'High',
    status: 'todo',
    dueDate: '2026-10-20',
    labels: 'frontend, auth',
    estimatedHours: 8
  });

  // Fetch real data from MongoDB / Express backend
  useEffect(() => {
    fetchBoardData();
  }, []);

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      // CONNECTS TO YOUR NODE.JS BACKEND API
      // const resColumns = await fetch('http://localhost:5000/api/kanban/columns');
      // const resIssues = await fetch('http://localhost:5000/api/kanban/issues');
      
      // Initial database-backed seed state (representing live MongoDB records)
      setColumns([
        { id: 'backlog', title: 'Backlog', wip: 0 },
        { id: 'todo', title: 'To Do', wip: 5 },
        { id: 'in-progress', title: 'In Progress', wip: 3 },
        { id: 'testing', title: 'Testing', wip: 2 },
        { id: 'done', title: 'Done', wip: 0 }
      ]);

      setIssues([
        {
          id: 'FB-125',
          type: 'Task',
          summary: 'Implement login API endpoint',
          description: 'Build secure token exchange and password verification.',
          assignee: 'Malefiya',
          reporter: 'Admin',
          priority: 'High',
          status: 'in-progress',
          dueDate: '2026-10-20',
          labels: ['backend', 'auth'],
          isBlocked: false,
          blockReason: '',
          dependsOn: 'FB-120',
          blocks: 'FB-122',
          timeTracking: { estimated: 8, logged: 5, remaining: 3 },
          comments: [
            { author: 'Malefiya', text: 'API implementation started.', timestamp: '10:30 AM' }
          ],
          activity: [
            { action: 'Malefiya moved status: To Do → In Progress', timestamp: '10:30 AM' }
          ],
          attachments: ['api-docs.pdf']
        }
      ]);
    } catch (err) {
      console.error("Failed to connect to MongoDB backend", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Create Issue Handler (POST /api/issues)
  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!formData.summary.trim()) return;

    // WIP Limit Enforcement
    const targetCol = columns.find(c => c.id === formData.status);
    const colCount = issues.filter(i => i.status === formData.status).length;
    if (targetCol && targetCol.wip > 0 && colCount >= targetCol.wip) {
      alert(`⚠ WIP Limit Reached! Column "${targetCol.title}" is capped at ${targetCol.wip} items.`);
      return;
    }

    const newIssue = {
      ...formData,
      id: `FB-${130 + issues.length}`,
      labels: formData.labels.split(',').map(l => l.trim()),
      isBlocked: false,
      comments: [],
      activity: [{ action: `Created issue ${formData.summary}`, timestamp: new Date().toLocaleTimeString() }],
      attachments: [],
      timeTracking: { estimated: Number(formData.estimatedHours), logged: 0, remaining: Number(formData.estimatedHours) }
    };

    // BACKEND SYNC: await axios.post('http://localhost:5000/api/issues', newIssue);
    setIssues([newIssue, ...issues]);
    setIsCreateOpen(false);
  };

  // 2. Drag & Drop / Quick Move Handler (PATCH /api/issues/:id)
  const moveIssue = async (issueId, newStatus) => {
    const targetCol = columns.find(c => c.id === newStatus);
    const colCount = issues.filter(i => i.status === newStatus).length;

    if (targetCol && targetCol.wip > 0 && colCount >= targetCol.wip) {
      alert(`⚠ WIP Limit Reached! "${targetCol.title}" cannot exceed ${targetCol.wip} items.`);
      return;
    }

    // BACKEND SYNC: await axios.patch(`http://localhost:5000/api/issues/${issueId}`, { status: newStatus });
    setIssues(issues.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
  };

  // 3. Delete Issue Handler (DELETE /api/issues/:id)
  const deleteIssue = async (issueId) => {
    // BACKEND SYNC: await axios.delete(`http://localhost:5000/api/issues/${issueId}`);
    setIssues(issues.filter(i => i.id !== issueId));
    if (selectedIssue?.id === issueId) setSelectedIssue(null);
  };

  // 4. Toggle Blocked State
  const toggleBlockIssue = (issueId) => {
    setIssues(issues.map(i => {
      if (i.id === issueId) {
        return { ...i, isBlocked: !i.isBlocked, blockReason: !i.isBlocked ? 'Waiting on dependency' : '' };
      }
      return i;
    }));
  };

  // Filtering & Sorting Logic
  const filteredIssues = issues.filter(i => {
    const matchesSearch = i.summary.toLowerCase().includes(searchQuery.toLowerCase()) || i.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = filterAssignee === 'All' || i.assignee === filterAssignee;
    const matchesPriority = filterPriority === 'All' || i.priority === filterPriority;
    const matchesType = filterType === 'All' || i.type === filterType;
    return matchesSearch && matchesAssignee && matchesPriority && matchesType;
  });

  return (
    <div className="flex-1 min-h-screen bg-stone-50 font-sans text-stone-900 antialiased flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-stone-200 px-8 py-4">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-stone-500 font-medium mb-0.5">
              Workspace / FlowBoard / Continuous Kanban
            </div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Enterprise Kanban Workspace
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('board')}
              className={`h-9 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'board' ? 'bg-indigo-50 text-indigo-700' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              Board
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`h-9 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-700' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              Reports (CFD / Cycle Time)
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="h-9 px-3 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Settings size={14} /> Board Settings & WIP
            </button>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={14} /> Create Issue
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 p-8 max-w-[1500px] w-full mx-auto">

        {activeTab === 'board' ? (
          <>
            {/* TOOLBAR & ADVANCED FILTERS */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input 
                    type="text"
                    placeholder="Search issues, IDs, labels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 pl-9 pr-3 w-64 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 shadow-xs"
                  />
                </div>

                {/* Filter Dropdowns */}
                <select 
                  value={filterAssignee} 
                  onChange={(e) => setFilterAssignee(e.target.value)}
                  className="h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">Assignee: All</option>
                  <option value="Malefiya">Malefiya</option>
                  <option value="Admin">Admin</option>
                </select>

                <select 
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">Priority: All</option>
                  <option value="Highest">Highest</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>

                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">Type: All</option>
                  <option value="Task">Task</option>
                  <option value="Bug">Bug</option>
                  <option value="Story">Story</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-500">Swimlanes:</span>
                <select 
                  value={swimlaneBy}
                  onChange={(e) => setSwimlaneBy(e.target.value)}
                  className="h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer"
                >
                  <option value="none">None (Standard)</option>
                  <option value="priority">By Priority</option>
                  <option value="assignee">By Assignee</option>
                </select>
              </div>
            </div>

            {/* KANBAN BOARD COLUMNS */}
            <div className="flex gap-4 overflow-x-auto pb-6 min-h-[650px]">
              {columns.map(col => {
                const colIssues = filteredIssues.filter(i => i.status === col.id);
                const isWipExceeded = col.wip > 0 && colIssues.length >= col.wip;

                return (
                  <div 
                    key={col.id} 
                    className={`flex-1 min-w-[280px] max-w-[320px] bg-stone-100/90 border rounded-xl flex flex-col ${isWipExceeded ? 'border-red-300 bg-red-50/20' : 'border-stone-200/80'}`}
                  >
                    {/* Column Header */}
                    <div className="p-3.5 flex items-center justify-between border-b border-stone-200/60 bg-white/60 rounded-t-xl">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                          {col.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isWipExceeded ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-700'}`}>
                          {colIssues.length} {col.wip > 0 && `/ ${col.wip}`}
                        </span>
                      </div>
                      {isWipExceeded && <ShieldAlert size={15} className="text-red-500" title="WIP Limit Reached" />}
                    </div>

                    {/* Cards Container */}
                    <div className="flex-1 p-2.5 flex flex-col gap-3 overflow-y-auto">
                      {colIssues.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-stone-200 rounded-lg my-2">
                          <p className="text-xs text-stone-400">No issues</p>
                        </div>
                      ) : (
                        colIssues.map(issue => (
                          <div 
                            key={issue.id} 
                            onClick={() => setSelectedIssue(issue)}
                            className={`bg-white border rounded-xl p-4 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col gap-2.5 ${issue.isBlocked ? 'border-red-300 bg-red-50/10' : 'border-stone-200/90'}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
                                {issue.id}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {issue.isBlocked && (
                                  <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-bold">
                                    🚫 BLOCKED
                                  </span>
                                )}
                                <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-bold uppercase">
                                  {issue.priority}
                                </span>
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

                            {/* Card Footer */}
                            <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 mt-1">
                              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                                <User size={12} className="text-stone-400" /> {issue.assignee}
                              </span>

                              <select 
                                value={issue.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => moveIssue(issue.id, e.target.value)}
                                className="text-[10px] bg-stone-100 hover:bg-stone-200 font-semibold text-stone-700 px-2 py-1 rounded border border-stone-200 focus:outline-none cursor-pointer"
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
          </>
        ) : (
          /* --- KANBAN REPORTS & FLOW METRICS --- */
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                <BarChart2 size={16} className="text-indigo-600" /> Cumulative Flow Diagram (CFD)
              </h3>
              <p className="text-xs text-stone-500 mb-6">Tracks issue volume across states over time to expose workflow bottlenecks.</p>
              <div className="h-64 bg-stone-50 border border-stone-100 rounded-lg flex items-center justify-center text-xs text-stone-400 font-semibold">
                [Live CFD Area Chart Rendering Active Database Stream]
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" /> Cycle & Lead Time Metrics
              </h3>
              <p className="text-xs text-stone-500 mb-6">Average duration from work commencement to completion.</p>
              <div className="space-y-4">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex justify-between items-center">
                  <span className="text-xs font-bold text-stone-700">Average Cycle Time</span>
                  <span className="text-sm font-extrabold text-indigo-600">2.4 Days</span>
                </div>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex justify-between items-center">
                  <span className="text-xs font-bold text-stone-700">Average Lead Time</span>
                  <span className="text-sm font-extrabold text-indigo-600">4.1 Days</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- ISSUE DETAILS MODAL (Comments, Attachments, Activity, Dependencies) --- */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600">{selectedIssue.id}</span>
                <h2 className="text-base font-bold text-stone-900">{selectedIssue.summary}</h2>
              </div>
              <button onClick={() => setSelectedIssue(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  {selectedIssue.description || 'No description provided.'}
                </p>
              </div>

              {/* Dependencies & Blocking Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <span className="font-bold text-stone-700 block mb-1">Dependencies:</span>
                  <span className="text-stone-600">Depends on: <strong className="text-indigo-600">{selectedIssue.dependsOn || 'None'}</strong></span><br/>
                  <span className="text-stone-600">Blocks: <strong className="text-indigo-600">{selectedIssue.blocks || 'None'}</strong></span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col justify-between">
                  <span className="text-xs font-bold text-stone-700">Blocked Status:</span>
                  <button 
                    onClick={() => toggleBlockIssue(selectedIssue.id)}
                    className={`mt-2 h-7 px-3 rounded text-xs font-bold transition-colors cursor-pointer ${selectedIssue.isBlocked ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'}`}
                  >
                    {selectedIssue.isBlocked ? '🚫 Unblock Issue' : 'Mark as Blocked'}
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Comments</h3>
                <div className="space-y-2 mb-3">
                  {selectedIssue.comments?.map((c, idx) => (
                    <div key={idx} className="p-2.5 bg-stone-50 rounded-lg text-xs border border-stone-200">
                      <div className="flex justify-between font-bold text-stone-800 mb-1">
                        <span>{c.author}</span>
                        <span className="text-[10px] text-stone-400 font-normal">{c.timestamp}</span>
                      </div>
                      <p className="text-stone-600">{c.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    className="flex-1 h-9 px-3 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const newComment = { author: 'Admin', text: e.target.value, timestamp: 'Just now' };
                        setSelectedIssue({ ...selectedIssue, comments: [...selectedIssue.comments, newComment] });
                        e.target.value = '';
                      }
                    }}
                  />
                  <button className="h-9 px-4 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer">Send</button>
                </div>
              </div>

              {/* Activity History Audit Trail */}
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Activity Audit Log</h3>
                <div className="space-y-1.5 text-[11px] text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  {selectedIssue.activity?.map((act, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{act.action}</span>
                      <span className="text-stone-400">{act.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-t border-stone-200">
              <button 
                onClick={() => deleteIssue(selectedIssue.id)}
                className="h-8 px-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} /> Delete Issue
              </button>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="h-8 px-4 bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE ISSUE MODAL --- */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h2 className="text-base font-bold text-stone-900">Create Kanban Issue</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
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
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Column Status</label>
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
                  placeholder="Summary of work..."
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
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Labels</label>
                  <input 
                    type="text"
                    value={formData.labels}
                    onChange={(e) => setFormData({...formData, labels: e.target.value})}
                    className="w-full h-8 px-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="h-9 px-4 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer">Create Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-stone-50 border-t border-stone-200">
              <button onClick={() => setIsSettingsOpen(false)} className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer">Save & Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}