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
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] font-sans text-stone-900 overflow-hidden">

      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={toggleMobileSidebar}
        isSidebarOpen={isMobileSidebarOpen}
      />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 relative min-h-[calc(100vh-3.5rem)] overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#fafaf9] overflow-y-auto">
          {/* Removed flex-1 here so content flows and scrolls correctly */}
          <main className="w-full box-border">
            <Outlet />
          </main>
        </div>

      </div>
    </div>
  );
};

export default MainLayout;