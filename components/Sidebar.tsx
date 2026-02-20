import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    Package,
    ShoppingCart,
    Users,
    Landmark,
    Settings,
    MessageCircle,
    LayoutDashboard,
    Wrench,
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
    { icon: LayoutDashboard, label: "Início", path: "/dashboard" },
    { icon: Package, label: "Produtos", path: "/catalogo" },
    { icon: ShoppingCart, label: "Vendas", path: "/pos" },
    { icon: Users, label: "Clientes", path: "/clientes" },
    { icon: Landmark, label: "Financeiro", path: "/financeiro" },
    { icon: Settings, label: "Ajustes", path: "/ajustes" },
];

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <aside className="w-64 bg-sidebar-bg flex flex-col fixed h-full z-10 border-r border-sidebar-border">
            {/* Logo */}
            <div className="p-8 pb-4 flex items-center gap-3">
                <div className="bg-primary rounded-xl p-2.5 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tight text-white leading-none">
                        ArmaSaaS
                    </h1>
                    <p className="text-[10px] uppercase font-black tracking-widest text-sidebar-fg/60 mt-1">
                        RETROSARIA DIGITAL
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 mt-8 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-sm",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-sidebar-fg hover:bg-sidebar-accent hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-sidebar-fg")} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Support Card */}
            <div className="p-4 mt-auto">
                <div className="bg-sidebar-accent/30 rounded-[1.5rem] p-5 border border-white/5">
                    <p className="text-sm font-black text-primary mb-1">Suporte Premium</p>
                    <p className="text-[11px] text-sidebar-fg/70 mb-4 leading-normal">
                        Dúvidas sobre o sistema? Fale conosco.
                    </p>
                    <button className="w-full bg-primary/20 text-primary hover:bg-primary hover:text-white text-xs font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                        Abrir Ajuda
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
