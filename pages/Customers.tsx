
import React, { useState } from 'react';
import { ViewType, Customer } from '../types';

interface CustomersProps {
  setView: (v: ViewType) => void;
  customers: Customer[];
  onAddCustomer: (c: Customer) => void;
}

export const Customers: React.FC<CustomersProps> = ({ setView, customers, onAddCustomer }) => {
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
    <div className="flex h-screen overflow-hidden bg-background-light animate-in fade-in duration-300">
      <aside className="w-64 bg-white border-r border-primary/10 flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-primary size-9 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xl">group</span>
          </div>
          <h1 className="text-lg font-black tracking-tighter">Vicmar</h1>
        </div>
        <nav className="flex-1 px-4 mt-6 space-y-2">
          <button onClick={() => setView('DASHBOARD')} className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-neutral-light/50 rounded-xl transition-all font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined">home</span>
            <span>Dashboard</span>
          </button>
          <button onClick={() => setView('CATALOG')} className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-neutral-light/50 rounded-xl transition-all font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined">inventory_2</span>
            <span>Estoque</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-black text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined">group</span>
            <span>Clientes</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Base de Clientes</h2>
            <p className="text-text-muted font-medium italic">Gestão de fidelização e histórico</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white font-black py-3 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase text-xs tracking-widest"
          >
            <span className="material-symbols-outlined">person_add</span>
            Novo Cliente
          </button>
        </header>

        <div className="relative mb-8 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
          <input 
            className="w-full bg-white border-none rounded-2xl py-4 pl-14 pr-6 shadow-sm text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Pesquisar por nome ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-light overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-light/30 border-b border-neutral-light">
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Contato</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Pedidos</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Total Gasto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light">
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-neutral-light/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text-main leading-tight">{c.name}</p>
                        <p className={`text-[9px] font-black uppercase ${c.ordersCount > 10 ? 'text-primary' : 'text-text-muted opacity-60'}`}>
                          {c.ordersCount > 10 ? 'Cliente VIP' : 'Cliente Ativo'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-text-main">{c.email}</p>
                    <p className="text-[10px] text-text-muted font-medium">{c.phone}</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="bg-neutral-light px-3 py-1.5 rounded-full text-xs font-black text-text-main">{c.ordersCount}</span>
                  </td>
                  <td className="px-8 py-5 font-black text-primary text-sm tracking-tighter">
                    R$ {c.totalSpent.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Novo Cliente</h3>
                <p className="text-white/80 text-sm font-bold italic">Cadastro direto na base Vicmar</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/20 size-10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Nome Completo</label>
                <input required className="w-full bg-neutral-light border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={newCustomer.name || ''} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">WhatsApp</label>
                  <input required className="w-full bg-neutral-light border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={newCustomer.phone || ''} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Email</label>
                  <input type="email" required className="w-full bg-neutral-light border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={newCustomer.email || ''} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase text-xs tracking-widest">
                Salvar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
