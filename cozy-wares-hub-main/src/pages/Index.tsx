import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import WeeklySalesChart from "@/components/WeeklySalesChart";
import StockAlerts from "@/components/StockAlerts";
import QuickActions from "@/components/QuickActions";
import {
  TrendingUp,
  Receipt,
  UserPlus,
  Package,
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout
      title="Dashboard Lojista"
      subtitle="Bem-vinda de volta, Maria!"
    >
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Vendas Hoje"
          value="R$ 1.250,40"
          icon={<TrendingUp className="w-5 h-5" />}
          change="+12.5%"
          changeLabel="vs ontem"
          positive
        >
          <div className="mt-4 h-12 w-full rounded-lg flex items-end gap-1 px-1">
            {[40, 60, 45, 80, 90, 70, 100].map((h, i) => (
              <div
                key={i}
                className="w-full bg-primary/20 rounded-t-sm transition-all hover:bg-primary/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </MetricCard>

        <MetricCard
          title="Novos Pedidos"
          value="14"
          icon={<Receipt className="w-5 h-5" />}
          change="5 em processamento"
          positive
        />

        <MetricCard
          title="Clientes Ativos"
          value="482"
          icon={<UserPlus className="w-5 h-5" />}
          change="+8%"
          changeLabel="este mês"
          positive
        >
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[11px] text-muted-foreground">
              Taxa de retenção: <span className="text-foreground font-bold">84%</span>
            </p>
          </div>
        </MetricCard>

        <MetricCard
          title="Status de Estoque"
          value="Saudável"
          icon={<Package className="w-5 h-5" />}
        >
          <div className="flex flex-col gap-2 mt-4">
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <div className="gradient-primary h-full rounded-full" style={{ width: "92%" }} />
            </div>
            <p className="text-[11px] text-muted-foreground">92% dos produtos em estoque</p>
          </div>
        </MetricCard>
      </div>

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <WeeklySalesChart />
        <StockAlerts />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </DashboardLayout>
  );
};

export default Index;
