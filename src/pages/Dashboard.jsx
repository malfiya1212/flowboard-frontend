import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Layout, List, BarChart2, 
  Settings, MoreHorizontal, Inbox, Target, Zap, CheckSquare, AlertCircle, Bookmark, X, User, Tag
} from 'lucide-react';

export default function Dashboard() {
  // UI & Navigation State
  const [activeTab, setActiveTab] = useState('backlog');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [selectedAssignee, setSelectedAssignee] = useState('All');
  const [selectedEpic, setSelectedEpic] = useState('All');

  // Core Data State (Real interactive Scrum items)
  const [issues, setIssues] = useState([
    {
      id: 'FB-101',
      type: 'Story',
      summary: 'Implement core user authentication flow with JWT',
      description: 'Users must be able to log in and receive a secure token.',
      epic: 'Authentication',
      assignee: 'Malefiya',
      priority: 'High',
      storyPoints: '5',
      sprint: '',
      status: 'todo'
    },
    {
      id: 'FB-102',
      type: 'Bug',
      summary: 'Fix 500 error on dashboard aggregation queries',
      description: 'MongoDB queries timeout under heavy load.',
      epic: 'Database',
      assignee: 'Admin',
      priority: 'Highest',
      storyPoints: '8',
      sprint: 'Sprint 1',
      status: 'in-progress'
    }
  ]);

  // Form State for Create Issue Modal
  const [formData, setFormData] = useState({
    type: 'Story',
    summary: '',
    description: '',
    epic: 'Authentication',
    assignee: 'Malefiya',
    priority: 'Medium',
    storyPoints: '3',
    sprint: ''
  });

  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!formData.summary.trim()) return;

    const newIssue = {
      ...formData,
      id: `FB-${100 + issues.length + 1}`,
      status: formData.sprint ? 'todo' : 'todo'
    };

    setIssues([newIssue, ...issues]);
    setFormData({
      type: 'Story',
      summary: '',
      description: '',
      epic: 'Authentication',
      assignee: 'Malefiya',
      priority: 'Medium',
      storyPoints: '3',
      sprint: ''
    });
    setIsModalOpen(false);
  };

  // Type Icon Helper
  const getTypeIcon = (type) => {
    switch(type) {
      case 'Bug': return <AlertCircle size={14} className="text-red-500" />;
      case 'Task': return <CheckSquare size={14} className="text-blue-500" />;
      case 'Epic': return <Bookmark size={14} className="text-purple-600" />;
      default: return <Bookmark size={14} className="text-emerald-600" />; // Story
    }
  };

  // Filter Logic
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.summary.toLowerCase().includes(searchQuery.toLowerCase()) || issue.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = selectedAssignee === 'All' || issue.assignee === selectedAssignee;
    const matchesEpic = selectedEpic === 'All' || issue.epic === selectedEpic;
    return matchesSearch && matchesAssignee && matchesEpic;
  });

  const backlogIssues = filteredIssues.filter(issue => !issue.sprint);
  const sprintIssues = filteredIssues.filter(issue => issue.sprint);

  const boardColumns = [
    { id: 'todo', title: 'TO DO' },
    { id: 'in-progress', title: 'IN PROGRESS' },
    { id: 'review', title: 'IN REVIEW' },
    { id: 'done', title: 'DONE' }
  ];

  return (
    <div className="flex-1 min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
      <div className="p-8 max-w-7xl mx-auto">
        
        {/* --- HEADER (Primary & Secondary UI) --- */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-stone-500 font-medium mb-1">
              Workspace / FlowBoard / Scrum Team
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              FB-Alpha Active Sprint
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 px-3 bg-white border border-stone-200 text-stone-700 rounded-lg text-sm font-semibold hover:bg-stone-50 transition-colors flex items-center gap-2 shadow-xs cursor-pointer">
              <Settings size={16} />
              Configure Board
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

        {/* --- NAVIGATION TABS --- */}
        <div className="flex items-center border-b border-stone-200 mb-6">
          <button 
            onClick={() => setActiveTab('backlog')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'backlog' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <List size={16} />
            Backlog & Planning
          </button>
          <button 
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'board' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <Layout size={16} />
            Active Sprint Board
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'reports' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <BarChart2 size={16} />
            Sprint Reports & Velocity
          </button>
        </div>

        {/* --- TOOLBAR (Interactive Filters & Search) --- */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-3 w-64 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
              />
            </div>
            
            <div className="h-9 w-px bg-stone-200 mx-1"></div>
            
            {/* ASSIGNEE FILTER */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 rounded-lg h-9 shadow-xs">
              <User size={14} className="text-stone-400" />
              <span className="text-xs font-medium text-stone-500">Assignee:</span>
              <select 
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Assignees</option>
                <option value="Malefiya">Malefiya</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* EPIC FILTER */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 rounded-lg h-9 shadow-xs">
              <Tag size={14} className="text-stone-400" />
              <span className="text-xs font-medium text-stone-500">Epic:</span>
              <select 
                value={selectedEpic}
                onChange={(e) => setSelectedEpic(e.target.value)}
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Epics</option>
                <option value="Authentication">Authentication</option>
                <option value="Database">Database</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- TAB 1: ACTIVE SPRINT BOARD --- */}
        {activeTab === 'board' && (
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
            {boardColumns.map(column => (
              <div key={column.id} className="flex-1 min-w-[280px] max-w-[320px] bg-stone-100/80 border border-stone-200/60 rounded-xl flex flex-col">
                <div className="p-3 flex items-center justify-between border-b border-stone-200">
                  <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-2">
                    {column.title} 
                    <span className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full text-[10px]">
                      {sprintIssues.filter(i => i.status === column.id).length}
                    </span>
                  </h3>
                  <button className="text-stone-400 hover:text-stone-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                
                <div className="flex-1 p-2.5 flex flex-col gap-2.5">
                  {sprintIssues.filter(i => i.status === column.id).length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                      <p className="text-xs text-stone-400 font-medium">No active issues</p>
                    </div>
                  ) : (
                    sprintIssues.filter(i => i.status === column.id).map(issue => (
                      <div key={issue.id} className="bg-white border border-stone-200/80 rounded-lg p-3.5 shadow-xs hover:border-indigo-400 transition-all cursor-pointer">
                        <div className="text-xs font-semibold text-stone-500 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">{getTypeIcon(issue.type)} {issue.id}</span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">{issue.epic}</span>
                        </div>
                        <div className="text-sm font-semibold text-stone-900 mb-3">{issue.summary}</div>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                          <span className="font-medium text-stone-700">{issue.assignee || 'Unassigned'}</span>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-stone-100 font-bold rounded text-stone-700">{issue.storyPoints} SP</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB 2: BACKLOG & PLANNING --- */}
        {activeTab === 'backlog' && (
          <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Sprint Backlog</h3>
                <p className="text-xs text-stone-500">Drag items or assign them to upcoming sprints for execution.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="h-8 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            {backlogIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Inbox size={40} className="text-stone-300 mb-3" />
                <h4 className="text-base font-bold text-stone-800 mb-1">Backlog is empty</h4>
                <p className="text-xs text-stone-500 max-w-sm mb-4">Create stories, tasks, and bugs to start planning your team's iterations.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Create First Issue
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {backlogIssues.map(issue => (
                  <div key={issue.id} className="px-6 py-3.5 hover:bg-stone-50/80 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      {getTypeIcon(issue.type)}
                      <span className="font-mono text-xs font-bold text-stone-500 w-16">{issue.id}</span>
                      <span className="text-sm font-medium text-stone-900">{issue.summary}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-medium">{issue.epic}</span>
                      <span className="w-24 font-medium text-stone-700">{issue.assignee}</span>
                      <span className="w-16 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-center font-bold">{issue.storyPoints} SP</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: REPORTS --- */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center shadow-xs">
               <Target size={32} className="text-indigo-600 mb-3" />
               <h3 className="text-sm font-bold text-stone-900 mb-1">Burndown Chart</h3>
               <p className="text-xs text-stone-500">Real-time burndown tracking activates once sprint issues are completed.</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center shadow-xs">
               <Zap size={32} className="text-indigo-600 mb-3" />
               <h3 className="text-sm font-bold text-stone-900 mb-1">Team Velocity</h3>
               <p className="text-xs text-stone-500">Average velocity metrics will appear after closing the first sprint.</p>
            </div>
          </div>
        )}

      </div>

      {/* --- INTEGRATED CREATE ISSUE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-xl shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h2 className="text-base font-bold text-stone-900">Create New Issue</h2>
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
                    <option value="Story">Story</option>
                    <option value="Task">Task</option>
                    <option value="Bug">Bug</option>
                    <option value="Epic">Epic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Sprint Destination</label>
                  <select 
                    value={formData.sprint}
                    onChange={(e) => setFormData({...formData, sprint: e.target.value})}
                    className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">Backlog (Unassigned)</option>
                    <option value="Sprint 1">Sprint 1 (Active)</option>
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
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Epic Link</label>
                  <select 
                    value={formData.epic}
                    onChange={(e) => setFormData({...formData, epic: e.target.value})}
                    className="w-full h-8 px-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="Authentication">Authentication</option>
                    <option value="Database">Database</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Story Points</label>
                  <select 
                    value={formData.storyPoints}
                    onChange={(e) => setFormData({...formData, storyPoints: e.target.value})}
                    className="w-full h-8 px-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="1">1 SP</option>
                    <option value="2">2 SP</option>
                    <option value="3">3 SP</option>
                    <option value="5">5 SP</option>
                    <option value="8">8 SP</option>
                  </select>
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