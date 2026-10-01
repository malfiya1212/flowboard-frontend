import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  ListTodo,
  CalendarDays,
  CheckSquare,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Settings,
  UserRound,
  CircleHelp,
} from 'lucide-react';

const navGroups = [
  {
    title: 'Workspace',
    items: [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
      {
        path: '/projects',
        label: 'Projects',
        icon: FolderKanban,
        badge: '5',
      },
      {
        path: '/issues',
        label: 'My Work',
        icon: CheckSquare,
        badge: '8',
      },
    ],
  },

  {
    title: 'Planning',
    items: [
      {
        path: '/scrum',
        label: 'Scrum Board',
        icon: Layers,
      },
      {
        path: '/scrum/backlog',
        label: 'Backlog',
        icon: ListTodo,
      },
      {
        path: '/scrum/sprints',
        label: 'Sprints',
        icon: CalendarDays,
      },
    ],
  },

  {
    title: 'Insights',
    items: [
      {
        path: '/reports',
        label: 'Reports',
        icon: BarChart3,
      },
      {
        path: '/users',
        label: 'Team',
        icon: Users,
      },
    ],
  },
];

const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed md:sticky
          top-0 md:top-0
          left-0
          h-screen
          flex flex-col
          z-50

          bg-[#111827]
          text-white

          transition-all duration-300 ease-in-out

          ${isCollapsed ? 'w-[76px]' : 'w-[250px]'}

          ${
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'
          }
        `}
      >
        {/* =========================================
            BRAND
        ========================================== */}
        <div
          className={`
            h-[72px]
            px-5
            flex items-center
            border-b border-white/10
            ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo */}
            <div
              className="
                w-9 h-9
                shrink-0
                rounded-xl
                bg-indigo-600
                flex items-center justify-center
                shadow-lg shadow-indigo-600/20
              "
            >
              <span className="text-white font-bold text-sm">
                F
              </span>
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-[16px] font-bold tracking-tight">
                  FlowBoard
                </h1>

                <p className="text-[10px] text-gray-400 mt-0.5">
                  Software Project
                </p>
              </div>
            )}
          </div>

          {/* Collapse button */}
          <button
            onClick={onToggleCollapse}
            className="
              hidden md:flex
              w-7 h-7
              rounded-lg
              items-center
              justify-center
              text-gray-400
              hover:text-white
              hover:bg-white/10
              transition
            "
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* =========================================
            PROJECT SELECTOR
        ========================================== */}
        {!isCollapsed && (
          <div className="px-4 pt-5">
            <div
              className="
                flex items-center gap-3
                px-3 py-3
                rounded-xl
                bg-white/[0.06]
                border border-white/[0.08]
              "
            >
              <div
                className="
                  w-8 h-8
                  rounded-lg
                  bg-indigo-500/20
                  text-indigo-300
                  flex items-center justify-center
                  font-bold text-xs
                "
              >
                FLW
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  FlowBoard
                </p>

                <p className="text-[10px] text-gray-500 truncate">
                  Active project
                </p>
              </div>

              <ChevronRight
                size={14}
                className="text-gray-500"
              />
            </div>
          </div>
        )}

        {/* =========================================
            NAVIGATION
        ========================================== */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <div className="space-y-7">
            {navGroups.map((group) => (
              <div key={group.title}>
                {!isCollapsed && (
                  <div
                    className="
                      px-3 mb-2
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-gray-500
                    "
                  >
                    {group.title}
                  </div>
                )}

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/scrum'}
                        onClick={onCloseMobile}
                        title={
                          isCollapsed
                            ? item.label
                            : undefined
                        }
                        className={({ isActive }) =>
                          `
                          group
                          relative
                          flex items-center
                          gap-3
                          min-h-[42px]
                          px-3
                          rounded-lg
                          transition-all duration-200

                          ${
                            isActive
                              ? `
                                bg-indigo-600
                                text-white
                                shadow-lg
                                shadow-indigo-900/20
                              `
                              : `
                                text-gray-400
                                hover:text-white
                                hover:bg-white/[0.06]
                              `
                          }

                          ${isCollapsed ? 'justify-center' : ''}
                          `
                        }
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.8}
                          className="shrink-0"
                        />

                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-[13px] font-medium">
                              {item.label}
                            </span>

                            {item.badge && (
                              <span
                                className="
                                  min-w-[20px]
                                  h-5
                                  px-1.5
                                  rounded-full
                                  flex items-center justify-center
                                  text-[10px]
                                  font-semibold
                                  bg-white/10
                                  text-gray-300
                                "
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* =========================================
            BOTTOM ACTIONS
        ========================================== */}
        <div className="px-3 pb-3">
          <div className="space-y-1">
            <NavLink
              to="/projects/settings"
              title={isCollapsed ? 'Settings' : undefined}
              className={({ isActive }) =>
                `
                flex items-center
                gap-3
                min-h-[42px]
                px-3
                rounded-lg
                transition

                ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }

                ${isCollapsed ? 'justify-center' : ''}
                `
              }
            >
              <Settings size={18} strokeWidth={1.8} />

              {!isCollapsed && (
                <span className="text-[13px] font-medium">
                  Settings
                </span>
              )}
            </NavLink>

            <button
              className={`
                w-full
                flex items-center
                gap-3
                min-h-[42px]
                px-3
                rounded-lg
                text-gray-400
                hover:text-white
                hover:bg-white/[0.06]
                transition
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? 'Help' : undefined}
            >
              <CircleHelp size={18} strokeWidth={1.8} />

              {!isCollapsed && (
                <span className="text-[13px] font-medium">
                  Help & Support
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =========================================
            USER PROFILE
        ========================================== */}
        <div
          className="
            border-t border-white/10
            p-3
          "
        >
          <div
            className={`
              flex items-center gap-3
              px-2 py-2
              rounded-xl
              hover:bg-white/[0.05]
              transition
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            {/* Avatar */}
            <div
              className="
                w-9 h-9
                shrink-0
                rounded-full
                bg-indigo-600
                flex items-center justify-center
                text-xs
                font-bold
              "
            >
              MA
            </div>

            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    Malefiya Abebaw
                  </p>

                  <p className="text-[10px] text-gray-500 truncate">
                    Developer
                  </p>
                </div>

                <UserRound
                  size={15}
                  className="text-gray-500"
                />
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;