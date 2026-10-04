import React, { useState } from 'react';

export default function Tooltip({ children, content, position = 'bottom' }) {
  const [isVisible, setIsVisible] = useState(false);

  // Position variants
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div 
          role="tooltip"
          className={`absolute ${positionClasses[position]} z-50 pointer-events-none px-2.5 py-1 text-[11px] font-medium text-white bg-stone-900 rounded-md shadow-md whitespace-nowrap transition-all duration-150 animate-in fade-in zoom-in-95`}
        >
          {content}
        </div>
      )}
    </div>
  );
}