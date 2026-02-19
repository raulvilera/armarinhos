
import React, { useState, useMemo } from 'react';
import { ViewType, Product, Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { BarcodeScanner } from '../components/BarcodeScanner';

interface CatalogProps {
  setView: (v: ViewType) => void;
  products: Product[];
  sales: Sale[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, stock: number) => void;
  onUpdateProduct: (p: Product) => void;
  showToast: (msg: string, type?: 'success' | 'info') => void;
}

export const Catalog: React.FC<CatalogProps> = ({ setView, products, sales, onAddProduct, onDeleteProduct, onUpdateStock, onUpdateProduct, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('Todos');
  const [chartCategoryFilter, setChartCategoryFilter] = useState('Todos');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Filtros de Data
  const [filterDay, setFilterDay] = useState(new Date().getDate());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  // Controle de Dropdowns Inline
  const [openFilter, setOpenFilter] = useState<'day' | 'month' | 'year' | null>(null);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'Linhas e fios',
    stock: 0,
    price: 0,
    barcode: ''
  });

  const categories = ['Todos', 'Acessórios p/ máquina', 'Linhas e fios', 'Barbantes', 'Luminária p/ máquina', 'Aparelhos', 'Outros'];
  const months = [
    { name: 'Janeiro', value: 0 }, { name: 'Fevereiro', value: 1 }, { name: 'Março', value: 2 },
    { name: 'Abril', value: 3 }, { name: 'Maio', value: 4 }, { name: 'Junho', value: 5 },
    { name: 'Julho', value: 6 }, { name: 'Agosto', value: 7 }, { name: 'Setembro', value: 8 },
    { name: 'Outubro', value: 9 }, { name: 'Novembro', value: 10 }, { name: 'Dezembro', value: 11 }
  ];
  const years = [2023, 2024, 2025];

  const COLORS = {
    vendido: "#064e3b", // Verde Escuro (Vendas)
    estoque: "#1e3a8a"  // Azul Escuro (Estoque)
  };

  // Cálculo de dados para Dashboard e Relatórios
  const performanceData = useMemo(() => {
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getDate() === filterDay &&
        saleDate.getMonth() === filterMonth &&
        saleDate.getFullYear() === filterYear;
    });

    const data = products
      .filter(p => chartCategoryFilter === 'Todos' || p.category === chartCategoryFilter)
      .map(p => {
        let soldQty = 0;
        let soldValue = 0;

        filteredSales.forEach(sale => {
          const item = sale.items.find(i => i.product.id === p.id);
          if (item) {
            soldQty += item.quantity;
            soldValue += (item.product.price * item.quantity);
          }
        });

        return {
          id: p.id,
          name: p.name,
          barcode: p.barcode || p.sku || 'N/A',
          displayName: p.name.length > 15 ? p.name.substring(0, 13) + '..' : p.name,
          estoque: p.stock,
          vendido: soldQty,
          valorTotal: soldValue
        };
      })
      .sort((a, b) => (b.vendido + b.estoque) - (a.vendido + a.estoque));

    return data;
  }, [products, sales, filterDay, filterMonth, filterYear, chartCategoryFilter]);

  const dashboardData = performanceData.slice(0, 8);

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({ category: 'Linhas e fios', stock: 0, price: 0, barcode: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    if (editingProduct) {
      onUpdateProduct({ ...editingProduct, ...newProduct as Product });
    } else {
      const product: any = {
        name: newProduct.name!.trim(),
        category: (newProduct.category as Product['category']),
        description: newProduct.description || '',
        price: Number(newProduct.price),
        stock: Math.floor(Number(newProduct.stock)),
        sku: newProduct.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
        barcode: newProduct.barcode || '',
        image: newProduct.image || 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?q=80&w=200&auto=format&fit=crop',
        spec: newProduct.spec || ''
      };
      onAddProduct(product);
    }
    handleCloseModal();
  };

  const filteredTableProducts = activeTab === 'Todos'
    ? products
    : products.filter(p => p.category === activeTab);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light animate-in fade-in duration-500 font-display">
      {/* Sidebar Lateral */}
      <aside className="w-20 lg:w-80 bg-white border-r border-gray-100 flex flex-col shadow-sm shrink-0 transition-all">
        <div className="p-4 lg:p-10 flex items-center gap-4">
          <div className="bg-primary size-10 lg:size-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30 shrink-0">
            <span className="material-symbols-outlined text-2xl lg:text-3xl font-black">inventory_2</span>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <h1 className="text-2xl font-black tracking-tighter uppercase text-primary leading-none">Vicmar</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 mt-1 italic">Gestão Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-3 lg:px-6 mt-10 space-y-2 overflow-y-auto scrollbar-hide">
          <button onClick={() => setView('DASHBOARD')} className="w-full flex items-center gap-4 px-3 lg:px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all justify-center lg:justify-start">
            <span className="material-symbols-outlined">grid_view</span> <span className="hidden lg:block">Dashboard</span>
          </button>
          <button onClick={() => setView('CATALOG')} className="w-full flex items-center gap-4 px-3 lg:px-6 py-4 bg-selected/10 text-selected rounded-2xl font-black text-xs uppercase tracking-widest transition-all justify-center lg:justify-start">
            <span className="material-symbols-outlined">inventory_2</span> <span className="hidden lg:block">Estoque</span>
          </button>
          <button onClick={() => setView('POS')} className="w-full flex items-center gap-4 px-3 lg:px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all justify-center lg:justify-start">
            <span className="material-symbols-outlined">point_of_sale</span> <span className="hidden lg:block">Caixa PDV</span>
          </button>
          <button onClick={() => setView('STOREFRONT')} className="w-full flex items-center gap-4 px-3 lg:px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all justify-center lg:justify-start">
            <span className="material-symbols-outlined">storefront</span> <span className="hidden lg:block">Ver Vitrine</span>
          </button>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-12 scrollbar-hide">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 lg:mb-12 gap-6">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black tracking-tight text-gray-900 uppercase leading-none">Controle de Performance</h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] lg:text-[11px] tracking-[0.3em] mt-2 italic">Dashboard de Vendas e Inventário</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white font-black py-4 px-6 lg:px-10 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:brightness-110 transition-all uppercase text-[10px] lg:text-xs tracking-widest"
          >
            <span className="material-symbols-outlined font-black">add_box</span>
            Adicionar Produto
          </button>
        </header>

        {/* DASHBOARD GRÁFICO - BARRAS EMPILHADAS */}
        <section className="bg-white rounded-[2rem] lg:rounded-[4rem] shadow-sm border border-gray-100 p-6 lg:p-12 mb-8 lg:mb-16 animate-in slide-in-from-bottom-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div className="w-full md:w-auto">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 uppercase tracking-tighter">Comparativo Unitário (Vendas x Estoque)</h3>

              {/* FILTROS DE DATA INLINE */}
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="relative">
                  <button
                    onClick={() => setOpenFilter(openFilter === 'day' ? null : 'day')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${openFilter === 'day' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-primary/30'}`}
                  >
                    Dia: {filterDay}
                    <span className="material-symbols-outlined text-sm">{openFilter === 'day' ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {openFilter === 'day' && (
                    <div className="absolute top-full left-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 grid grid-cols-7 gap-1 w-[260px] z-[60] animate-in slide-in-from-top-2">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <button key={d} onClick={() => { setFilterDay(d); setOpenFilter(null); }} className={`size-7 rounded-lg flex items-center justify-center text-[9px] font-black transition-all ${filterDay === d ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-primary/10'}`}>{d}</button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenFilter(openFilter === 'month' ? null : 'month')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${openFilter === 'month' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-primary/30'}`}
                  >
                    Mês: {months[filterMonth].name}
                    <span className="material-symbols-outlined text-sm">{openFilter === 'month' ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {openFilter === 'month' && (
                    <div className="absolute top-full left-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 grid grid-cols-1 gap-1 w-full min-w-[150px] z-[60] animate-in slide-in-from-top-2">
                      {months.map(m => (
                        <button key={m.value} onClick={() => { setFilterMonth(m.value); setOpenFilter(null); }} className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterMonth === m.value ? 'bg-primary text-white' : 'hover:bg-primary/5 text-gray-600'}`}>{m.name}</button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenFilter(openFilter === 'year' ? null : 'year')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${openFilter === 'year' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-primary/30'}`}
                  >
                    Ano: {filterYear}
                    <span className="material-symbols-outlined text-sm">{openFilter === 'year' ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {openFilter === 'year' && (
                    <div className="absolute top-full left-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 grid grid-cols-1 gap-1 w-full min-w-[110px] z-[60] animate-in slide-in-from-top-2">
                      {years.map(y => (
                        <button key={y} onClick={() => { setFilterYear(y); setOpenFilter(null); }} className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterYear === y ? 'bg-primary text-white' : 'hover:bg-primary/5 text-gray-600'}`}>{y}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#064e3b]"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Vendas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#1e3a8a]"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Estoque</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] lg:h-[450px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData} margin={{ top: 30, right: 30, left: 0, bottom: 40 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="displayName" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94A3B8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94A3B8' }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 15px 30px rgba(0,0,0,0.05)', fontSize: '10px', fontWeight: '900' }} />

                {/* Barras Empilhadas: Vendas (embaixo) e Estoque (em cima) */}
                <Bar dataKey="vendido" name="Vendas" stackId="stack_a" fill={COLORS.vendido}>
                  <LabelList dataKey="vendido" position="center" style={{ fontSize: 10, fontWeight: 900, fill: '#FFFFFF' }} formatter={(val: number) => val > 0 ? `${val} v` : ''} />
                </Bar>
                <Bar dataKey="estoque" name="Estoque" stackId="stack_a" fill={COLORS.estoque} radius={[10, 10, 0, 0]}>
                  <LabelList dataKey="estoque" position="top" style={{ fontSize: 10, fontWeight: 900, fill: COLORS.estoque }} formatter={(val: number) => val > 0 ? `${val} est` : '0 est'} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-8 border-t border-gray-50">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setChartCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${chartCategoryFilter === cat
                  ? 'bg-selected text-white border-selected shadow-lg'
                  : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-selected/40'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* DETALHAMENTO DE VALORES POR PRODUTO */}
        <section className="bg-white rounded-[2rem] lg:rounded-[3.5rem] shadow-sm border border-gray-100 p-6 lg:p-12 mb-8 lg:mb-16 animate-in slide-in-from-bottom-5">
          <div className="mb-10">
            <h3 className="text-xl lg:text-2xl font-black text-gray-900 uppercase tracking-tighter">Vendas Analíticas por Produto</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mt-2">Relatório do dia: {filterDay}/{filterMonth + 1}/{filterYear}</p>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Unidades</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Faturamento (R$)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Peso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {performanceData.filter(d => d.vendido > 0).map((d, idx) => {
                  const totalGeral = performanceData.reduce((acc, curr) => acc + curr.valorTotal, 0);
                  const participacao = totalGeral > 0 ? (d.valorTotal / totalGeral) * 100 : 0;

                  return (
                    <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-black text-xs text-gray-800 uppercase leading-none">{d.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold mt-1 tracking-widest">#{d.barcode}</p>
                      </td>
                      <td className="px-6 py-5 text-center font-black text-sm text-selected">
                        {d.vendido} un.
                      </td>
                      <td className="px-6 py-5 text-right font-black text-base text-primary tracking-tighter">
                        {d.valorTotal.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${participacao}%` }}></div>
                          </div>
                          <span className="text-[9px] font-black text-gray-400">{participacao.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {performanceData.filter(d => d.vendido > 0).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] italic">Sem vendas registradas para o período selecionado</td>
                  </tr>
                )}
              </tbody>
              {performanceData.filter(d => d.vendido > 0).length > 0 && (
                <tfoot>
                  <tr className="bg-primary/5">
                    <td className="px-6 py-6 font-black text-xs uppercase text-primary">Consolidado Total</td>
                    <td className="px-6 py-6 text-center font-black text-sm text-primary">
                      {performanceData.reduce((acc, curr) => acc + curr.vendido, 0)} un.
                    </td>
                    <td className="px-6 py-6 text-right font-black text-xl text-primary tracking-tighter">
                      R$ {performanceData.reduce((acc, curr) => acc + curr.valorTotal, 0).toFixed(2).replace('.', ',')}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>

        {/* TABELA DE GESTÃO - INVENTÁRIO (Sempre Responsiva) */}
        <div className="mb-6">
          <h3 className="text-xl lg:text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">Gestão de Inventário Permanente</h3>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${activeTab === cat ? 'bg-selected text-white border-selected shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] lg:rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden mb-16">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest w-24">ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">Cód. Barras</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Preço (R$)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Quantidade</th>
                  <th className="px-8 py-6 text-right pr-12 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTableProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-black text-[10px] text-primary bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10 tracking-tighter">{p.id}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-[10px] text-gray-400 tracking-widest uppercase">{p.barcode || p.sku || '---'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-gray-50 p-1 border border-gray-100 shrink-0 shadow-inner"><img src={p.image} className="w-full h-full object-contain" alt={p.name} /></div>
                        <p className="font-black text-[14px] text-gray-800 uppercase leading-none truncate max-w-[220px]">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-base text-gray-900 tracking-tighter">
                      {p.price.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2 bg-gray-100 p-2 rounded-2xl border border-gray-200 w-fit mx-auto shadow-inner">
                        <button onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))} className="size-8 flex items-center justify-center rounded-lg bg-white shadow-sm font-black text-primary hover:bg-primary hover:text-white transition-all">-</button>
                        <input
                          type="number"
                          className="w-14 bg-transparent border-none text-center font-black text-xs focus:ring-0 p-0"
                          value={p.stock}
                          onChange={(e) => onUpdateStock(p.id, parseInt(e.target.value) || 0)}
                        />
                        <button onClick={() => onUpdateStock(p.id, p.stock + 1)} className="size-8 flex items-center justify-center rounded-lg bg-white shadow-sm font-black text-primary hover:bg-primary hover:text-white transition-all">+</button>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right pr-12">
                      <div className="flex items-center justify-end gap-3 opacity-100">
                        <button onClick={() => handleOpenEdit(p)} className="size-11 bg-primary/5 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm" title="Editar">
                          <span className="material-symbols-outlined text-sm font-black">edit</span>
                        </button>
                        <button onClick={() => onDeleteProduct(p.id)} className="size-11 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Excluir">
                          <span className="material-symbols-outlined text-sm font-black">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-md" onClick={handleCloseModal}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-primary p-10 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black tracking-tighter mb-1 uppercase">{editingProduct ? 'Ajustar Produto' : 'Novo Cadastro'}</h3>
                <p className="text-white/60 text-[9px] font-black uppercase tracking-widest italic leading-none">Inventário & Precificação Vicmar</p>
              </div>
              <button onClick={handleCloseModal} className="bg-white/20 size-12 rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
                <span className="material-symbols-outlined font-black text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Nome Comercial</label>
                <input required className="w-full bg-gray-50 border border-primary/10 rounded-2xl px-5 py-3 text-sm font-black outline-none focus:ring-4 focus:ring-primary/10" value={newProduct.name || ''} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Preço de Venda (R$)</label>
                <input type="number" step="0.01" required className="w-full bg-primary/5 border-2 border-primary/20 rounded-2xl px-5 py-3 text-lg font-black text-primary outline-none" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Carga Inicial</label>
                <input type="number" required className="w-full bg-gray-50 border border-primary/10 rounded-2xl px-5 py-3 text-sm font-black outline-none" value={newProduct.stock || ''} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Código de Barras / SKU</label>
                <div className="flex gap-3">
                  <input className="flex-1 bg-gray-50 border border-primary/10 rounded-2xl px-5 py-3 text-sm font-black outline-none" placeholder="Opcional" value={newProduct.barcode || ''} onChange={e => setNewProduct({ ...newProduct, barcode: e.target.value })} />
                  <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="bg-primary/5 text-primary size-12 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/10"
                  >
                    <span className="material-symbols-outlined font-black">barcode_scanner</span>
                  </button>
                </div>
              </div>
              <div className="col-span-2 pt-4">
                <button type="submit" className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.01] transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-4">
                  {editingProduct ? 'Salvar Alterações' : 'Concluir Cadastro'}
                  <span className="material-symbols-outlined font-black text-xl">task_alt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isScannerOpen && (
        <BarcodeScanner
          onResult={(result) => {
            setNewProduct({ ...newProduct, barcode: result });
            setIsScannerOpen(false);
            showToast('Código capturado!', 'success');
          }}
          onClose={() => setIsScannerOpen(false)}
        />
      )}
    </div>
  );
};
