import React from "react";
import { Search, Bell } from "lucide-react";

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
    return (
        <header className="mb-10 flex justify-between items-start">
            <div>
                <h2 className="text-5xl font-black tracking-tighter text-gray-950 leading-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-gray-400 text-lg font-bold mt-1">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Pesquisar pedidos, itens..."
                        className="bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 w-80 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                </div>

                {/* Notifications */}
                <button className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-3.5 right-3.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <div className="size-11 bg-primary text-white rounded-full flex items-center justify-center font-black text-sm">
                        MS
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-950 leading-none">Maria S.</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
