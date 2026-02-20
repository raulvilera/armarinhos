import { useNavigate } from 'react-router-dom';
import { Product, Sale, Customer } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Receita Hoje</p>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">R$ {revenueToday.toFixed(2).replace('.', ',')}</h3>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Volume de Estoque</p>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">{totalStockItems} un.</h3>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Faturamento Total</p>
          <h3 className="text-2xl md:text-3xl font-black text-selected tracking-tighter">R$ {totalRevenue.toFixed(2).replace('.', ',')}</h3>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Clientes Registrados</p>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">{customers.length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h4 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-800">Fluxo Financeiro (Semana)</h4>
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
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={20}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#A1A1AA' }} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '900' }} />
                <Bar dataKey="venda" stackId="a" fill="#064e3b" />
                <Bar dataKey="estoque" stackId="a" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-800 mb-8">Top Compradores</h4>
          <div className="space-y-6">
            {topCustomers.map(c => (
              <div key={c.id} className="flex items-center gap-4 group">
                <div className="size-10 md:size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black border border-primary/10 text-sm">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] md:text-[11px] font-black text-gray-900 uppercase truncate">{c.name}</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">{c.ordersCount} pedidos realizados</p>
                </div>
                <p className="text-xs md:text-sm font-black text-primary tracking-tighter whitespace-nowrap">R$ {c.totalSpent.toFixed(2).replace('.', ',')}</p>
              </div>
            ))}
            {topCustomers.length === 0 && (
              <p className="text-center py-10 text-gray-300 text-[10px] font-black uppercase tracking-widest italic">Nenhum cliente com pedidos</p>
            )}
          </div>
          <button onClick={() => navigate('/clientes')} className="w-full mt-10 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">Base de Clientes</button>
        </div>
      </div>
    </div>
  );
};
