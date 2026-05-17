import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(40 20% 97%)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-8 overflow-auto">
        <DashboardHeader title={title} subtitle={subtitle} />
        <div className="animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
