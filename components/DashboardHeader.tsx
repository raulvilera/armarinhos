import React, { useState } from "react";
import { Search, Bell, ChevronDown, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <header className="mb-8 flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-500 mb-1 capitalize">{dateStr}</p>
        <h2 className="text-3xl font-bold tracking-tight text-stone-900 leading-none">{title}</h2>
        {subtitle && <p className="text-stone-400 text-sm font-medium mt-1.5">{subtitle}</p>}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Buscar..."
            className="bg-white border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 w-56 text-sm font-medium focus:outline-none focus:ring-2 transition-all placeholder:text-stone-300 shadow-sm"
            style={{ '--tw-ring-color': 'rgba(59, 130, 246, 0.25)' } as any}
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 bg-white border border-stone-200 rounded-xl flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-all shadow-sm">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 bg-white border border-stone-200 rounded-xl px-3 py-1.5 shadow-sm cursor-pointer hover:bg-stone-50 transition-all">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 border-t border-white/20 shadow-md"
            style={{ background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)' }}>
            MS
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-[12px] font-semibold text-stone-800">Maria S.</p>
          </div>
          <ChevronDown className="w-3 h-3 text-stone-400" />
        </div>

        {/* View store button */}
        <button onClick={() => navigate('/')}
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] text-white font-bold transition-all hover:opacity-95 border-b border-black/15 border-t border-white/30"
          style={{ 
            background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
            boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.25)' 
          }}>
          <Store className="w-3.5 h-3.5" />
          Ver Loja
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
