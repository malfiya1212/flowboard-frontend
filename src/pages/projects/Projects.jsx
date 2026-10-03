import React, { useState } from 'react';
import { Plus, Search, Filter, Folder, ArrowUpRight, CheckCircle2, Clock, ShieldCheck, MoreVertical } from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    id: 'PRJ-01',
    title: 'Enterprise Core Network Routing',
    department: 'Infrastructure',
    status: 'In Progress',
    priority: 'High',
    progress: 78,
    teamLead: 'Malefiya',
    updated: '2 hours ago',
    activeKeys: ['NET-12', 'NET-15']
  },
  {
    id: 'PRJ-02',
    title: 'Cloud Systems Migration & IAM',
    department: 'Cloud Ops',
    status: 'Review',
    priority: 'Medium',
    progress: 92,
    teamLead: 'Sarah S.',
    updated: 'Yesterday',
    activeKeys: ['CLD-04']
  },
  {
    id: 'PRJ-03',
    title: 'Datacenter Security Hardening',
    department: 'Cybersecurity',
    status: 'Planning',
    priority: 'High',
    progress: 15,
    teamLead: 'Alex J.',
    updated: '3 days ago',
    activeKeys: ['SEC-01', 'SEC-02', 'SEC-03']
  }
];

export default function Projects() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === 'All' || p.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#EAF2F9] p-6 lg:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* SECTION 1: Header & Global Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Active Workspaces</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {filteredProjects.length} Projects
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage enterprise infrastructure streams and engineering tasks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs">
              <Plus size={14} strokeWidth={2.5} />
              New Project
            </button>
          </div>
        </div>

        {/* SECTION 2: Filter & Search Bar (Compact Controls) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by title or project ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Filter size={13} />
              <span>Department:</span>
              <select 
                value={filterDept} 
                onChange={(e) => setFilterDept(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Cloud Ops">Cloud Ops</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: Sectioned Project List (Compact & Structured) */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-slate-100">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors group"
              >
                
                {/* Left Info Group */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0 mt-0.5">
                    {project.id.split('-')[1]}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-400">{project.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                        {project.department}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                      <span>Lead: <strong className="text-slate-700 font-medium">{project.teamLead}</strong></span>
                      <span>•</span>
                      <span>Updated {project.updated}</span>
                    </div>
                  </div>
                </div>

                {/* Right Metrics & Actions Group */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  
                  {/* Progress Meter */}
                  <div className="w-28 space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-600">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                    project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                    project.status === 'Review' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {project.status}
                  </span>

                  {/* Action Button */}
                  <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors">
                    <ArrowUpRight size={16} />
                  </button>

                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}