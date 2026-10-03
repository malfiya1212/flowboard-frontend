import React from 'react';
import { 
  Layers, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  // Mock data based on the screenshot
  const priorityWork = [
    { id: 'FB-101', title: 'Refactor Dashboard Component API Architecture', time: 'Today', status: 'IN PROGRESS' },
    { id: 'FB-102', title: 'Refactor Dashboard Component API Architecture', time: 'Today', status: 'IN PROGRESS' },
    { id: 'FB-103', title: 'Refactor Dashboard Component API Architecture', time: 'Today', status: 'IN PROGRESS' },
  ];

  const recentProjects = [
    { id: 'A', name: 'Apollo Redesign', time: '2h ago', color: 'bg-fuchsia-500' },
    { id: 'S', name: 'Stitch Backend', time: '5h ago', color: 'bg-blue-500' },
  ];

  return (
    // This wrapper acts as the pure content canvas. No sidebars, no topnav.
    <div className="flex-1 h-full overflow-y-auto bg-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <span className="hover:text-slate-600 cursor-pointer">Workspace</span>
          <span>›</span>
          <span className="text-slate-600">Dashboard</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time performance metrics for your active sprint.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <Layers size={18} className="text-blue-500" strokeWidth={2.5} />
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">+2</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">ACTIVE PROJECTS</p>
              <div className="text-2xl font-bold text-slate-800">12</div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <AlertCircle size={18} className="text-orange-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">+5</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">OPEN ISSUES</p>
              <div className="text-2xl font-bold text-slate-800">48</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <Clock size={18} className="text-indigo-400" strokeWidth={2.5} />
              {/* No delta badge for this one in the design */}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">ASSIGNED TO ME</p>
              <div className="text-2xl font-bold text-slate-800">06</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <CheckCircle2 size={18} className="text-emerald-500" strokeWidth={2.5} />
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">+12%</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">COMPLETED</p>
              <div className="text-2xl font-bold text-slate-800">124</div>
            </div>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Priority Work Panel (Takes up 2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
              <h2 className="font-semibold text-slate-800 text-sm">My Priority Work</h2>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                View All Tasks
              </button>
            </div>
            
            <div className="flex-1 p-2">
              <div className="space-y-1">
                {priorityWork.map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 h-4 w-4 rounded border border-slate-300 flex-shrink-0 group-hover:border-indigo-400 transition-colors"></div>
                      <div>
                        <div className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono">{task.id}</span>
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
                      <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Area (Takes up 1 column) */}
          <div className="space-y-6">
            
            {/* Recent Projects */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="px-6 pt-5 pb-3">
                <h2 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Recent Projects</h2>
              </div>
              <div className="px-4 pb-4">
                <div className="space-y-2">
                  {recentProjects.map((project, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                      <div className={`h-8 w-8 rounded text-white flex items-center justify-center font-bold text-xs ${project.color}`}>
                        {project.id}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700">{project.name}</div>
                        <div className="text-xs text-slate-400">{project.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                  Browse All Projects
                </button>
              </div>
            </div>

            {/* Sprint Capacity Widget */}
            <div className="bg-[#E1E4ED] rounded-xl shadow-md p-6 text-white relative overflow-hidden">
              {/* Subtle background glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-6">
                <Activity size={16} className="text-indigo-400" />
                <h2 className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">Sprint Capacity</h2>
              </div>
              
              <div className="flex items-end justify-between mb-3">
                <div className="text-4xl font-extrabold tracking-tight">78%</div>
                <div className="text-xs text-slate-400 mb-1">22h left</div>
              </div>
              
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}