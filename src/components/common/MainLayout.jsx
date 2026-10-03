import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[rgba(220, 236, 251, 0.87)] font-sans text-[#0A0A0B]">

      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={toggleMobileSidebar}
        isSidebarOpen={isMobileSidebarOpen}
      />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 relative min-h-[calc(100vh-3.5rem)]">

        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-[rgb(1, 14, 20)] overflow-y-auto">

          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto box-border">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};

export default MainLayout;