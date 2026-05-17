import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Landmark, Settings, Scissors,
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Início",    path: "/dashboard" },
  { icon: Package,         label: "Produtos",  path: "/catalogo" },
  { icon: ShoppingCart,    label: "Vendas",    path: "/pos" },
  { icon: Users,           label: "Clientes",  path: "/clientes" },
  { icon: Landmark,        label: "Financeiro",path: "/financeiro" },
  { icon: Settings,        label: "Ajustes",   path: "/ajustes" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-60 flex flex-col fixed h-full z-10 admin-sidebar-gradient" style={{ borderRight: '1px solid hsl(215 28% 15%)' }}>

      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, hsl(43 96% 56%), hsl(38 90% 46%))' }}>
          <Scissors className="w-4.5 h-4.5 text-stone-900" />
        </div>
        <div className="leading-none">
          <h1 className="text-[15px] font-bold text-white tracking-tight">ArmaSaaS</h1>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] mt-1" style={{ color: 'hsl(43 70% 65%)' }}>
            Retrosaria Digital
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: 'hsl(215 28% 16%)' }} />

      {/* Section label */}
      <p className="px-5 pt-5 pb-2 text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: 'hsl(215 15% 40%)' }}>
        Menu Principal
      </p>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 text-left",
                isActive
                  ? "text-stone-900 shadow-md"
                  : "hover:bg-white/5"
              )}
              style={isActive ? {
                background: 'linear-gradient(135deg, hsl(43 96% 56% / 0.95), hsl(38 90% 50% / 0.9))',
                color: '#1a1600',
              } : { color: 'hsl(213 18% 60%)' }}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "opacity-80" : "opacity-60")} />
              <span>{item.label}</span>
              {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-stone-900/40" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 space-y-3">
        <div className="p-4 rounded-xl border" style={{ background: 'hsl(215 30% 12%)', borderColor: 'hsl(215 28% 18%)' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold text-stone-900"
              style={{ background: 'linear-gradient(135deg, hsl(43 96% 60%), hsl(38 90% 50%))' }}>
              MS
            </div>
            <div className="leading-none">
              <p className="text-[12px] font-semibold text-white">Maria S.</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'hsl(215 15% 45%)' }}>Administradora</p>
            </div>
          </div>
          <div className="h-px mb-3" style={{ background: 'hsl(215 28% 18%)' }} />
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-semibold transition-all"
            style={{ background: 'hsl(215 28% 16%)', color: 'hsl(213 18% 60%)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'hsl(215 28% 20%)';
              (e.currentTarget as HTMLElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'hsl(215 28% 16%)';
              (e.currentTarget as HTMLElement).style.color = 'hsl(213 18% 60%)';
            }}
          >
            <Scissors className="w-3 h-3" />
            Ver Loja
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
