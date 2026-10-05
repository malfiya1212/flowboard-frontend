import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Layout, List, BarChart2, 
  Settings, MoreHorizontal, Inbox, Target, Zap, CheckSquare, AlertCircle, Bookmark
} from 'lucide-react';
import CreateIssueModal from '../components/scrum/CreateIssueModal';

export default function Dashboard() {
  // UI State
  const [activeTab, setActiveTab] = useState('backlog');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data State (Temporary client-side storage until Node.js backend is connected)
  const [issues, setIssues] = useState([]);
  
  // Board Configuration
  const boardColumns = [
    { id: 'todo', title: 'TO DO' },
    { id: 'in-progress', title: 'IN PROGRESS' },
    { id: 'review', title: 'IN REVIEW' },
    { id: 'done', title: 'DONE' }
  ];

  const handleCreateIssue = (formData) => {
    const newIssue = {
      ...formData,
      id: `FB-${100 + issues.length + 1}`, // Generate fake ID like FB-101
      status: 'todo', // Default status
      createdAt: new Date().toISOString()
    };
    setIssues([newIssue, ...issues]);
  };

  // Helper to render the correct icon based on issue type
  const getTypeIcon = (type) => {
    switch(type) {
      case 'Bug': return <AlertCircle size={14} className="text-red-500" />;
      case 'Task': return <CheckSquare size={14} className="text-blue-500" />;
      case 'Epic': return <Bookmark size={14} className="text-purple-500" />;
      default: return <Bookmark size={14} className="text-green-500" />; // Story
    }
  };

  // Separate issues based on whether they were assigned to a sprint
  const backlogIssues = issues.filter(issue => !issue.sprint);
  const sprintIssues = issues.filter(issue => issue.sprint);

  return (
    <div className="flex-1 min-h-screen bg-stone-50 font-sans text-stone-900">
      <div className="p-8 max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-stone-500 font-medium mb-1">
              Workspace / FlowBoard / Scrum Team
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              FB-Alpha Sprint
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 px-3 bg-white border border-stone-200 text-stone-700 rounded-lg text-sm font-semibold hover:bg-stone-50 transition-colors flex items-center gap-2">
              <Settings size={16} />
              Configure Board
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer"
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
            Active Sprint
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'reports' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <BarChart2 size={16} />
            Sprint Reports
          </button>
        </div>

        {/* --- TOOLBAR (Search, Filters, Epics) --- */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-3 w-64 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            
            <div className="h-9 w-px bg-stone-200 mx-1"></div>
            
            <button className="h-9 px-3 bg-white border border-stone-200 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 flex items-center gap-2">
              <Filter size={14} /> Assignee
            </button>
            <button className="h-9 px-3 bg-white border border-stone-200 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 flex items-center gap-2">
              Epic
            </button>
          </div>
        </div>

        {/* --- DYNAMIC CONTENT AREA --- */}
        
        {/* 1. ACTIVE SPRINT (KANBAN BOARD) */}
        {activeTab === 'board' && (
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
            {boardColumns.map(column => (
              <div key={column.id} className="flex-1 min-w-[280px] max-w-[320px] bg-stone-100 rounded-xl flex flex-col">
                <div className="p-3 flex items-center justify-between border-b border-stone-200/50">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {column.title} 
                    <span className="ml-2 px-1.5 py-0.5 bg-stone-200 text-stone-600 rounded-full text-[10px]">
                      {sprintIssues.filter(i => i.status === column.id).length}
                    </span>
                  </h3>
                  <button className="text-stone-400 hover:text-stone-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                
                <div className="flex-1 p-2 flex flex-col gap-2">
                  {sprintIssues.filter(i => i.status === column.id).length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                      <p className="text-xs text-stone-500 font-medium">No issues</p>
                    </div>
                  ) : (
                    sprintIssues.filter(i => i.status === column.id).map(issue => (
                      <div key={issue.id} className="bg-white border border-stone-200 rounded-lg p-3 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer">
                        <div className="text-sm text-stone-900 font-medium mb-2">{issue.summary}</div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            {getTypeIcon(issue.type)}
                            <span className="text-xs font-semibold text-stone-500">{issue.id}</span>
                          </div>
                          {issue.storyPoints && (
                            <div className="w-5 h-5 bg-stone-100 rounded-full flex items-center justify-center text-[10px] font-bold text-stone-600">
                              {issue.storyPoints}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. BACKLOG & SPRINT PLANNING */}
        {activeTab === 'backlog' && (
          <div className="bg-white border border-stone-200 rounded-xl">
            {backlogIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
                  <Inbox size={32} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">Your backlog is empty</h3>
                <p className="text-sm text-stone-500 mb-6 max-w-md">
                  Start planning your next sprint by adding User Stories, Tasks, and Bugs to your backlog.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="h-9 px-4 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} /> Add to Backlog
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                <div className="px-4 py-3 bg-stone-50 text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center rounded-t-xl">
                  <span className="w-8"></span>
                  <span className="flex-1">Summary</span>
                  <span className="w-24 text-center">Epic</span>
                  <span className="w-24 text-center">Assignee</span>
                  <span className="w-16 text-center">Points</span>
                </div>
                {backlogIssues.map(issue => (
                  <div key={issue.id} className="px-4 py-3 hover:bg-stone-50 flex items-center text-sm transition-colors cursor-pointer">
                    <span className="w-8 flex justify-center">{getTypeIcon(issue.type)}</span>
                    <span className="flex-1 font-medium text-stone-900">{issue.summary}</span>
                    <span className="w-24 text-center text-xs text-stone-500">{issue.epic || '-'}</span>
                    <span className="w-24 text-center text-xs text-stone-500">{issue.assignee || 'Unassigned'}</span>
                    <span className="w-16 flex justify-center">
                      <span className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-xs font-bold text-stone-600">
                        {issue.storyPoints || '-'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. SPRINT REPORTS */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
               <Target size={32} className="text-stone-300 mb-3" />
               <h3 className="text-sm font-bold text-stone-900 mb-1">Burndown Chart</h3>
               <p className="text-xs text-stone-500">Not enough historical data to generate a burndown chart for this sprint.</p>
            </div>
          </div>
        )}

      </div>

      {/* RENDER THE MODAL */}
      <CreateIssueModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateIssue} 
      />
    </div>
  );
}