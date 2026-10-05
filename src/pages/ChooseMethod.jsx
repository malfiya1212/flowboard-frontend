import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Kanban, ListTree, ArrowRight } from 'lucide-react';

export default function ChooseMethod() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 font-sans text-stone-900">
      <div className="max-w-3xl w-full">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 mb-2">
            Choose your workspace type
          </h1>
          <p className="text-stone-500">
            Select the methodology that best fits your team's workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* SCRUM CARD */}
          <button
            onClick={() => navigate('/scrum-dashboard')}
            className="group relative flex flex-col items-start p-8 bg-white border border-stone-200 rounded-2xl text-left transition-all hover:border-indigo-600 hover:shadow-md cursor-pointer"
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ListTree size={24} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-stone-900">Scrum Framework</h2>
            <p className="text-sm text-stone-500 mb-6 flex-grow">
              Work in structured, time-boxed sprints. Best for teams that plan work in distinct iterations and require backlog grooming.
            </p>
            <div className="flex items-center text-sm font-semibold text-indigo-600">
              Select Scrum <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* KANBAN CARD */}
          <button
            onClick={() => navigate('/kanban-dashboard')}
            className="group relative flex flex-col items-start p-8 bg-white border border-stone-200 rounded-2xl text-left transition-all hover:border-indigo-600 hover:shadow-md cursor-pointer"
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Kanban size={24} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-stone-900">Kanban Board</h2>
            <p className="text-sm text-stone-500 mb-6 flex-grow">
              A continuous flow of work. Best for IT support, operations, or teams that require flexible, ongoing task management.
            </p>
            <div className="flex items-center text-sm font-semibold text-indigo-600">
              Select Kanban <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}