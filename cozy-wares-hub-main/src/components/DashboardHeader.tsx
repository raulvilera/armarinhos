import { Search, Bell } from "lucide-react";
import { useState } from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground font-medium">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
            placeholder="Pesquisar pedidos, itens..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="relative p-2.5 bg-card rounded-xl text-muted-foreground shadow-sm hover:shadow-md transition-all border border-border">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
        </button>
        <div className="h-8 w-px bg-border"></div>
        <div className="flex items-center gap-3 bg-card px-3 py-1.5 rounded-full shadow-sm border border-border">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            MS
          </div>
          <span className="font-bold text-sm">Maria S.</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
