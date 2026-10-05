import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Layout, List, BarChart2, 
  Settings, MoreHorizontal, Inbox, Target, Zap
} from 'lucide-react';

export default function Dashboard() {
  // UI State
  const [activeTab, setActiveTab] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');

  // Data State (Strictly empty, waiting for backend integration)
  const [issues, setIssues] = useState([]);
  const [epics, setEpics] = useState([]);
  const [sprints, setSprints] = useState([]);
  
  // Board Configuration
  const boardColumns = [
    { id: 'todo', title: 'TO DO' },
    { id: 'in-progress', title: 'IN PROGRESS' },
    { id: 'review', title: 'IN REVIEW' },
    { id: 'done', title: 'DONE' }
  ];

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
            <button className="h-9 px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Plus size={16} />
              Create Issue
            </button>
          </div>
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex items-center border-b border-stone-200 mb-6">
          <button 
            onClick={() => setActiveTab('backlog')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'backlog' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <List size={16} />
            Backlog & Planning
          </button>
          <button 
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'board' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <Layout size={16} />
            Active Sprint
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'reports' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
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
                placeholder="Search issues, epics..."
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
            <button className="h-9 px-3 bg-white border border-stone-200 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 flex items-center gap-2">
              Type (Story/Task/Bug)
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
                    {column.title} <span className="ml-1 px-1.5 py-0.5 bg-stone-200 text-stone-600 rounded-full text-[10px]">0</span>
                  </h3>
                  <button className="text-stone-400 hover:text-stone-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                
                {/* Empty State for Columns */}
                <div className="flex-1 p-3 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center text-stone-400 mb-2">
                    <Plus size={20} />
                  </div>
                  <p className="text-xs text-stone-500 font-medium">No issues</p>
                  <p className="text-[10px] text-stone-400 mt-1">Drag issues here or create new</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. BACKLOG & SPRINT PLANNING */}
        {activeTab === 'backlog' && (
          <div className="bg-white border border-stone-200 rounded-xl flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
              <Inbox size={32} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">Your backlog is empty</h3>
            <p className="text-sm text-stone-500 mb-6 max-w-md">
              Start planning your next sprint by adding User Stories, Tasks, and Bugs to your backlog. Don't forget to assign Story Points!
            </p>
            <button className="h-9 px-4 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-2">
              <Plus size={16} /> Add to Backlog
            </button>
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
            <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
               <Zap size={32} className="text-stone-300 mb-3" />
               <h3 className="text-sm font-bold text-stone-900 mb-1">Team Velocity</h3>
               <p className="text-xs text-stone-500">Complete at least one sprint to calculate average team velocity.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}