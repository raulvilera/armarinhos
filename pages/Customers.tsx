
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const NavContent = () => (
    <>
      <div className="p-10 flex items-center gap-4">
        <div className="bg-primary size-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30">
          <span className="material-symbols-outlined text-3xl font-black">group</span>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase text-primary leading-none">Vicmar</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 mt-1 italic">Gestão Admin</p>
        </div>
      </div>
      <nav className="flex-1 px-6 mt-10 space-y-2">
        <button onClick={() => { setView('DASHBOARD'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-left">
          <span className="material-symbols-outlined">grid_view</span> Dashboard
        </button>
        <button onClick={() => { setView('CATALOG'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-left">
          <span className="material-symbols-outlined">inventory_2</span> Estoque
        </button>
        <button className="w-full flex items-center gap-4 px-6 py-4 bg-selected/10 text-selected rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-left">
          <span className="material-symbols-outlined">group</span> Clientes
        </button>
      </nav>
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#F8F7F9] font-display">
      {/* Sidebar Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Lateral */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[60] w-80 bg-white border-r border-gray-100 flex flex-col shadow-sm transition-transform duration-500 transform
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <NavContent />
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scrollbar-hide">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden size-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-gray-100"
            >
              <span className="material-symbols-outlined font-black">menu</span>
            </button>
            <div className="text-right md:text-left flex-1 md:flex-none ml-4 lg:ml-0">
              <h2 className="text-2xl lg:text-4xl font-black tracking-tight text-gray-900 uppercase leading-none">Base de Clientes</h2>
              <p className="text-gray-400 font-bold uppercase text-[9px] lg:text-[11px] tracking-[0.3em] mt-2 italic">Gestão de Fidelização • Vicmar</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-primary text-white font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:brightness-110 transition-all uppercase text-[10px] lg:text-xs tracking-widest"
          >
            <span className="material-symbols-outlined font-black">person_add</span>
            Novo Cliente
          </button>
        </header>

        <div className="relative mb-8 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
          <input
            className="w-full bg-white border-none rounded-2xl py-4 pl-14 pr-6 shadow-sm text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Pesquisar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 overflow-y-hidden">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-neutral-light/30 border-b border-neutral-light">
                  <th className="px-8 py-5 text-[9px] font-black text-text-muted uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-5 text-[9px] font-black text-text-muted uppercase tracking-widest">Contato</th>
                  <th className="px-8 py-5 text-[9px] font-black text-text-muted uppercase tracking-widest text-center">Pedidos</th>
                  <th className="px-8 py-5 text-[9px] font-black text-text-muted uppercase tracking-widest">Gasto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-light">
                {filteredCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-neutral-light/10 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-text-main leading-tight">{c.name}</p>
                          <p className={`text-[8px] font-black uppercase ${c.ordersCount > 10 ? 'text-primary' : 'text-text-muted opacity-60'}`}>
                            {c.ordersCount > 10 ? 'Cliente VIP' : 'Cliente Ativo'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[11px] font-bold text-text-main">{c.email}</p>
                      <p className="text-[9px] text-text-muted font-medium">{c.phone}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="bg-neutral-light px-2.5 py-1 rounded-full text-[10px] font-black text-text-main">{c.ordersCount}</span>
                    </td>
                    <td className="px-8 py-5 font-black text-primary text-sm tracking-tighter whitespace-nowrap">
                      R$ {c.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal responsivo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Novo Cliente</h3>
                <p className="text-white/80 text-[10px] font-bold italic">Cadastro direto na base Vicmar</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/20 size-10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 block">Nome Completo</label>
                <input required className="w-full bg-neutral-light border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={newCustomer.name || ''} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 block">WhatsApp</label>
                  <input required className="w-full bg-neutral-light border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={newCustomer.phone || ''} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 block">Email</label>
                  <input type="email" required className="w-full bg-neutral-light border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={newCustomer.email || ''} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase text-[10px] tracking-widest">
                Salvar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
