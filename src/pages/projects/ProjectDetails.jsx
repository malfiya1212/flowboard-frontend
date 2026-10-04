import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, createTask, updateTask, deleteTask } = useData();

  // Find authorized project
  const project = projects.find((p) => p.id === id);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '',
  });
  const [formErrors, setFormErrors] = useState({});

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-stone-100 text-stone-500 rounded-xl flex items-center justify-center mx-auto">
          <AlertCircle size={22} />
        </div>
        <h2 className="text-base font-bold text-stone-900">Project Not Found</h2>
        <p className="text-xs text-stone-500">
          This project does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  // Task filtering
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const filteredTasks = projectTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openCreateModal = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!taskForm.title.trim()) errs.title = 'Task title is required.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingTask) {
      updateTask(editingTask.id, taskForm);
    } else {
      createTask({
        projectId: project.id,
        ...taskForm,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6 font-sans">
      {/* Back button & Project Header */}
      <div className="space-y-3 pb-5 border-b border-stone-200">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>All Projects</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">{project.name}</h1>
            <p className="text-xs text-stone-500 mt-1">{project.description || 'No description'}</p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer w-fit shrink-0"
          >
            <Plus size={15} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-stone-200 p-3 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="text-[11px] font-bold uppercase text-stone-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="text-[11px] font-bold uppercase text-stone-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Table */}
      {filteredTasks.length > 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="divide-y divide-stone-100">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-stone-900 tracking-tight">
                      {task.title}
                    </h3>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.description && (
                    <p className="text-xs text-stone-500 line-clamp-2">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-[11px] text-stone-400 pt-0.5">
                      <Clock size={12} />
                      <span>Due: {task.dueDate}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <div className="flex items-center gap-1 border-l border-stone-200 pl-3">
                    <button
                      type="button"
                      onClick={() => openEditModal(task)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white border border-stone-200 rounded-2xl p-8 space-y-3">
          <div className="w-12 h-12 bg-stone-100 text-stone-500 rounded-xl flex items-center justify-center mx-auto">
            <CheckCircle2 size={22} />
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'No matching tasks'
              : 'No tasks created yet'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'Try adjusting your search criteria or clearing active filters.'
              : 'Add your first task to plan out steps and milestones for this project.'}
          </p>
          {!searchQuery && statusFilter === 'All' && priorityFilter === 'All' && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Create First Task</span>
            </button>
          )}
        </div>
      )}

      {/* Task Creation / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
              Task Title *
            </label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => {
                setTaskForm((prev) => ({ ...prev, title: e.target.value }));
                setFormErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Implement refresh token rotation"
              className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
            />
            {formErrors.title && <p className="text-[11px] text-red-600">{formErrors.title}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Details, steps, or acceptance criteria..."
              className="w-full p-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                Status
              </label>
              <select
                value={taskForm.status}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full h-10 px-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))}
                className="w-full h-10 px-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full h-10 px-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              {editingTask ? 'Save Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}