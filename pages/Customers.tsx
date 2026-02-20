import { useNavigate } from 'react-router-dom';
import { Customer } from '../types';

interface CustomersProps {
  customers: Customer[];
  onAddCustomer: (c: Customer) => void;
}

export const Customers: React.FC<CustomersProps> = ({ customers, onAddCustomer }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCustomer.name || '',
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      totalSpent: 0,
      ordersCount: 0
    };
    onAddCustomer(customer);
    setIsModalOpen(false);
    setNewCustomer({});
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity">search</span>
          <input
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 shadow-sm text-sm font-black outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase text-xs tracking-widest"
        >
          <span className="material-symbols-outlined font-black">person_add</span>
          Novo Cliente
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contato</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Pedidos</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Gasto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-sm text-gray-800 leading-tight uppercase">{c.name}</p>
                        <p className={`text-[8px] font-black uppercase mt-1 ${c.ordersCount > 10 ? 'text-primary' : 'text-gray-400 opacity-60'}`}>
                          {c.ordersCount > 10 ? 'Cliente VIP' : 'Cliente Frequente'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-gray-600 truncate">{c.email}</p>
                    <p className="text-[10px] text-gray-400 font-black mt-1">{c.phone}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-600">{c.ordersCount}</span>
                  </td>
                  <td className="px-8 py-6 font-black text-primary text-sm tracking-tighter whitespace-nowrap">
                    R$ {c.totalSpent.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center opacity-20">
              <span className="material-symbols-outlined text-6xl">group_off</span>
              <p className="font-black uppercase tracking-widest mt-4">Nenhum cliente encontrado</p>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {filteredCustomers.map(c => (
            <div key={c.id} className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs text-gray-800 uppercase truncate leading-none mb-1">{c.name}</p>
                  <p className={`text-[8px] font-black uppercase ${c.ordersCount > 10 ? 'text-primary' : 'text-gray-400'}`}>
                    {c.ordersCount > 10 ? 'Cliente VIP' : 'Cliente Ativo'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary tracking-tighter">R$ {c.totalSpent.toFixed(2).replace('.', ',')}</p>
                  <p className="text-[8px] font-black text-gray-300 uppercase">{c.ordersCount} pedidos</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-[10px] font-black text-gray-700 truncate">{c.phone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-[10px] font-black text-gray-700 truncate">{c.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal responsivo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight leading-none">Novo Cliente</h3>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2 italic">Fidelização Vicmar</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/20 size-10 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                <span className="material-symbols-outlined font-black">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block text-center">Iniciais ou Nome Completo</label>
                <input required autoFocus className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-center focus:ring-4 focus:ring-primary/5 outline-none transition-all uppercase" value={newCustomer.name || ''} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">WhatsApp de Contato</label>
                  <input required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={newCustomer.phone || ''} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Eletrônico</label>
                  <input type="email" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={newCustomer.email || ''} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-black py-6 rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase text-xs tracking-[0.2em]">
                Confirmar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
