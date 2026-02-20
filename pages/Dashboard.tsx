import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Sale, Customer } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingBag, Package, DollarSign, Users } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import MetricCard from '../components/MetricCard';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  showToast: (msg: string, type?: 'success' | 'info') => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, sales, customers, showToast, onLogout }) => {
  const navigate = useNavigate();
  const lowStockProducts = useMemo(() => products.filter(p => p.stock < 15), [products]);
  const totalStockItems = useMemo(() => products.reduce((acc, p) => acc + p.stock, 0), [products]);

  const revenueToday = useMemo(() => {
    const today = new Date().toDateString();
    return sales
      .filter(s => new Date(s.date).toDateString() === today && !s.paymentMethod.includes('Entrada'))
      .reduce((acc, s) => acc + s.total, 0);
  }, [sales]);

  const totalRevenue = useMemo(() =>
    sales.filter(s => !s.paymentMethod.includes('Entrada')).reduce((acc, s) => acc + s.total, 0), [sales]);

  const chartData = useMemo(() => {
    return DAYS.map((day, idx) => {
      const daySales = sales.filter(s => {
        const sDate = new Date(s.date);
        return sDate.getDay() === idx;
      });

      const venda = daySales
        .filter(s => !s.paymentMethod.includes('Entrada'))
        .reduce((acc, s) => acc + s.total, 0);

      const estoque = daySales
        .filter(s => s.paymentMethod.includes('Entrada'))
        .reduce((acc, s) => acc + s.total, 0);

      return {
        name: day,
        venda: venda,
        estoque: estoque
      };
    });
  }, [sales]);

  const topCustomers = useMemo(() =>
    [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5), [customers]);

  return (
    <DashboardLayout title="Dashboard Lojista" subtitle="Bem-vinda de volta, Maria!">
      <div className="space-y-10 animate-fade-in">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <MetricCard
            title="Vendas Hoje"
            value={`R$ ${revenueToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<DollarSign />}
            change="+12.5%"
            changeLabel="vs ontem"
          />
          <MetricCard
            title="Novos Pedidos"
            value={sales.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).length.toString()}
            icon={<ShoppingBag />}
            change="5 em processamento"
            positive={true}
          />
          <MetricCard
            title="Clientes Ativos"
            value={customers.length.toString()}
            icon={<Users />}
          />
          <MetricCard
            title="Status de Estoque"
            value={totalStockItems < 50 ? "Baixo" : "Saudável"}
            icon={<Package />}
            positive={totalStockItems >= 50}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-950">Fluxo Financeiro (Semana)</h4>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="size-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 border-none uppercase tracking-widest">Vendas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="size-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estoque</span>
                </div>
              </div>
            </div>
            <div className="h-80 md:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={24}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: '900' }} />
                  <Bar dataKey="venda" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="estoque" stackId="a" fill="#e2e8f0" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100">
            <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-950 mb-10">Top Compradores</h4>
            <div className="space-y-8">
              {topCustomers.map(c => (
                <div key={c.id} className="flex items-center gap-5 group">
                  <div className="size-12 md:size-14 rounded-full bg-[#f0f5ff] flex items-center justify-center text-primary font-black border border-primary/5 text-base transition-transform group-hover:scale-110">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-black text-gray-950 uppercase truncate">{c.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{c.ordersCount} pedidos realizados</p>
                  </div>
                  <p className="text-sm md:text-base font-black text-primary tracking-tighter shadow-none whitespace-nowrap">R$ {c.totalSpent.toFixed(2).replace('.', ',')}</p>
                </div>
              ))}
              {topCustomers.length === 0 && (
                <p className="text-center py-10 text-gray-300 text-xs font-black uppercase tracking-widest italic">Nenhum cliente com pedidos</p>
              )}
            </div>
            <button onClick={() => navigate('/clientes')} className="w-full mt-10 py-5 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">Ver Todos os Clientes</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
