import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const monthlyData = [
  { month: "Set", receita: 8200, despesas: 4500 },
  { month: "Out", receita: 9100, despesas: 5200 },
  { month: "Nov", receita: 11500, despesas: 4800 },
  { month: "Dez", receita: 14200, despesas: 6100 },
  { month: "Jan", receita: 10800, despesas: 5000 },
  { month: "Fev", receita: 12400, despesas: 5300 },
];

const FinancialPage = () => {
  return (
    <DashboardLayout title="Financeiro" subtitle="Visão geral das finanças">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Receita Mensal" value="R$ 12.400" icon={<DollarSign className="w-5 h-5" />} change="+14.8%" changeLabel="vs mês anterior" positive />
        <MetricCard title="Despesas" value="R$ 5.300" icon={<TrendingDown className="w-5 h-5" />} change="+6%" changeLabel="vs mês anterior" positive={false} />
        <MetricCard title="Lucro Líquido" value="R$ 7.100" icon={<TrendingUp className="w-5 h-5" />} change="+22%" changeLabel="vs mês anterior" positive />
        <MetricCard title="Ticket Médio" value="R$ 48,50" icon={<CreditCard className="w-5 h-5" />} change="+5%" changeLabel="vs mês anterior" positive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
          <h4 className="text-lg font-black tracking-tight mb-6">Receita vs Despesas</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 15% 90%)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: "hsl(220 10% 45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, ""]} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220 15% 90%)" }} />
              <Bar dataKey="receita" fill="hsl(217 91% 50%)" radius={[6, 6, 0, 0]} maxBarSize={32} name="Receita" />
              <Bar dataKey="despesas" fill="hsl(0 84% 60%)" radius={[6, 6, 0, 0]} maxBarSize={32} name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
          <h4 className="text-lg font-black tracking-tight mb-6">Evolução do Lucro</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData.map((d) => ({ ...d, lucro: d.receita - d.despesas }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 15% 90%)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: "hsl(220 10% 45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Lucro"]} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220 15% 90%)" }} />
              <Line type="monotone" dataKey="lucro" stroke="hsl(142 71% 45%)" strokeWidth={3} dot={{ fill: "hsl(142 71% 45%)", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinancialPage;
