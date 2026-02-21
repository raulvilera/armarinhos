import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarcodeScanner } from '../components/BarcodeScanner';

interface CatalogProps {
  products: Product[];
  sales: Sale[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, stock: number) => void;
  onUpdateProduct: (p: Product) => void;
  showToast: (msg: string, type?: 'success' | 'info') => void;
}

export const Catalog: React.FC<CatalogProps> = ({ products, sales, onAddProduct, onDeleteProduct, onUpdateStock, onUpdateProduct, showToast }) => {
  const navigate = useNavigate();
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-primary text-white font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:brightness-110 transition-all uppercase text-xs tracking-widest"
        >
          <span className="material-symbols-outlined font-black">add_box</span>
          Adicionar Produto
        </button>
      </div>

      {/* DASHBOARD GRÁFICO */}
      <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 lg:p-12 relative overflow-hidden">
        <div className="flex flex-col xl:flex-row justify-between items-start mb-10 gap-8">
          <div className="w-full">
            <h3 className="text-xl lg:text-2xl font-black text-gray-900 uppercase tracking-tighter">Performance (Vendas x Estoque)</h3>

            <div className="flex flex-wrap gap-2 md:gap-3 mt-6">
              <div className="relative">
                <button onClick={() => setOpenFilter(openFilter === 'day' ? null : 'day')} className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${openFilter === 'day' ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500'}`}>Dia: {filterDay}</button>
                {openFilter === 'day' && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 grid grid-cols-7 gap-1 w-[220px] z-[60]">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <button key={d} onClick={() => { setFilterDay(d); setOpenFilter(null); }} className={`size-6 rounded-lg flex items-center justify-center text-[9px] font-black ${filterDay === d ? 'bg-primary text-white' : 'hover:bg-primary/5'}`}>{d}</button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => setOpenFilter(openFilter === 'month' ? null : 'month')} className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${openFilter === 'month' ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500'}`}>{months[filterMonth].name}</button>
                {openFilter === 'month' && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 w-[140px] z-[60]">
                    {months.map(m => (
                      <button key={m.value} onClick={() => { setFilterMonth(m.value); setOpenFilter(null); }} className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase ${filterMonth === m.value ? 'bg-primary text-white' : 'hover:bg-primary/5'}`}>{m.name}</button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => setOpenFilter(openFilter === 'year' ? null : 'year')} className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${openFilter === 'year' ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500'}`}>{filterYear}</button>
                {openFilter === 'year' && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 w-[100px] z-[60]">
                    {years.map(y => (
                      <button key={y} onClick={() => { setFilterYear(y); setOpenFilter(null); }} className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-black uppercase ${filterYear === y ? 'bg-primary text-white' : 'hover:bg-primary/5'}`}>{y}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 self-center md:self-auto shrink-0">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-[#064e3b]"></div>
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Vendas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-[#1e3a8a]"></div>
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Estoque</span>
            </div>
          </div>
        </div>

        <div className="h-[280px] md:h-[350px] lg:h-[450px] w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="displayName" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#94A3B8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#94A3B8' }} />
              <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '9px', fontWeight: '900' }} />
              <Bar dataKey="vendido" name="Vendas" stackId="a" fill={COLORS.vendido} />
              <Bar dataKey="estoque" name="Estoque" stackId="a" fill={COLORS.estoque} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide md:justify-center border-t border-gray-50 pt-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setChartCategoryFilter(cat)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${chartCategoryFilter === cat ? 'bg-selected text-white border-selected' : 'bg-gray-50 text-gray-500'}`}>{cat}</button>
          ))}
        </div>
      </section>

      {/* GESTÃO DE INVENTÁRIO */}
      <section className="space-y-6">
        <h3 className="text-lg lg:text-2xl font-black text-gray-900 uppercase tracking-tighter">Inventário Permanente</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${activeTab === cat ? 'bg-selected text-white border-selected' : 'bg-white border-gray-100 text-gray-400'}`}>{cat}</button>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                  <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Preço</th>
                  <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Estoque</th>
                  <th className="px-6 py-5 text-right pr-8 text-[9px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTableProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/30">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-gray-50 p-1 border border-gray-100 shrink-0"><img src={p.image} className="w-full h-full object-contain" alt={p.name} /></div>
                        <p className="font-black text-xs text-gray-800 uppercase truncate max-w-[200px]">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-black text-sm text-gray-900">R$ {p.price.toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200 w-fit mx-auto">
                        <button onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))} className="size-7 flex items-center justify-center rounded-lg bg-white shadow-sm font-black text-primary">-</button>
                        <span className="w-8 text-center font-black text-[10px]">{p.stock}</span>
                        <button onClick={() => onUpdateStock(p.id, p.stock + 1)} className="size-7 flex items-center justify-center rounded-lg bg-white shadow-sm font-black text-primary">+</button>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right pr-8">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(p)} className="size-9 bg-primary/5 text-primary rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all"><span className="material-symbols-outlined text-sm">edit</span></button>
                        <button onClick={() => onDeleteProduct(p.id)} className="size-9 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal responsivo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleCloseModal}></div>
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-primary p-6 md:p-8 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter">{editingProduct ? 'Ajustar Produto' : 'Novo Cadastro'}</h3>
              <button onClick={handleCloseModal} className="bg-white/20 size-10 rounded-full flex items-center justify-center"><span className="material-symbols-outlined font-black">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Nome Comercial</label>
                <input required className="w-full bg-gray-50 border border-primary/10 rounded-xl px-4 py-3 text-sm font-black outline-none" value={newProduct.name || ''} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Preço (R$)</label>
                <input type="number" step="0.01" required className="w-full bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-lg font-black text-primary outline-none" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Estoque Inicial</label>
                <input type="number" required className="w-full bg-gray-50 border border-primary/10 rounded-xl px-4 py-3 text-sm font-black outline-none" value={newProduct.stock || ''} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Barras / SKU</label>
                <div className="flex gap-2">
                  <input className="flex-1 bg-gray-50 border border-primary/10 rounded-xl px-4 py-3 text-sm font-black outline-none" value={newProduct.barcode || ''} onChange={e => setNewProduct({ ...newProduct, barcode: e.target.value })} />
                  <button type="button" onClick={() => setIsScannerOpen(true)} className="bg-primary/5 text-primary size-12 rounded-xl flex items-center justify-center shadow-sm border border-primary/10"><span className="material-symbols-outlined font-black">barcode_scanner</span></button>
                </div>
              </div>
              <div className="md:col-span-2 pt-2">
                <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-xl shadow-primary/30 text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                  {editingProduct ? 'Salvar' : 'Concluir'} <span className="material-symbols-outlined font-black text-lg">task_alt</span>
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
