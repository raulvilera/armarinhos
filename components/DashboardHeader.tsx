import React from "react";

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
    return (
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
        </header>
    );
};

export default DashboardHeader;
