import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FolderKanban, 
  Users, 
  CheckSquare, 
  Layers, 
  LayoutTemplate,
  Activity,
  Calendar,
  Shield,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const projectId = id || 'FLW';

  // Frontend Mock Data for the Details Page
  const projectDetails = {
    key: projectId,
    name: 'FlowBoard Web Application',
    status: 'Active',
    category: 'Software',
    lead: 'Malefiya',
    created: 'Oct 12, 2025',
    description: 'Full-stack enterprise agile project management software built with React, Node.js, and PostgreSQL. Designed to streamline workflows for engineering, networking, and IT infrastructure teams.',
    metrics: {
      totalIssues: 124,
      inProgress: 18,
      completed: 92,
      teamMembers: 6
    },
    team: [
      { name: 'Malefiya', role: 'Project Lead', initials: 'M', color: 'bg-indigo-100 text-indigo-700' },
      { name: 'Sarah Smith', role: 'Frontend Dev', initials: 'SS', color: 'bg-emerald-100 text-emerald-700' },
      { name: 'Alex Johnson', role: 'Backend Dev', initials: 'AJ', color: 'bg-amber-100 text-amber-700' },
    ]
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#f8fafc] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Link to="/projects" className="hover:text-indigo-600 transition-colors">Workspaces</Link>
          <span>/</span>
          <span className="text-indigo-600">{projectDetails.key}</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 text-indigo-600 font-bold flex items-center justify-center rounded-2xl shrink-0 text-lg tracking-wide shadow-sm">
              {projectDetails.key}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {projectDetails.name}
                </h1>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  {projectDetails.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed mt-2">
                {projectDetails.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              to={`/project/${projectId}/kanban`} 
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <LayoutTemplate size={16} className="text-slate-400" />
              Kanban Board
            </Link>
            <Link 
              to={`/project/${projectId}/scrum`} 
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            >
              <FolderKanban size={16} />
              Active Scrum
            </Link>
            <button className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl shadow-sm transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Issues</p>
              <p className="text-2xl font-extrabold text-slate-900">{projectDetails.metrics.totalIssues}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">In Progress</p>
              <p className="text-2xl font-extrabold text-slate-900">{projectDetails.metrics.inProgress}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckSquare size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Completed</p>
              <p className="text-2xl font-extrabold text-slate-900">{projectDetails.metrics.completed}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Team Size</p>
              <p className="text-2xl font-extrabold text-slate-900">{projectDetails.metrics.teamMembers}</p>
            </div>
          </div>
        </div>

        {/* Main Content Split Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity size={16} className="text-indigo-500" />
                Current Sprint Progress
              </h3>
              
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-4">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Sprint 14: Authentication & UI Polish</p>
                    <p className="text-xs text-slate-500 mt-1">Ends in 4 days</p>
                  </div>
                  <span className="text-2xl font-extrabold text-indigo-600">74%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '74%' }}></div>
                </div>
              </div>
              
              <Link 
                to={`/project/${projectId}/scrum`}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors w-fit"
              >
                Go to Active Sprint <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Project Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <h3 className="text-sm font-bold text-slate-900 mb-5">Project Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Layers size={14} /> Category</span>
                  <span className="font-semibold text-slate-900">{projectDetails.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Shield size={14} /> Project Lead</span>
                  <span className="font-semibold text-slate-900">{projectDetails.lead}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Calendar size={14} /> Created</span>
                  <span className="font-semibold text-slate-900">{projectDetails.created}</span>
                </div>
              </div>
            </div>

            {/* Team Roster Card */}
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-900">Assigned Team</h3>
                <button className="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors">Manage</button>
              </div>
              
              <div className="space-y-3">
                {projectDetails.team.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${member.color}`}>
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}