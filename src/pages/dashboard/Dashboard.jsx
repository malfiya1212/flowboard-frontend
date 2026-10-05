import React from 'react';
import { Clock, MoreHorizontal, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const priorityWork = [
    { id: 'FB-101', title: 'Refactor Dashboard Component API Architecture', time: 'Today', status: 'IN PROGRESS' },
    { id: 'FB-102', title: 'Update User Authentication Flow', time: 'Today', status: 'IN PROGRESS' },
    { id: 'FB-103', title: 'Optimize Database Queries', time: 'Today', status: 'IN PROGRESS' },
  ];

  return (
    <div className="w-full bg-[#fafaf9] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6 font-medium">
          <span className="hover:text-stone-600 cursor-pointer">Workspace</span>
          <span>›</span>
          <span className="text-stone-600">Dashboard</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-sm text-stone-500 mt-1">Real-time performance metrics for your active sprint.</p>
        </div>

        {/* Simplified Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-stone-400 tracking-wider mb-2">ACTIVE PROJECTS</p>
              <div className="text-3xl font-bold text-stone-900">12</div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-stone-400 tracking-wider mb-2">OPEN ISSUES</p>
              <div className="text-3xl font-bold text-stone-900">48</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-stone-400 tracking-wider mb-2">ASSIGNED TO ME</p>
              <div className="text-3xl font-bold text-stone-900">06</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-stone-400 tracking-wider mb-2">COMPLETED</p>
              <div className="text-3xl font-bold text-stone-900">124</div>
            </div>
          </div>

        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Priority Work Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col">
            <div className="px-6 py-5 flex items-center justify-between border-b border-stone-100">
              <h2 className="font-semibold text-stone-800 text-sm">My Priority Work</h2>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
                View All Tasks
              </button>
            </div>
            
            <div className="flex-1 p-2">
              <div className="space-y-1">
                {priorityWork.map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-stone-50 rounded-lg transition-colors group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 h-4 w-4 rounded border border-stone-300 flex-shrink-0 group-hover:border-indigo-400 transition-colors"></div>
                      <div>
                        <div className="text-sm font-medium text-stone-700 group-hover:text-indigo-600 transition-colors">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-400 mt-1.5">
                          <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-mono">{task.id}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {task.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-orange-50 text-orange-600 tracking-wide">
                        {task.status}
                      </span>
                      <button className="text-stone-300 hover:text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Area */}
          <div className="space-y-6">
            
            {/* Sprint Capacity Widget */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 text-stone-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-6">
                <Activity size={16} className="text-indigo-600" />
                <h2 className="text-[11px] font-bold tracking-wider text-stone-500 uppercase">Sprint Capacity</h2>
              </div>
              
              <div className="flex items-end justify-between mb-3">
                <div className="text-4xl font-extrabold tracking-tight text-stone-900">78%</div>
                <div className="text-xs text-stone-500 mb-1">22h left</div>
              </div>
              
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}