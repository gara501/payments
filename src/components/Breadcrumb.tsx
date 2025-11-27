import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export const Breadcrumb: React.FC = () => {
  const location = useLocation();

  // Map paths to breadcrumb items
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Always start with home
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/' }
    ];

    // Build breadcrumbs based on path segments
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Map segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-2 py-3 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;

            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {!isFirst && (
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                
                {isLast ? (
                  <span 
                    className="font-semibold text-gray-900"
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-150 font-medium"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
