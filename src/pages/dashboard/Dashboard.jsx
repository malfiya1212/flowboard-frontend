import {
  FolderKanban,
  CheckSquare,
  Clock3,
  CircleCheck,
  Plus,
  ArrowRight,
  MoreHorizontal,
  LayoutDashboard,
  KanbanSquare,
  ListTodo,
  Zap,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "My Projects",
      value: "5",
      description: "2 active workspaces",
      icon: FolderKanban,
    },
    {
      title: "Open Issues",
      value: "24",
      description: "Across all projects",
      icon: CheckSquare,
    },
    {
      title: "Assigned to Me",
      value: "8",
      description: "Require your action",
      icon: Clock3,
    },
    {
      title: "Completed",
      value: "31",
      description: "This sprint",
      icon: CircleCheck,
    },
  ];

  const tasks = [
    {
      key: "FLW-101",
      title: "Fix login authentication",
      project: "FlowBoard",
      status: "To Do",
      priority: "High",
    },
    {
      key: "FLW-102",
      title: "Build dashboard interface",
      project: "FlowBoard",
      status: "In Progress",
      priority: "Highest",
    },
    {
      key: "FLW-103",
      title: "Create REST API",
      project: "Backend",
      status: "In Review",
      priority: "Medium",
    },
    {
      key: "FLW-104",
      title: "Write authentication tests",
      project: "FlowBoard",
      status: "Done",
      priority: "Low",
    },
  ];

  const projects = [
    {
      key: "FLW",
      name: "FlowBoard",
      type: "Software",
      issues: 12,
    },
    {
      key: "MOB",
      name: "Mobile Client",
      type: "Mobile",
      issues: 8,
    },
    {
      key: "API",
      name: "Core Backend",
      type: "Backend",
      issues: 11,
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-50 text-green-700";
      case "In Progress":
        return "bg-blue-50 text-blue-700";
      case "In Review":
        return "bg-purple-50 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Highest":
        return "text-red-600";
      case "High":
        return "text-orange-600";
      case "Medium":
        return "text-yellow-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f5f7] text-gray-900">
      {/* SIDEBAR */}
      <aside className="hidden w-64 shrink-0 bg-[#172b4d] text-white lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0c66e4] font-bold">
            F
          </div>

          <span className="ml-3 text-lg font-bold tracking-tight">
            FlowBoard
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <div className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium">
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
              <FolderKanban size={18} />
              Projects
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
              <ListTodo size={18} />
              My Work
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
              <KanbanSquare size={18} />
              Kanban Board
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
              <Zap size={18} />
              Scrum Board
            </button>
          </div>

          <p className="px-3 pb-2 pt-7 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Manage
          </p>

          <div className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
              <BarChart3 size={18} />
              Reports
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
              <Settings size={18} />
              Settings
            </button>
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0c66e4] text-sm font-semibold">
              MA
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Malefiya</p>

              <p className="truncate text-xs text-gray-400">
                Software Engineer
              </p>
            </div>

            <button className="text-gray-400 hover:text-white">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="min-w-0 flex-1">
        {/* TOP BAR */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          {/* Search */}
          <div className="relative hidden w-full max-w-md md:block">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search projects, issues..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#0c66e4] focus:bg-white"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Create */}
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#0c66e4] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0052cc]">
              <Plus size={17} />
              <span className="hidden sm:inline">Create issue</span>
            </button>

            {/* Notification */}
            <button className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
              <Bell size={19} />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#172b4d] text-xs font-semibold text-white">
                MA
              </div>

              <ChevronDown
                size={16}
                className="hidden text-gray-400 sm:block"
              />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-6">
            <p className="text-sm font-medium text-[#0c66e4]">Workspace</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172b4d]">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Overview of your projects, issues and current work.
            </p>
          </div>

          {/* STATISTICS */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </p>

                      <p className="mt-2 text-3xl font-bold tracking-tight text-[#172b4d]">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {stat.description}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e9f2ff] text-[#0c66e4]">
                      <Icon size={19} />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* MAIN GRID */}
          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* MY WORK */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-[#172b4d]">
                    My Work
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Issues currently assigned to you
                  </p>
                </div>

                <button className="text-sm font-semibold text-[#0c66e4] hover:underline">
                  View all
                </button>
              </div>

              <div>
                {tasks.map((task) => (
                  <div
                    key={task.key}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 transition last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f2f4] text-xs font-bold text-gray-600">
                        {task.key.split("-")[1]}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#172b4d]">
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {task.key} · {task.project}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`hidden text-xs font-semibold sm:inline ${getPriorityStyle(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>

                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>

                      <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <MoreHorizontal size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROJECTS */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-[#172b4d]">
                    Recent Projects
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Your active workspaces
                  </p>
                </div>

                <button className="text-sm font-semibold text-[#0c66e4] hover:underline">
                  View all
                </button>
              </div>

              <div className="p-3">
                {projects.map((project) => (
                  <button
                    key={project.key}
                    className="group flex w-full items-center justify-between rounded-lg p-3 text-left transition hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e9f2ff] text-xs font-bold text-[#0c66e4]">
                        {project.key}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#172b4d]">
                          {project.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {project.type} · {project.issues} issues
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-500"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ACTIVE SPRINT */}
          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    Active Sprint
                  </span>
                </div>

                <h2 className="mt-2 text-lg font-bold text-[#94B1E4]">
                  Sprint 12
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  8 days remaining · 42 of 50 story points completed
                </p>
              </div>

              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Open board
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#0c66e4]"
                style={{ width: "84%" }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>84%</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;