import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex relative" style={{ background: 'rgb(244, 248, 254)' }}>
      {/* Sidebar Wrapper with mobile slide-in/out animation */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out w-60 h-full flex-shrink-0`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Mobile Sidebar Overlay Backdrop with soft blur */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Content Area: adjusts margin on desktop, full-width on mobile */}
      <main className="flex-1 lg:pl-60 p-4 sm:p-8 overflow-x-hidden min-w-0 flex flex-col">
        <DashboardHeader 
          title={title} 
          subtitle={subtitle} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        <div className="animate-fade-in flex-1">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
