import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Seg", vendas: 820 },
  { day: "Ter", vendas: 650 },
  { day: "Qua", vendas: 1120 },
  { day: "Qui", vendas: 1450 },
  { day: "Sex", vendas: 980 },
  { day: "Sab", vendas: 720 },
  { day: "Dom", vendas: 430 },
];

const WeeklySalesChart = () => {
  const [period, setPeriod] = useState("esta");

  return (
    <div className="lg:col-span-2 bg-card p-8 rounded-2xl shadow-sm border border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-black tracking-tight">Vendas Semanais</h4>
          <p className="text-muted-foreground text-sm">
            Faturamento nos últimos 7 dias
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-sm border border-border bg-muted rounded-lg font-bold py-1.5 pl-3 pr-8 focus:ring-primary/20 focus:outline-none"
        >
          <option value="esta">Esta Semana</option>
          <option value="passada">Semana Passada</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 15% 90%)" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fontWeight: 700, fill: "hsl(220 10% 45%)" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }}
            tickFormatter={(v) => `R$${v}`}
          />
          <Tooltip
            formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Vendas"]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid hsl(220 15% 90%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Bar
            dataKey="vendas"
            fill="hsl(217 91% 50%)"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklySalesChart;
