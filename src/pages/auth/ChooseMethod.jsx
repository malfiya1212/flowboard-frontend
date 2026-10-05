import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KanbanSquare, Layers, Check, ArrowRight, Layout } from 'lucide-react';

const ChooseMethod = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <div className="bg-blue-600 text-white p-1 rounded">
            <Layout size={20} />
          </div>
          FlowBoard
        </div>
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
          Skip to Overview Dashboard &rarr;
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-4 bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-lg leading-none">✨</span> Welcome to FlowBoard
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Choose Project Management Method</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Select the agile methodology that best matches your team's execution and delivery workflow.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* KANBAN CARD (Blue Theme) */}
          <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 shadow-lg shadow-blue-100 flex flex-col relative transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-600 text-white p-3 rounded-xl">
                <KanbanSquare size={24} />
              </div>
              <span className="text-blue-600 text-xs font-bold tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">
                Continuous Flow
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-blue-950 mb-2">Kanban</h2>
            <p className="text-slate-500 text-sm mb-6">
              Focus on visualizing work in progress, minimizing bottlenecks, and optimizing continuous delivery.
            </p>

            {/* Mock Kanban UI */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-[10px] font-bold text-slate-500 text-center bg-white border rounded py-1">TO DO (3)</div>
                <div className="text-[10px] font-bold text-blue-600 text-center bg-blue-50 border border-blue-100 rounded py-1">WIP (2)</div>
                <div className="text-[10px] font-bold text-emerald-600 text-center bg-emerald-50 border border-emerald-100 rounded py-1">DONE (8)</div>
              </div>
              <div className="bg-white border rounded p-2 text-xs text-slate-600 shadow-sm mb-2">FLW-10 Login UI Form</div>
              <div className="bg-white border rounded p-2 text-xs text-slate-600 shadow-sm">FLW-7 REST API Endpoints</div>
            </div>

            {/* Features Checklist */}
            <ul className="space-y-3 mb-8 flex-grow">
              {['Visual board with custom columns & WIP limits', 'Continuous delivery without rigid timebox constraints', 'Best for support, DevOps, operations, & agile teams'].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Navigation Button */}
            <button 
              onClick={() => navigate('/kanban')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors"
            >
              Launch Kanban Dashboard <ArrowRight size={18} />
            </button>
          </div>

          {/* SCRUM CARD (Indigo Theme) */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                <Layers size={24} />
              </div>
              <span className="text-indigo-600 text-xs font-bold tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full">
                Sprints & Velocity
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Scrum</h2>
            <p className="text-slate-500 text-sm mb-6">
              Plan timeboxed sprint cycles, estimate story points, manage product backlogs, and track burndown.
            </p>

            {/* Mock Scrum UI */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <Layers size={12} /> Sprint 1 (Active)
                </div>
                <div className="text-[10px] text-slate-500">28 / 42 pts</div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full w-2/3"></div>
              </div>
              <div className="flex gap-2">
                <div className="bg-white border rounded py-1 px-2 text-[10px] text-slate-600 flex-1 shadow-sm flex items-center gap-1">
                  <Layout size={10} /> Stories: 6
                </div>
                <div className="bg-white border rounded py-1 px-2 text-[10px] text-slate-600 flex-1 shadow-sm flex items-center gap-1">
                  <Layout size={10} /> Burndown: On Track
                </div>
              </div>
            </div>

            {/* Features Checklist */}
            <ul className="space-y-3 mb-8 flex-grow">
              {['Timeboxed Sprints with start/end dates & Sprint Goals', 'Product backlog grooming, story points, & epics', 'Interactive burndown velocity charts & workload metrics'].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Navigation Button */}
            <button 
              onClick={() => navigate('/scrum')}
              className="w-full bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold py-3 rounded-xl flex justify-center items-center gap-2 border border-slate-200 transition-colors"
            >
              Launch Scrum Dashboard <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ChooseMethod;