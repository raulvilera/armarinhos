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
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
    { icon: LayoutDashboard, label: "Painel", path: "/dashboard" },
    { icon: Package, label: "Catálogo", path: "/catalogo" },
    { icon: ShoppingCart, label: "Vendas (PDV)", path: "/pos" },
    { icon: Users, label: "Clientes", path: "/clientes" },
    { icon: Landmark, label: "Financeiro", path: "/financeiro" },
    { icon: Settings, label: "Ajustes", path: "/ajustes" },
    { icon: Landmark, label: "Assinaturas", path: "/assinaturas" },
    { icon: Home, label: "Ver Loja", path: "/" },
];

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <aside className="w-64 gradient-sidebar flex flex-col fixed h-full z-10 border-r border-sidebar-border">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="gradient-primary rounded-xl p-2.5 shadow-glow">
                    <Package className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <h1 className="text-lg font-extrabold tracking-tight text-white">
                        Armarinhos
                    </h1>
                    <p className="text-[10px] uppercase tracking-widest text-sidebar-fg font-bold">
                        Gestão Digital
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 mt-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-sm",
                                isActive
                                    ? "bg-primary/15 text-primary"
                                    : "text-sidebar-fg hover:bg-sidebar-accent hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Support Card */}
            <div className="p-4 mt-auto">
                <div className="gradient-card rounded-2xl p-4 border border-primary/10">
                    <p className="text-xs font-bold text-primary mb-2">Suporte Premium</p>
                    <p className="text-[11px] text-sidebar-fg mb-3 leading-relaxed">
                        Dúvidas sobre o sistema? Fale conosco.
                    </p>
                    <button className="w-full gradient-primary text-primary-foreground text-sm font-bold py-2 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Abrir Chat
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
