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
        <div className="min-h-screen flex bg-background">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <DashboardHeader title={title} subtitle={subtitle} />
                <div>{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
