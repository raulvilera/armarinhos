import React from 'react';
import MetricCard from "../components/MetricCard";
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

export const Financial: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard
                    title="Receita Mensal"
                    value="R$ 12.400,00"
                    icon={<DollarSign className="w-6 h-6" />}
                    change="+14.8%"
                    changeLabel="vs mês anterior"
                    positive
                />
                <MetricCard
                    title="Despesas"
                    value="R$ 5.300,00"
                    icon={<TrendingDown className="w-6 h-6" />}
                    change="+6%"
                    changeLabel="vs mês anterior"
                    positive={false}
                />
                <MetricCard
                    title="Lucro Líquido"
                    value="R$ 7.100,00"
                    icon={<TrendingUp className="w-6 h-6" />}
                    change="+22%"
                    changeLabel="vs mês anterior"
                    positive
                />
                <MetricCard
                    title="Ticket Médio"
                    value="R$ 48,50"
                    icon={<CreditCard className="w-6 h-6" />}
                    change="+5%"
                    changeLabel="vs mês anterior"
                    positive
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gráfico de Barras - Receita vs Despesas */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Fluxo de Caixa</h4>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Receita vs Despesas Mensais</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-primary"></div>
                                <span className="text-[9px] font-black uppercase text-gray-400">Receita</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-red-400"></div>
                                <span className="text-[9px] font-black uppercase text-gray-400">Despesas</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: "#9CA3AF" }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: "#9CA3AF" }}
                                    tickFormatter={(v) => `R$ ${v / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{
                                        borderRadius: "1.5rem",
                                        border: "1px solid #F3F4F6",
                                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                        fontFamily: 'Manrope',
                                        fontWeight: 900,
                                        fontSize: '10px',
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Bar dataKey="receita" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={32} name="Receita" />
                                <Bar dataKey="despesas" fill="#f87171" radius={[6, 6, 0, 0]} maxBarSize={32} name="Despesas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Linha - Lucro */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Evolução de Lucratividade</h4>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Margem Líquida por Período</p>
                        </div>
                        <span className="material-symbols-outlined text-primary/20 text-4xl">insights</span>
                    </div>

                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData.map((d) => ({ ...d, lucro: d.receita - d.despesas }))} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: "#9CA3AF" }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: "#9CA3AF" }}
                                    tickFormatter={(v) => `R$ ${v / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "1.5rem",
                                        border: "1px solid #F3F4F6",
                                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                        fontFamily: 'Manrope',
                                        fontWeight: 900,
                                        fontSize: '10px',
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="lucro"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    dot={{ fill: "#10b981", strokeWidth: 2, r: 6, stroke: "#fff" }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                    name="Lucro"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tabela de Transações Recentes Simplificada */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Relatório Consolidado</h4>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Dados históricos para análise de crescimento</p>
                    </div>
                    <button className="bg-primary/5 text-primary text-[10px] font-black px-6 py-3 rounded-2xl uppercase tracking-widest border border-primary/10 hover:bg-primary/10 transition-all">
                        Exportar PDF
                    </button>
                </div>
                <div className="p-10 pt-4">
                    <div className="grid grid-cols-4 py-6 border-b border-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <span>Mês Referência</span>
                        <span>Receita Bruta</span>
                        <span>Custo Total</span>
                        <span className="text-right">Lucro Líquido</span>
                    </div>
                    {[...monthlyData].reverse().map((data) => (
                        <div key={data.month} className="grid grid-cols-4 py-6 border-b border-gray-50 items-center group hover:bg-gray-50/50 transition-all rounded-xl px-2">
                            <span className="font-black text-gray-900 uppercase text-sm">{data.month}</span>
                            <span className="font-bold text-gray-600">R$ {data.receita.toFixed(2)}</span>
                            <span className="font-bold text-gray-600">R$ {data.despesas.toFixed(2)}</span>
                            <span className="text-right font-black text-green-600">R$ {(data.receita - data.despesas).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
