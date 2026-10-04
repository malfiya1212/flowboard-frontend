import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const routeNameMap = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  settings: 'Settings',
  scrum: 'Scrum Board',
  kanban: 'Kanban Board',
  issues: 'Issues',
  profile: 'Profile',
  'select-board': 'Board Selection',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-1.5 text-xs text-stone-400 font-medium">
      <Link 
        to="/dashboard" 
        className="hover:text-stone-700 transition-colors"
      >
        Workspace
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight size={12} className="text-stone-300 shrink-0" />
            {isLast ? (
              <span className="text-stone-800 font-semibold truncate max-w-[150px]">
                {displayName}
              </span>
            ) : (
              <Link 
                to={routeTo} 
                className="hover:text-stone-700 transition-colors truncate max-w-[120px]"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}