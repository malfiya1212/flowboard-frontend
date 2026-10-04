import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Kanban, 
  ListTodo, 
  Calendar, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-stone-200 transition-all duration-300
      ${isCollapsed ? 'w-20' : 'w-64'}
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      md:relative
    `}>
      {/* Sidebar Navigation Links (Logo header removed to ensure the site logo is only shown once in the top bar) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <p className="text-[10px] font-bold text-stone-400 tracking-wider px-3 mb-2 uppercase">Workspace</p>
          <nav className="space-y-1">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}
              `}
            >
              <LayoutDashboard size={18} />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}
              `}
            >
              <FolderKanban size={18} />
              {!isCollapsed && <span>Projects</span>}
            </NavLink>
            <NavLink 
              to="/my-work" 
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}
              `}
            >
              <CheckSquare size={18} />
              {!isCollapsed && <span>My Work</span>}
            </NavLink>
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold text-stone-400 tracking-wider px-3 mb-2 uppercase">Planning</p>
          <nav className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 cursor-pointer">
              <Kanban size={18} />
              {!isCollapsed && <span>Scrum Board</span>}
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 cursor-pointer">
              <ListTodo size={18} />
              {!isCollapsed && <span>Backlog</span>}
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 cursor-pointer">
              <Calendar size={18} />
              {!isCollapsed && <span>Sprints</span>}
            </div>
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold text-stone-400 tracking-wider px-3 mb-2 uppercase">Insights</p>
          <nav className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 cursor-pointer">
              <Settings size={18} />
              {!isCollapsed && <span>Settings</span>}
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 cursor-pointer">
              <HelpCircle size={18} />
              {!isCollapsed && <span>Help & Support</span>}
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}