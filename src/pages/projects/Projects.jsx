import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';

export default function ProjectList() {
  const { projects, tasks, createProject, updateProject, deleteProject } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});

  // Active Dropdown Action Menu
  const [activeMenuId, setActiveMenuId] = useState(null);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({ name: project.name, description: project.description });
    setFormErrors({});
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Project name is required.';
    else if (formData.name.trim().length < 3) errs.name = 'Project name must be at least 3 characters.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      createProject(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      deleteProject(projectId);
      setActiveMenuId(null);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6 font-sans">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Your Projects</h1>
          <p className="text-xs text-stone-500 mt-1">
            Organize workloads, task deadlines, and team objectives.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer w-fit"
        >
          <Plus size={15} />
          <span>New Project</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const projectTaskCount = tasks.filter((t) => t.projectId === project.id).length;
            const completedCount = tasks.filter(
              (t) => t.projectId === project.id && t.status === 'Completed'
            ).length;

            return (
              <div
                key={project.id}
                className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="font-bold text-sm text-stone-900 hover:text-indigo-600 tracking-tight transition-colors"
                    >
                      {project.name}
                    </Link>

                    {/* Context Action Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === project.id ? null : project.id)
                        }
                        className="text-stone-400 hover:text-stone-700 p-1 rounded-md cursor-pointer"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {activeMenuId === project.id && (
                        <div className="absolute right-0 top-6 w-32 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-20 text-xs animate-in fade-in duration-100">
                          <button
                            type="button"
                            onClick={() => openEditModal(project)}
                            className="w-full px-3 py-1.5 flex items-center gap-2 text-stone-700 hover:bg-stone-50 cursor-pointer text-left"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(project.id)}
                            className="w-full px-3 py-1.5 flex items-center gap-2 text-rose-600 hover:bg-rose-50 cursor-pointer text-left"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>
                      {completedCount}/{projectTaskCount} Tasks
                    </span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white border border-stone-200 rounded-2xl p-8 space-y-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-xs">
            <Layers size={22} />
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            {searchQuery ? 'No matching projects found' : 'No projects created yet'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search criteria to locate your project.'
              : 'Create your first project workspace to begin logging tasks and managing issues.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Create First Project</span>
            </button>
          )}
        </div>
      )}

      {/* Project Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                setFormErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Infrastructure Modernization"
              className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
            />
            {formErrors.name && <p className="text-[11px] text-red-600">{formErrors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Detail the scope and goals for this project..."
              className="w-full p-3 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}