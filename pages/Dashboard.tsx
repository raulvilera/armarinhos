import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Sale, Customer } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  ShoppingBag,
  Package,
  DollarSign,
  Users,
  AlertTriangle,
  PlusCircle,
  CreditCard,
  UserPlus,
  Truck,
  BarChart3,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import MetricCard from '../components/MetricCard';

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

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

  const chartData = useMemo(() => {
    return DAYS.map((day, idx) => {
      // Ajustando o índice para Segunda-feira sendo o início (idx + 1) % 7
      const targetDay = (idx + 1) % 7;
      const daySales = sales.filter(s => {
        const sDate = new Date(s.date);
        return sDate.getDay() === targetDay;
      });

      const venda = daySales
        .filter(s => !s.paymentMethod.includes('Entrada'))
        .reduce((acc, s) => acc + s.total, 0);

      return {
        name: day,
        venda: venda,
      };
    });
  }, [sales]);

  const stockAlerts = useMemo(() =>
    products
      .filter(p => p.stock < 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 3)
    , [products]);

  const quickActions = [
    { label: 'Novo Produto', icon: PlusCircle, path: '/catalogo' },
    { label: 'Venda Direta', icon: CreditCard, path: '/pos' },
    { label: 'Cadastrar Cliente', icon: UserPlus, path: '/clientes' },
    { label: 'Novo Fornecedor', icon: Truck, path: '/settings' },
    { label: 'Relatórios', icon: BarChart3, path: '/financeiro' },
    { label: 'Ajuda', icon: HelpCircle, path: '/ajustes' },
  ];

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
            extraInfo="5 em processamento"
          />
          <MetricCard
            title="Clientes Ativos"
            value={customers.length.toString()}
            icon={<Users />}
            change="+5%"
            changeLabel="este mês"
            extraInfo="Taxa de retenção: 84%"
          />
          <MetricCard
            title="Status de Estoque"
            value={totalStockItems < 30 ? "Crítico" : "Saudável"}
            icon={<Package />}
            positive={totalStockItems >= 30}
            progressBar={Math.min((totalStockItems / 500) * 100, 100)}
            extraInfo={`${Math.min(Math.round((totalStockItems / 500) * 100), 100)}% dos produtos em estoque`}
          />
        </div>

        {/* Charts and Alerts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Main Chart */}
          <div className="xl:col-span-2 bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h4 className="text-xl md:text-2xl font-black text-gray-950">Vendas Semanais</h4>
                <p className="text-sm text-gray-400 font-bold mt-1">Faturamento nos últimos 7 dias</p>
              </div>
              <button className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-gray-700 hover:bg-gray-100 transition-colors">
                Esta Semana
                <ChevronDown className="size-4" />
              </button>
            </div>
            <div className="h-80 md:h-[400px] w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={32} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 900, fill: '#64748b' }}
                    dy={10}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: '900' }}
                  />
                  <Bar dataKey="venda" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 || index === 4 || index === 6 ? "#2563eb" : index === 5 ? "#1d4ed8" : "#3b82f6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock Alerts Panel */}
          <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-xl md:text-2xl font-black text-gray-950">Alerta de Estoque</h4>
              <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Crítico</span>
            </div>

            <div className="flex-1 space-y-6">
              {stockAlerts.map(product => (
                <div key={product.id} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-50 group hover:border-primary/20 transition-all cursor-pointer">
                  <div className="size-12 rounded-2xl bg-orange-100/50 flex items-center justify-center text-orange-600">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-950 truncate">{product.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Tipo: Revestimento</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-red-600">{product.stock} un.</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Repor</p>
                  </div>
                </div>
              ))}

              {stockAlerts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-10 opacity-40">
                  <Package className="size-12 text-gray-300" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sem alertas críticos</p>
                </div>
              )}
            </div>

            <button className="w-full mt-auto py-5 border-2 border-primary/5 rounded-2xl text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all">Ver Todos os Alertas</button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100">
          <h4 className="text-lg font-black text-gray-950 mb-8 px-2">Ações Rápidas</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-primary/20 hover:shadow-lg transition-all group"
              >
                <div className="size-12 rounded-2x flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                  <action.icon className="size-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
