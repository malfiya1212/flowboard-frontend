import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Layers,
  ListTodo,
  CheckSquare,
  Clock,
  Calendar as CalendarIcon,
  BarChart3,
  Tag,
  Settings as SettingsIcon,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Trash2,
  Search,
  Filter,
  User,
  Zap,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function ProjectWorkspace() {
  const { id } = useParams(); // Project Key from URL parameter
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    projects,
    issues,
    sprints,
    kanbanColumns,
    releases,
    createIssue,
    transitionIssue,
    deleteIssue,
    createSprint,
    startSprint,
    completeSprint,
    moveIssueToSprint,
    updateColumnWipLimit,
    createRelease,
    toggleReleaseStatus,
  } = useWorkspace();

  // Active Project Resolution
  const activeProjectKey = id || searchParams.get('project') || 'FLW';
  const currentProject = projects.find((p) => p.key === activeProjectKey) || projects[0];

  // Active Tab: 'overview' | 'board' | 'backlog' | 'issues' | 'timeline' | 'calendar' | 'reports' | 'releases' | 'settings'
  const activeTab = searchParams.get('tab') || 'board';
  const setActiveTab = (tab) => {
    setSearchParams({ project: currentProject.key, tab });
  };

  // Local Filter & Swimlane State
  const [searchFilter, setSearchFilter] = useState('');
  const [swimlaneMode, setSwimlaneMode] = useState('none'); // 'none' | 'assignee' | 'priority'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newIssueForm, setNewIssueForm] = useState({
    title: '',
    type: 'Story',
    priority: 'Medium',
    assignee: 'Malefiya',
    storyPoints: 3,
    epic: 'Frontend Core',
  });

  // Filtered Issues for Current Project
  const projectIssues = issues.filter((i) => i.projectKey === currentProject.key);
  const filteredIssues = projectIssues.filter((i) =>
    i.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    i.key.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Scrum Sprints for Current Project
  const projectSprints = sprints.filter((s) => s.projectId === currentProject.key);
  const activeSprint = projectSprints.find((s) => s.status === 'active');

  // Submit Handler for Issue Creation
  const handleCreateIssueSubmit = (e) => {
    e.preventDefault();
    if (!newIssueForm.title.trim()) return;

    createIssue({
      ...newIssueForm,
      projectKey: currentProject.key,
      sprintId: activeSprint ? activeSprint.id : null,
    });

    setNewIssueForm({
      title: '',
      type: 'Story',
      priority: 'Medium',
      assignee: 'Malefiya',
      storyPoints: 3,
      epic: 'Frontend Core',
    });
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] font-sans text-stone-900 bg-stone-50/50">
      
      {/* ================= WORKSPACE CONTEXT BAR ================= */}
      <div className="bg-white border-b border-stone-200 px-6 py-3 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {currentProject.key}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-stone-900 tracking-tight leading-none">
                {currentProject.name}
              </h1>
              <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-stone-200 bg-stone-100 text-stone-600">
                {currentProject.template}
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              Lead: <strong className="text-stone-700">{currentProject.lead}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Filter cards..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Issue</span>
          </button>
        </div>
      </div>

      {/* ================= JIRA 9-TAB NAVIGATION ================= */}
      <div className="bg-white border-b border-stone-200 px-6 shrink-0 flex gap-6 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: FolderKanban },
          { id: 'board', label: 'Board', icon: Layers },
          { id: 'backlog', label: 'Backlog', icon: ListTodo },
          { id: 'issues', label: 'Issues', icon: CheckSquare },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'releases', label: 'Releases', icon: Tag },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-3 border-b-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= MAIN INTERACTIVE TAB WORKSPACE ================= */}
      <div className="flex-1 overflow-auto p-6">
        
        {/* ---------------- 1. OVERVIEW TAB ---------------- */}
        {activeTab === 'overview' && (
          <div className="max-w-4xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Total Issues</span>
                <div className="text-2xl font-bold font-mono mt-1">{projectIssues.length}</div>
              </div>
              <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Completed Issues</span>
                <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">
                  {projectIssues.filter((i) => i.status === 'Done').length}
                </div>
              </div>
              <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Active Sprint</span>
                <div className="text-sm font-bold text-stone-800 mt-2 truncate">
                  {activeSprint ? activeSprint.name : 'No Active Sprint'}
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-2">
              <h3 className="font-bold text-sm">About {currentProject.name}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{currentProject.description}</p>
            </div>
          </div>
        )}

        {/* ---------------- 2. BOARD TAB (Scrum & Kanban Engine) ---------------- */}
        {activeTab === 'board' && (
          <div className="space-y-4 h-full flex flex-col">
            {/* Board Controls: Sprint Actions & Swimlanes */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                {currentProject.template === 'Scrum' && activeSprint && (
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
                    <Zap size={14} className="text-indigo-600" />
                    <span className="font-bold text-indigo-900">{activeSprint.name}</span>
                    <span className="text-[11px] text-indigo-700">({activeSprint.goal})</span>
                  </div>
                )}

                {/* Swimlane Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400 font-bold uppercase text-[10px]">Swimlanes:</span>
                  <select
                    value={swimlaneMode}
                    onChange={(e) => setSwimlaneMode(e.target.value)}
                    className="bg-white border border-stone-200 rounded px-2 py-1 text-xs cursor-pointer focus:outline-none focus:border-indigo-600"
                  >
                    <option value="none">None</option>
                    <option value="priority">Group by Priority</option>
                    <option value="assignee">Group by Assignee</option>
                  </select>
                </div>
              </div>

              {currentProject.template === 'Scrum' && activeSprint && (
                <button
                  type="button"
                  onClick={() => completeSprint(activeSprint.id)}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg border border-stone-200 cursor-pointer"
                >
                  Complete Sprint
                </button>
              )}
            </div>

            {/* Column Board Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1 items-start">
              {kanbanColumns.map((col) => {
                const columnIssues = filteredIssues.filter((i) => {
                  if (currentProject.template === 'Scrum' && i.sprintId !== activeSprint?.id) {
                    return false;
                  }
                  return i.status === col.name;
                });

                const isOverWip = col.wipLimit > 0 && columnIssues.length > col.wipLimit;

                return (
                  <div
                    key={col.id}
                    className={`bg-stone-100/70 border rounded-xl p-3 flex flex-col max-h-[calc(100vh-14rem)] ${
                      isOverWip ? 'border-amber-400 bg-amber-50/20' : 'border-stone-200'
                    }`}
                  >
                    {/* Column Header & WIP Limit */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs uppercase tracking-wider text-stone-700">
                          {col.name}
                        </span>
                        <span className="w-5 h-5 rounded-full bg-white border border-stone-200 text-[10px] font-bold flex items-center justify-center text-stone-600">
                          {columnIssues.length}
                        </span>
                      </div>

                      {/* WIP Limit Indicator / Config */}
                      <div className="flex items-center gap-1 text-[10px] font-mono text-stone-400">
                        <span>WIP:</span>
                        <input
                          type="number"
                          min="0"
                          value={col.wipLimit}
                          onChange={(e) => updateColumnWipLimit(col.id, e.target.value)}
                          className="w-8 bg-white border border-stone-200 rounded text-center text-stone-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* WIP Warning Banner */}
                    {isOverWip && (
                      <div className="p-1.5 bg-amber-100/70 border border-amber-300 text-amber-800 rounded text-[10px] flex items-center gap-1 mb-2">
                        <AlertTriangle size={12} className="shrink-0" />
                        <span>WIP limit exceeded ({columnIssues.length}/{col.wipLimit})</span>
                      </div>
                    )}

                    {/* Cards Container */}
                    <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                      {columnIssues.map((iss) => (
                        <div
                          key={iss.id}
                          className="bg-white border border-stone-200/80 rounded-lg p-3 shadow-2xs hover:border-indigo-600 transition-colors space-y-2"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono font-bold text-indigo-700">{iss.key}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded font-bold ${
                                iss.priority === 'Highest'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {iss.priority}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-stone-800 leading-snug">
                            {iss.title}
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100">
                            <span className="text-stone-400 text-[10px] font-medium">{iss.assignee}</span>

                            {/* Transition Dropdown */}
                            <select
                              value={iss.status}
                              onChange={(e) => transitionIssue(iss.id, e.target.value)}
                              className="bg-stone-50 border border-stone-200 rounded text-[10px] font-bold py-0.5 px-1 text-stone-700 cursor-pointer focus:outline-none"
                            >
                              {kanbanColumns.map((c) => (
                                <option key={c.id} value={c.name}>
                                  → {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- 3. BACKLOG TAB (Sprint Planning) ---------------- */}
        {activeTab === 'backlog' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div>
                <h2 className="text-base font-bold">Sprint Planning & Product Backlog</h2>
                <p className="text-xs text-stone-500">Plan sprints, assign story points, and commit backlog cards.</p>
              </div>
              <button
                type="button"
                onClick={() => createSprint(currentProject.key)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-bold rounded-lg cursor-pointer"
              >
                + Create Sprint
              </button>
            </div>

            {/* Sprints Buckets */}
            {projectSprints.map((sprint) => {
              const sprintIssues = projectIssues.filter((i) => i.sprintId === sprint.id);

              return (
                <div key={sprint.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{sprint.name}</span>
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        {sprint.status}
                      </span>
                    </div>

                    {sprint.status === 'future' && (
                      <button
                        type="button"
                        onClick={() => startSprint(sprint.id)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Play size={12} />
                        <span>Start Sprint</span>
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-stone-100 border border-stone-100 rounded-lg">
                    {sprintIssues.length > 0 ? (
                      sprintIssues.map((iss) => (
                        <div key={iss.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-stone-50">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-600 w-16">{iss.key}</span>
                            <span className="font-semibold text-stone-800">{iss.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] bg-stone-100 px-1.5 py-0.5 rounded">
                              {iss.storyPoints} pts
                            </span>
                            <button
                              type="button"
                              onClick={() => moveIssueToSprint(iss.id, null)}
                              className="text-[10px] text-stone-400 hover:text-stone-700 underline"
                            >
                              Move to Backlog
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-stone-400">
                        No issues assigned to this sprint. Move items from product backlog below.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* General Backlog Bucket */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-3">
              <span className="font-bold text-sm block">Product Backlog ({projectIssues.filter((i) => !i.sprintId).length} issues)</span>
              <div className="divide-y divide-stone-100 border border-stone-100 rounded-lg">
                {projectIssues
                  .filter((i) => !i.sprintId)
                  .map((iss) => (
                    <div key={iss.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-stone-50">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-600 w-16">{iss.key}</span>
                        <span className="font-semibold text-stone-800">{iss.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          onChange={(e) => moveIssueToSprint(iss.id, e.target.value)}
                          className="bg-stone-50 border border-stone-200 text-[11px] rounded px-1.5 py-0.5 cursor-pointer"
                        >
                          <option value="">Move to Sprint...</option>
                          {projectSprints.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 4. ISSUES TAB ---------------- */}
        {activeTab === 'issues' && (
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-5 py-3">Key</th>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Assignee</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredIssues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-700">{iss.key}</td>
                    <td className="px-5 py-3.5 font-semibold text-stone-900">{iss.title}</td>
                    <td className="px-5 py-3.5">{iss.type}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-stone-200 bg-stone-100 text-stone-700">
                        {iss.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">{iss.priority}</td>
                    <td className="px-5 py-3.5">{iss.assignee}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => deleteIssue(iss.id)}
                        className="text-stone-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------------- 5. TIMELINE / ROADMAP TAB ---------------- */}
        {activeTab === 'timeline' && (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm">Gantt-Style Issue Schedule</h3>
            <div className="space-y-3">
              {projectIssues.map((iss, index) => (
                <div key={iss.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-mono text-[10px] text-stone-400">
                    <span className="font-bold text-stone-700">{iss.key}: {iss.title}</span>
                    <span>Due: {iss.dueDate}</span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (index + 2) * 20)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 6. CALENDAR TAB ---------------- */}
        {activeTab === 'calendar' && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm">Upcoming Milestone Deadlines</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {projectIssues.map((iss) => (
                <div key={iss.id} className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <div className="font-mono text-[10px] font-bold text-indigo-700">{iss.dueDate}</div>
                  <div className="font-bold text-stone-800">{iss.key}</div>
                  <div className="text-[11px] text-stone-500 truncate">{iss.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 7. REPORTS TAB ---------------- */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-sm">Sprint Velocity & Burn-Down</h3>
              <div className="text-xs text-stone-500">
                Commitment: <strong>{projectIssues.reduce((a, c) => a + c.storyPoints, 0)} Story Points</strong>
              </div>
              <div className="w-full bg-stone-100 h-4 rounded-full overflow-hidden flex">
                <div
                  className="bg-indigo-600 h-full"
                  style={{
                    width: `${
                      (projectIssues.filter((i) => i.status === 'Done').reduce((a, c) => a + c.storyPoints, 0) /
                        (projectIssues.reduce((a, c) => a + c.storyPoints, 0) || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-sm">Kanban Cycle Time</h3>
              <p className="text-xs text-stone-500">
                Average throughput across columns: <strong>2.4 days/issue</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ---------------- 8. RELEASES TAB ---------------- */}
        {activeTab === 'releases' && (
          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Version Name</th>
                    <th className="px-5 py-3">Description</th>
                    <th className="px-5 py-3">Target Release Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {releases
                    .filter((r) => r.projectKey === currentProject.key)
                    .map((rel) => (
                      <tr key={rel.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-stone-900">{rel.name}</td>
                        <td className="px-5 py-3.5 text-stone-500">{rel.description}</td>
                        <td className="px-5 py-3.5 font-mono text-[11px]">{rel.releaseDate}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                              rel.status === 'Released'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {rel.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => toggleReleaseStatus(rel.id)}
                            className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- 9. SETTINGS TAB ---------------- */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs max-w-xl space-y-4 text-xs">
            <h3 className="font-bold text-sm">Project Workspace Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-stone-500 uppercase text-[10px]">Project Name</label>
                <input
                  type="text"
                  disabled
                  value={currentProject.name}
                  className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-stone-700 mt-1"
                />
              </div>
              <div>
                <label className="font-bold text-stone-500 uppercase text-[10px]">Project Key</label>
                <input
                  type="text"
                  disabled
                  value={currentProject.key}
                  className="w-full bg-stone-50 border border-stone-200 rounded p-2 font-mono text-stone-700 mt-1"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: CREATE ISSUE ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Create New Issue ({currentProject.key})</h3>
            <form onSubmit={handleCreateIssueSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Integrate WebSocket updates"
                  value={newIssueForm.title}
                  onChange={(e) => setNewIssueForm({ ...newIssueForm, title: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Type</label>
                  <select
                    value={newIssueForm.type}
                    onChange={(e) => setNewIssueForm({ ...newIssueForm, type: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2"
                  >
                    <option value="Story">Story</option>
                    <option value="Task">Task</option>
                    <option value="Bug">Bug</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Priority</label>
                  <select
                    value={newIssueForm.priority}
                    onChange={(e) => setNewIssueForm({ ...newIssueForm, priority: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2"
                  >
                    <option value="Highest">Highest</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Story Points</label>
                <input
                  type="number"
                  min="1"
                  value={newIssueForm.storyPoints}
                  onChange={(e) => setNewIssueForm({ ...newIssueForm, storyPoints: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 border border-stone-200 rounded-lg text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold cursor-pointer"
                >
                  Create Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}