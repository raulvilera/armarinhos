
import React, { useMemo } from 'react';
import { ViewType, Product, Sale, Customer } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Global constant for days of the week to be used in charts and logic
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface DashboardProps {
  setView: (v: ViewType) => void;
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  showToast: (msg: string, type?: 'success' | 'info') => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setView, products, sales, customers, showToast, onLogout }) => {
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

  const topCustomers = useMemo(() =>
    [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5), [customers]);

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

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F7F9]">
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col shadow-sm animate-in slide-in-from-left duration-700">
        <div className="p-10 flex items-center gap-4">
          <div className="bg-primary size-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30">
            <span className="material-symbols-outlined text-3xl">architecture</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-primary leading-none">Vicmar</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 mt-1">SaaS Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-6 mt-10 space-y-2">
          <button onClick={() => setView('DASHBOARD')} className="w-full flex items-center gap-4 px-6 py-4 bg-selected/10 text-selected rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
            <span className="material-symbols-outlined">grid_view</span> Dashboard
          </button>
          <button onClick={() => setView('CATALOG')} className="w-full flex items-center gap-4 px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
            <span className="material-symbols-outlined">inventory_2</span> Estoque
          </button>
          <button onClick={() => setView('POS')} className="w-full flex items-center gap-4 px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
            <span className="material-symbols-outlined">point_of_sale</span> PDV / Caixa
          </button>
          <button onClick={() => setView('CUSTOMERS')} className="w-full flex items-center gap-4 px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
            <span className="material-symbols-outlined">group</span> Clientes
          </button>
          <button onClick={() => setView('SUBSCRIPTIONS')} className="w-full flex items-center gap-4 px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
            <span className="material-symbols-outlined">payments</span> Assinaturas
          </button>
        </nav>

        <div className="p-6 mt-auto space-y-4">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80 italic">Gestão Inteligente</p>
            <p className="text-sm font-bold leading-tight mb-6">"{lowStockProducts.length > 0 ? `Cuidado: ${lowStockProducts.length} itens críticos.` : 'Seu estoque está em dia hoje!'}"</p>
            <button onClick={() => setView('CATALOG')} className="w-full bg-white text-primary text-[10px] font-black py-4 rounded-2xl uppercase tracking-widest hover:scale-105 transition-all">Repor Estoque</button>
          </div>
          <button
            onClick={() => { onLogout(); setView('STOREFRONT'); }}
            className="w-full flex items-center justify-center gap-3 py-4 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
          >
            <span className="material-symbols-outlined text-lg">logout</span> Encerrar Sessão
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 scrollbar-hide">
        <header className="flex items-center justify-between mb-12 animate-in fade-in">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900 uppercase leading-none">Monitoramento</h2>
            <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.3em] mt-2 italic">Dashboard Operacional • Vicmar</p>
          </div>
          <button onClick={() => setView('STOREFRONT')} className="px-8 py-3 bg-white border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm text-primary hover:bg-primary hover:text-white transition-all">Ir para a Loja</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Receita Hoje</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">R$ {revenueToday.toFixed(2).replace('.', ',')}</h3>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Volume de Estoque</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{totalStockItems} un.</h3>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Faturamento Total</p>
            <h3 className="text-3xl font-black text-selected tracking-tighter">R$ {totalRevenue.toFixed(2).replace('.', ',')}</h3>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Clientes Registrados</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{customers.length}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-xl font-black uppercase tracking-tight text-gray-800">Fluxo Financeiro (Semana)</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#064e3b]"></div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Vendas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#1e3a8a]"></div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Estoque</span>
                </div>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={30}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#A1A1AA' }} />
                  <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '900' }} />
                  <Bar dataKey="venda" stackId="a" fill="#064e3b" />
                  <Bar dataKey="estoque" stackId="a" fill="#1e3a8a" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100">
            <h4 className="text-xl font-black uppercase tracking-tight text-gray-800 mb-8">Top Compradores</h4>
            <div className="space-y-6">
              {topCustomers.map(c => (
                <div key={c.id} className="flex items-center gap-4 group">
                  <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black border border-primary/10">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-gray-900 uppercase truncate">{c.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{c.ordersCount} pedidos realizados</p>
                  </div>
                  <p className="text-sm font-black text-primary tracking-tighter">R$ {c.totalSpent.toFixed(2).replace('.', ',')}</p>
                </div>
              ))}
              {topCustomers.length === 0 && (
                <p className="text-center py-10 text-gray-300 text-[10px] font-black uppercase tracking-widest italic">Nenhum cliente com pedidos</p>
              )}
            </div>
            <button onClick={() => setView('CUSTOMERS')} className="w-full mt-10 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">Base de Clientes</button>
          </div>
        </div>
      </main>
    </div>
  );
};
