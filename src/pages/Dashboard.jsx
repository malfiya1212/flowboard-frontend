import React, { useState } from 'react';
import { 
  Search, Plus, Layout, List, BarChart2, 
  Settings, MoreHorizontal, AlertCircle, CheckSquare, Bookmark, 
  X, User, Target, Zap, Trash2, Calendar, Play, CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStartSprintOpen, setIsStartSprintOpen] = useState(false);
  const [isCompleteSprintOpen, setIsCompleteSprintOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Sprint Lifecycle State
  const [activeSprint, setActiveSprint] = useState({
    name: 'Sprint 1',
    goal: 'Complete authentication system & core architecture',
    startDate: 'Oct 5',
    endDate: 'Oct 19',
    status: 'active' // planning, active, completed
  });

  // Scrum Columns for Active Sprint Board
  const scrumColumns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Code Review' },
    { id: 'done', title: 'Done' }
  ];

  // Core Scrum Issues Database State
  const [issues, setIssues] = useState([
    {
      id: 'FB-101',
      type: 'Story',
      summary: 'Implement core user authentication flow with JWT',
      description: 'Users must be able to log in and receive a secure token.',
      epic: 'Authentication',
      assignee: 'Malefiya',
      reporter: 'Admin',
      priority: 'High',
      storyPoints: 5,
      sprint: 'Sprint 1',
      status: 'in-progress',
      comments: [{ author: 'Admin', text: 'Ensure token expiration is set to 24h.', timestamp: '10:00 AM' }],
      activity: [{ action: 'Malefiya changed status To Do → In Progress', timestamp: '10:30 AM' }]
    },
    {
      id: 'FB-102',
      type: 'Bug',
      summary: 'Fix 500 error on database aggregation queries',
      description: 'MongoDB queries timeout under heavy load.',
      epic: 'Database',
      assignee: 'Admin',
      reporter: 'Malefiya',
      priority: 'Highest',
      storyPoints: 8,
      sprint: 'Sprint 1',
      status: 'todo',
      comments: [],
      activity: [{ action: 'Admin created issue', timestamp: 'Yesterday' }]
    },
    {
      id: 'FB-103',
      type: 'Task',
      summary: 'Design system button components',
      description: 'Build primary, secondary, and ghost buttons with Tailwind.',
      epic: 'UI Design',
      assignee: 'Malefiya',
      reporter: 'Admin',
      priority: 'Medium',
      storyPoints: 3,
      sprint: '', // Backlog item
      status: 'todo',
      comments: [],
      activity: []
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'Story',
    summary: '',
    description: '',
    epic: 'Authentication',
    assignee: 'Malefiya',
    priority: 'Medium',
    storyPoints: 5,
    sprint: '' // Empty means Backlog
  });

  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!formData.summary.trim()) return;

    const newIssue = {
      ...formData,
      id: `FB-${100 + issues.length + 1}`,
      status: 'todo',
      comments: [],
      activity: [{ action: `Created issue ${formData.summary}`, timestamp: 'Just now' }]
    };

    setIssues([newIssue, ...issues]);
    setIsCreateOpen(false);
    setFormData({
      type: 'Story',
      summary: '',
      description: '',
      epic: 'Authentication',
      assignee: 'Malefiya',
      priority: 'Medium',
      storyPoints: 5,
      sprint: ''
    });
  };

  const moveIssue = (issueId, newStatus) => {
    setIssues(issues.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
  };

  const deleteIssue = (issueId) => {
    setIssues(issues.filter(i => i.id !== issueId));
    if (selectedIssue?.id === issueId) setSelectedIssue(null);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Bug': return <AlertCircle size={14} className="text-red-500" />;
      case 'Task': return <CheckSquare size={14} className="text-blue-500" />;
      case 'Epic': return <Bookmark size={14} className="text-purple-600" />;
      default: return <Bookmark size={14} className="text-emerald-600" />;
    }
  };

  const backlogIssues = issues.filter(i => !i.sprint || i.sprint === '');
  const activeSprintIssues = issues.filter(i => i.sprint === activeSprint.name);

  // Sprint calculation metrics
  const completedPoints = activeSprintIssues.filter(i => i.status === 'done').reduce((acc, curr) => acc + (Number(curr.storyPoints) || 0), 0);
  const totalPoints = activeSprintIssues.reduce((acc, curr) => acc + (Number(curr.storyPoints) || 0), 0);
  const progressPercent = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  return (
    <div className="flex-1 min-h-screen bg-stone-50 font-sans text-stone-900 antialiased flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-stone-200 px-8 py-4">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-stone-500 font-medium mb-0.5">
              Workspace / FlowBoard / Scrum Methodology
            </div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-3">
              {activeSprint.name}: {activeSprint.goal}
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] rounded-full uppercase font-extrabold tracking-wider">
                {activeSprint.status}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {activeSprint.status === 'active' ? (
              <button 
                onClick={() => setIsCompleteSprintOpen(true)}
                className="h-9 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 size={14} /> Complete Sprint
              </button>
            ) : (
              <button 
                onClick={() => setIsStartSprintOpen(true)}
                className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play size={14} /> Start Sprint
              </button>
            )}

            <button 
              onClick={() => setIsCreateOpen(true)}
              className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={14} /> Create Issue
            </button>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION TABS --- */}
      <div className="bg-white border-b border-stone-200 px-8">
        <div className="max-w-[1500px] mx-auto flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('backlog')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${activeTab === 'backlog' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <List size={15} /> Backlog & Sprint Planning
          </button>
          <button 
            onClick={() => setActiveTab('board')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${activeTab === 'board' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <Layout size={15} /> Active Sprint Board
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${activeTab === 'reports' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <BarChart2 size={15} /> Sprint Reports & Velocity
          </button>
        </div>
      </div>

      {/* --- MAIN BODY --- */}
      <div className="flex-1 p-8 max-w-[1500px] w-full mx-auto">

        {/* 1. ACTIVE SPRINT BOARD */}
        {activeTab === 'board' && (
          <div className="flex gap-4 overflow-x-auto pb-6 min-h-[650px]">
            {scrumColumns.map(col => {
              const colIssues = activeSprintIssues.filter(i => i.status === col.id && i.summary.toLowerCase().includes(searchQuery.toLowerCase()));

              return (
                <div key={col.id} className="flex-1 min-w-[280px] max-w-[320px] bg-stone-100/90 border border-stone-200/80 rounded-xl flex flex-col">
                  <div className="p-3.5 flex items-center justify-between border-b border-stone-200/60 bg-white/60 rounded-t-xl">
                    <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
                      {col.title}
                      <span className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full text-[10px]">
                        {colIssues.length}
                      </span>
                    </h3>
                    <MoreHorizontal size={16} className="text-stone-400 cursor-pointer" />
                  </div>

                  <div className="flex-1 p-2.5 flex flex-col gap-3 overflow-y-auto">
                    {colIssues.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-stone-200 rounded-lg my-2">
                        <p className="text-xs text-stone-400">No sprint issues</p>
                      </div>
                    ) : (
                      colIssues.map(issue => (
                        <div 
                          key={issue.id} 
                          onClick={() => setSelectedIssue(issue)}
                          className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col gap-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
                              {getTypeIcon(issue.type)} {issue.id}
                            </span>
                            <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-bold uppercase">
                              {issue.priority}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-stone-900 leading-snug">
                            {issue.summary}
                          </p>

                          <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 mt-1">
                            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                              <User size={12} className="text-stone-400" /> {issue.assignee}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold rounded text-[10px]">
                                {issue.storyPoints} SP
                              </span>
                              <select 
                                value={issue.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => moveIssue(issue.id, e.target.value)}
                                className="text-[10px] bg-stone-100 font-semibold text-stone-700 px-2 py-1 rounded border border-stone-200 focus:outline-none cursor-pointer"
                              >
                                {scrumColumns.map(c => (
                                  <option key={c.id} value={c.id}>Move: {c.title}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. BACKLOG & SPRINT PLANNING */}
        {activeTab === 'backlog' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{activeSprint.name} Backlog & Target</h3>
                  <p className="text-xs text-stone-500">Drag or assign items into the active sprint for iteration execution.</p>
                </div>
                <button 
                  onClick={() => setIsStartSprintOpen(true)}
                  className="h-8 px-3 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Manage Sprint
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {activeSprintIssues.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400">No issues assigned to {activeSprint.name} yet.</div>
                ) : (
                  activeSprintIssues.map(issue => (
                    <div key={issue.id} onClick={() => setSelectedIssue(issue)} className="px-6 py-3.5 hover:bg-stone-50 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        {getTypeIcon(issue.type)}
                        <span className="font-mono text-xs font-bold text-stone-500 w-16">{issue.id}</span>
                        <span className="text-sm font-medium text-stone-900">{issue.summary}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span className="px-2 py-0.5 bg-stone-100 rounded font-medium">{issue.epic}</span>
                        <span className="w-24 font-medium text-stone-700">{issue.assignee}</span>
                        <span className="w-16 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-center font-extrabold">{issue.storyPoints} SP</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PRODUCT BACKLOG POOL */}
            <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900">Product Backlog (Unassigned Pool)</h3>
                <button 
                  onClick={() => setIsCreateOpen(true)}
                  className="h-8 px-3 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 cursor-pointer flex items-center gap-1"
                >
                  <Plus size={13} /> Add Backlog Item
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {backlogIssues.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400">Product backlog is completely empty.</div>
                ) : (
                  backlogIssues.map(issue => (
                    <div key={issue.id} onClick={() => setSelectedIssue(issue)} className="px-6 py-3.5 hover:bg-stone-50 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        {getTypeIcon(issue.type)}
                        <span className="font-mono text-xs font-bold text-stone-500 w-16">{issue.id}</span>
                        <span className="text-sm font-medium text-stone-900">{issue.summary}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span className="px-2 py-0.5 bg-stone-100 rounded font-medium">{issue.epic}</span>
                        <span className="w-24 font-medium text-stone-700">{issue.assignee}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIssues(issues.map(i => i.id === issue.id ? { ...i, sprint: activeSprint.name } : i));
                          }}
                          className="px-2 py-1 bg-stone-100 hover:bg-indigo-600 hover:text-white rounded text-[11px] font-bold transition-colors"
                        >
                          Send to {activeSprint.name}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. SPRINT REPORTS & VELOCITY */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-1 flex items-center gap-2">
                  <Target size={16} className="text-indigo-600" /> Burndown Chart ({activeSprint.name})
                </h3>
                <p className="text-xs text-stone-500 mb-6">Visualizes remaining story points against planned sprint timeline.</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Sprint Progress</span>
                    <span>{progressPercent}% Completed</span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500 pt-2">
                    <span>Completed Points: <strong>{completedPoints} SP</strong></span>
                    <span>Total Committed: <strong>{totalPoints} SP</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 mb-1 flex items-center gap-2">
                <Zap size={16} className="text-indigo-600" /> Team Velocity Chart
              </h3>
              <p className="text-xs text-stone-500 mb-6">Historical comparison of completed story points across iterations.</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="font-bold">Sprint Alpha</span>
                  <span className="font-extrabold text-indigo-600">27 SP</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="font-bold">Sprint Beta</span>
                  <span className="font-extrabold text-indigo-600">31 SP</span>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-900 rounded-lg text-xs font-bold flex justify-between">
                  <span>Average Velocity (Capacity Planning)</span>
                  <span>29 SP</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- START SPRINT MODAL --- */}
      {isStartSprintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
              <h2 className="text-base font-bold text-stone-900">Start {activeSprint.name}</h2>
              <button onClick={() => setIsStartSprintOpen(false)}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Sprint Goal</label>
                <input 
                  type="text" 
                  value={activeSprint.goal}
                  onChange={(e) => setActiveSprint({...activeSprint, goal: e.target.value})}
                  className="w-full h-9 px-3 border border-stone-200 rounded-lg font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Start Date</label>
                  <input type="text" value={activeSprint.startDate} readOnly className="w-full h-9 px-3 bg-stone-50 border border-stone-200 rounded-lg font-semibold" />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">End Date</label>
                  <input type="text" value={activeSprint.endDate} readOnly className="w-full h-9 px-3 bg-stone-50 border border-stone-200 rounded-lg font-semibold" />
                </div>
              </div>
              <p className="text-stone-500 pt-2">This sprint contains <strong>{activeSprintIssues.length} issues</strong> totaling <strong>{totalPoints} Story Points</strong>.</p>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-stone-50 border-t border-stone-200">
              <button onClick={() => setIsStartSprintOpen(false)} className="h-8 px-4 bg-white border border-stone-200 rounded-lg text-xs font-semibold">Cancel</button>
              <button 
                onClick={() => {
                  setActiveSprint({...activeSprint, status: 'active'});
                  setIsStartSprintOpen(false);
                }} 
                className="h-8 px-5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 cursor-pointer"
              >
                Start Sprint Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- COMPLETE SPRINT MODAL --- */}
      {isCompleteSprintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
              <h2 className="text-base font-bold text-stone-900">Complete {activeSprint.name}</h2>
              <button onClick={() => setIsCompleteSprintOpen(false)}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-stone-600">Completed Issues: <strong>{activeSprintIssues.filter(i => i.status === 'done').length}</strong></p>
              <p className="text-stone-600">Incomplete Issues: <strong>{activeSprintIssues.filter(i => i.status !== 'done').length}</strong></p>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Move incomplete issues to:</label>
                <select className="w-full h-9 px-3 border border-stone-200 rounded-lg font-semibold focus:outline-none">
                  <option value="backlog">Product Backlog</option>
                  <option value="next">Sprint 2 (Next Iteration)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-stone-50 border-t border-stone-200">
              <button onClick={() => setIsCompleteSprintOpen(false)} className="h-8 px-4 bg-white border border-stone-200 rounded-lg text-xs font-semibold">Cancel</button>
              <button 
                onClick={() => {
                  setActiveSprint({...activeSprint, name: 'Sprint 2', status: 'planning'});
                  setIsCompleteSprintOpen(false);
                }} 
                className="h-8 px-5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
              >
                Complete Sprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ISSUE DETAILS MODAL --- */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600">{selectedIssue.id}</span>
                <h2 className="text-base font-bold text-stone-900">{selectedIssue.summary}</h2>
              </div>
              <button onClick={() => setSelectedIssue(null)}><X size={18} /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div>
                <h3 className="font-bold text-stone-700 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  {selectedIssue.description || 'No description provided.'}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-stone-700 uppercase tracking-wider mb-2">Comments</h3>
                <div className="space-y-2 mb-3">
                  {selectedIssue.comments?.map((c, idx) => (
                    <div key={idx} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
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
                    className="flex-1 h-9 px-3 border border-stone-200 rounded-lg focus:outline-none focus:border-indigo-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const newComment = { author: 'Admin', text: e.target.value, timestamp: 'Just now' };
                        setSelectedIssue({ ...selectedIssue, comments: [...selectedIssue.comments, newComment] });
                        e.target.value = '';
                      }
                    }}
                  />
                  <button className="h-9 px-4 bg-indigo-600 text-white rounded-lg font-semibold cursor-pointer">Send</button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-stone-700 uppercase tracking-wider mb-2">Activity History Audit Log</h3>
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
              <button onClick={() => setSelectedIssue(null)} className="h-8 px-4 bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE ISSUE MODAL --- */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h2 className="text-base font-bold text-stone-900">Create Scrum Issue</h2>
              <button onClick={() => setIsCreateOpen(false)}><X size={18} /></button>
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
                    <option value="Story">Story</option>
                    <option value="Task">Task</option>
                    <option value="Bug">Bug</option>
                    <option value="Epic">Epic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Sprint Target</label>
                  <select 
                    value={formData.sprint}
                    onChange={(e) => setFormData({...formData, sprint: e.target.value})}
                    className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">Product Backlog (Unassigned)</option>
                    <option value="Sprint 1">Sprint 1 (Active)</option>
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
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Story Points</label>
                  <select 
                    value={formData.storyPoints}
                    onChange={(e) => setFormData({...formData, storyPoints: e.target.value})}
                    className="w-full h-8 px-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none"
                  >
                    <option value={1}>1 SP</option>
                    <option value={2}>2 SP</option>
                    <option value={3}>3 SP</option>
                    <option value={5}>5 SP</option>
                    <option value={8}>8 SP</option>
                    <option value={13}>13 SP</option>
                  </select>
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

    </div>
  );
}