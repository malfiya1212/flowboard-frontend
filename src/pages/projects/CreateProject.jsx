import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Kanban, ArrowRight } from 'lucide-react';

export default function CreateProject() {
  const navigate = useNavigate();
  const location = useLocation();
  const methodology = location.state?.methodology || 'Scrum';

  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('FB');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    // Save project metadata to session/localStorage
    localStorage.setItem('flowboard_project', JSON.stringify({ name: projectName, key: projectKey, methodology }));

    if (methodology === 'Kanban') {
      navigate('/kanban-dashboard');
    } else {
      navigate('/scrum-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-900">
      <div className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-8 shadow-xs">
        
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs">
            <Kanban size={18} strokeWidth={2.4} />
          </div>
          <div>
            <span className="font-bold text-lg text-stone-900 tracking-tight leading-none block">FlowBoard</span>
            <span className="text-[10px] text-stone-400 font-medium">Step 2: Initialize Project</span>
          </div>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-stone-900 mb-1">
          Create your {methodology} project
        </h1>
        <p className="text-xs text-stone-500 mb-6">
          Give your project a name and unique key to start tracking issues.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Project Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Alpha Core Engine"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                // Auto-generate project key initials
                const initials = e.target.value.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3);
                if (initials) setProjectKey(initials);
              }}
              className="w-full h-10 px-3 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Project Key *</label>
            <input 
              type="text" 
              required
              value={projectKey}
              onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
              className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold text-stone-700 focus:outline-none"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">Used as a prefix for all issue IDs (e.g., FB-101).</span>
          </div>

          <button 
            type="submit"
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>Proceed to Workspace</span>
            <ArrowRight size={14} />
          </button>
        </form>

      </div>
    </div>
  );
}