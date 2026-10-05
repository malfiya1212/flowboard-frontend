import React from 'react';
import { 
  Clock, 
  MoreHorizontal, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  // Jira-style ticket data
  const activeIssues = [
    { id: 'FB-101', title: 'Refactor Dashboard Component API Architecture', time: 'Today', status: 'IN PROGRESS', priority: 'High', type: 'Task' },
    { id: 'FB-104', title: 'Update User Authentication Flow', time: 'Yesterday', status: 'IN REVIEW', priority: 'Medium', type: 'Story' },
    { id: 'FB-107', title: 'Optimize MongoDB Aggregation Queries', time: '2 days ago', status: 'TO DO', priority: 'High', type: 'Bug' },
    { id: 'FB-112', title: 'Design System Button Components', time: 'Last week', status: 'DONE', priority: 'Low', type: 'Task' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'IN PROGRESS': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN REVIEW': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DONE': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fafaf9] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Workspace</span>
          <span>/</span>
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">FlowBoard</span>
          <span>/</span>
          <span className="text-stone-900 bg-stone-200 px-2 py-0.5 rounded">Active Sprint</span>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <LayoutDashboard className="text-indigo-600" size={24} />
              Sprint Board
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Welcome back, {user?.name || 'Developer'}. Here is your current sprint progress.
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm cursor-pointer">
            Create Issue
          </button>
        </div>

        {/* Agile Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
            <p className="text-xs font-bold text-stone-500 tracking-wider mb-2">TO DO</p>
            <div className="text-3xl font-bold text-stone-800">12</div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm border-l-4 border-l-blue-500">
            <p className="text-xs font-bold text-stone-500 tracking-wider mb-2">IN PROGRESS</p>
            <div className="text-3xl font-bold text-stone-800">04</div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm border-l-4 border-l-purple-500">
            <p className="text-xs font-bold text-stone-500 tracking-wider mb-2">IN REVIEW</p>
            <div className="text-3xl font-bold text-stone-800">03</div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm border-l-4 border-l-green-500">
            <p className="text-xs font-bold text-stone-500 tracking-wider mb-2">DONE</p>
            <div className="text-3xl font-bold text-stone-800">28</div>
          </div>
        </div>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Issue List (Assigned to Me) */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-stone-200 shadow-sm flex flex-col">
            <div className="px-6 py-4 flex items-center justify-between border-b border-stone-100">
              <h2 className="font-semibold text-stone-800">Assigned to Me</h2>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
                View All Filters
              </button>
            </div>
            
            <div className="flex-1 p-2">
              <div className="space-y-1">
                {activeIssues.map((issue, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-md transition-colors group border border-transparent hover:border-stone-200 cursor-pointer">
                    <div className="flex items-start gap-4">
                      {issue.type === 'Bug' ? (
                        <AlertCircle className="text-red-500 mt-0.5" size={18} />
                      ) : (
                        <CheckCircle2 className="text-blue-500 mt-0.5" size={18} />
                      )}
                      
                      <div>
                        <div className="text-sm font-medium text-stone-800 group-hover:text-indigo-600 transition-colors">
                          {issue.title}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                          <span className="font-mono text-indigo-600 font-semibold">{issue.id}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {issue.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded border tracking-wide ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                      <button className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Sprint Details */}
          <div className="space-y-6">
            
            {/* Sprint Progress */}
            <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Activity size={18} className="text-indigo-600" />
                <h2 className="text-xs font-bold tracking-wider text-stone-600 uppercase">Sprint FB-Alpha</h2>
              </div>
              
              <div className="flex items-end justify-between mb-3">
                <div className="text-3xl font-extrabold text-stone-800">65%</div>
                <div className="text-sm text-stone-500 mb-1 font-medium">4 days remaining</div>
              </div>
              
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-green-500" style={{ width: '65%' }} title="Done"></div>
                <div className="h-full bg-blue-500" style={{ width: '15%' }} title="In Progress"></div>
              </div>
              <div className="mt-4 flex gap-4 text-xs text-stone-500">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Done</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Active</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}