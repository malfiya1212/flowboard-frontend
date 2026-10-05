import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function CreateIssueModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    type: 'Story',
    summary: '',
    description: '',
    epic: '',
    assignee: '',
    priority: 'Medium',
    storyPoints: '',
    sprint: '',
    labels: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Connect to POST /api/issues
    setTimeout(() => {
      setLoading(false);
      onSubmit(formData);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 font-sans antialiased">
      <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">Create Issue</h2>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors rounded-lg p-1 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form id="create-issue-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Issue Type *</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="Story">Story</option>
                  <option value="Task">Task</option>
                  <option value="Bug">Bug</option>
                  <option value="Epic">Epic</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Project Sprint</label>
                <select 
                  name="sprint" 
                  value={formData.sprint} 
                  onChange={handleChange}
                  className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="">Add to Backlog</option>
                  <option value="Sprint 1">Sprint 1</option>
                  <option value="Sprint 2">Sprint 2</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Summary *</label>
              <input 
                type="text" 
                name="summary" 
                required
                placeholder="Briefly describe the issue..."
                value={formData.summary} 
                onChange={handleChange}
                className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Description</label>
              <textarea 
                name="description" 
                rows="4"
                placeholder="Provide detailed context, acceptance criteria, or steps to reproduce..."
                value={formData.description} 
                onChange={handleChange}
                className="w-full p-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Assignee</label>
                <select 
                  name="assignee" 
                  value={formData.assignee} 
                  onChange={handleChange}
                  className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="">Unassigned</option>
                  <option value="Malefiya">Malefiya</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Epic Link</label>
                <select 
                  name="epic" 
                  value={formData.epic} 
                  onChange={handleChange}
                  className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="">None</option>
                  <option value="Authentication">Authentication</option>
                  <option value="Dashboard UI">Dashboard UI</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Priority</label>
                <select 
                  name="priority" 
                  value={formData.priority} 
                  onChange={handleChange}
                  className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="Highest">Highest</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Lowest">Lowest</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Story Points</label>
                <select 
                  name="storyPoints" 
                  value={formData.storyPoints} 
                  onChange={handleChange}
                  className="w-full h-9 px-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="">-</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="13">13</option>
                  <option value="21">21</option>
                </select>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50 rounded-b-xl">
          <button 
            type="button" 
            onClick={onClose}
            className="h-9 px-4 bg-white border border-stone-200 text-stone-700 rounded-lg text-sm font-semibold hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="create-issue-form"
            disabled={loading}
            className="h-9 px-5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Issue'}
          </button>
        </div>

      </div>
    </div>
  );
}