
import React, { useState, useMemo, useRef } from 'react';
import { ViewType, Product, CartItem, Sale, Customer, FiscalInfo } from '../types';
import { BarcodeScanner } from '../components/BarcodeScanner';

interface POSProps {
   setView: (v: ViewType) => void;
   products: Product[];
   sales: Sale[];
   customers: Customer[];
   onFinishSale: (items: CartItem[], method: string, customerId?: string, isIncoming?: boolean, fiscal?: FiscalInfo) => void;
   onAddProduct: (p: any) => Promise<Product | null>;
}

type POSMode = 'SALE' | 'SUPPLIER';

export const POS: React.FC<POSProps> = ({ setView, products, sales, customers, onFinishSale, onAddProduct }) => {
   const [mode, setMode] = useState<POSMode>('SALE');
   const [search, setSearch] = useState('');
   const [cartItems, setCartItems] = useState<CartItem[]>([]);
   const [paymentMethod, setPaymentMethod] = useState<string>('Pix');
   const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();
   const [lastReceipt, setLastReceipt] = useState<Sale | null>(null);
   const [isScannerOpen, setIsScannerOpen] = useState(false);

   // Cadastro Rápido
   const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
   const [quickAddData, setQuickAddData] = useState({ name: '', price: '', barcode: '' });

   // Estados Fiscais
   const [emitirNF, setEmitirNF] = useState(false);
   const [tipoDocumento, setTipoDocumento] = useState<'NF-e' | 'NFS-e'>('NF-e');
   const [cpfCnpj, setCpfCnpj] = useState('');
   const [razaoSocial, setRazaoSocial] = useState('');

   const searchInputRef = useRef<HTMLInputElement>(null);

   const filteredProducts = useMemo(() => {
      if (!search.trim()) return products.slice(0, 15);
      const s = search.toLowerCase();
      return products.filter(p =>
         p.name.toLowerCase().includes(s) ||
         p.sku.toLowerCase().includes(s) ||
         (p.barcode && p.barcode.includes(s))
      ).slice(0, 20);
   }, [search, products]);

   const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
   const discount = mode === 'SALE' && paymentMethod === 'Pix' ? subtotal * 0.05 : 0;
   const total = subtotal - discount;
   const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

   const addToCart = (p: Product) => {
      if (mode === 'SALE' && p.stock <= 0) return;
      setCartItems(prev => {
         const existing = prev.find(i => i.product.id === p.id);
         if (existing) {
            return prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
         }
         return [...prev, { product: p, quantity: 1 }];
      });
      setSearch('');
      searchInputRef.current?.focus();
   };

   const removeItem = (id: string) => {
      setCartItems(prev => prev.filter(i => i.product.id !== id));
   };

   const updateQty = (id: string, delta: number) => {
      setCartItems(prev => prev.map(i =>
         i.product.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      ));
   };

   const handleFinalize = () => {
      if (cartItems.length === 0) return;
      const isIncoming = mode === 'SUPPLIER';
      const method = isIncoming ? `Entrada: ${paymentMethod}` : paymentMethod;
      const fiscal: FiscalInfo = {
         emitirNF,
         tipoDocumento,
         cpfCnpj: emitirNF ? cpfCnpj : undefined,
         razaoSocial: emitirNF ? razaoSocial : undefined
      };
      onFinishSale(cartItems, method, selectedCustomerId, isIncoming, fiscal);
      const receipt: Sale = {
         id: Math.random().toString(36).substr(2, 6).toUpperCase(),
         date: new Date().toISOString(),
         items: JSON.parse(JSON.stringify(cartItems)),
         total: total,
         paymentMethod: method,
         customerName: isIncoming ? 'Fornecedor / Suprimento' : (customers.find(c => c.id === selectedCustomerId)?.name || 'Consumidor Final'),
         fiscal: fiscal
      };
      setLastReceipt(receipt);
      setCartItems([]);
      setSearch('');
      setSelectedCustomerId(undefined);
      setEmitirNF(false);
      setCpfCnpj('');
      setRazaoSocial('');
   };

   const handleQuickAdd = async () => {
      if (!quickAddData.name || !quickAddData.price) return;
      const newProduct = {
         name: quickAddData.name.trim(),
         price: Number(quickAddData.price),
         stock: 1,
         barcode: quickAddData.barcode,
         sku: `AUTO-${Math.floor(Math.random() * 10000)}`,
         category: 'Geral',
         image: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?q=80&w=200&auto=format&fit=crop'
      };
      const savedProduct = await onAddProduct(newProduct);
      if (savedProduct) {
         addToCart(savedProduct);
         setIsQuickAddOpen(false);
         setQuickAddData({ name: '', price: '', barcode: '' });
      }
   };

   return (
      <div className="flex h-screen bg-[#F0F2F5] overflow-hidden font-display selection:bg-primary/10">
         <aside className="w-24 lg:w-80 bg-white border-r border-gray-200 flex flex-col shadow-2xl z-40 transition-all">
            <div className="p-8 flex flex-col items-center lg:items-start gap-10">
               <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('DASHBOARD')}>
                  <div className="bg-primary size-12 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform">
                     <span className="material-symbols-outlined text-3xl font-black">terminal</span>
                  </div>
                  <div className="hidden lg:block">
                     <h1 className="text-xl font-black tracking-tighter uppercase text-primary leading-none">Vicmar POS</h1>
                     <p className="text-[10px] uppercase font-black text-gray-300 mt-1 tracking-widest">SaaS Professional</p>
                  </div>
               </div>
               <div className="w-full space-y-3">
                  <button onClick={() => { setMode('SALE'); setCartItems([]); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SALE' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-gray-400 hover:bg-gray-50'}`}>
                     <span className="material-symbols-outlined text-xl">shopping_cart</span>
                     <span className="hidden lg:block">Frente de Caixa</span>
                  </button>
                  <button onClick={() => { setMode('SUPPLIER'); setCartItems([]); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SUPPLIER' ? 'bg-selected text-white shadow-xl shadow-selected/30' : 'text-gray-400 hover:bg-gray-50'}`}>
                     <span className="material-symbols-outlined text-xl">local_shipping</span>
                     <span className="hidden lg:block">Entrada de Fornecedor</span>
                  </button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide space-y-4">
               {sales.slice(0, 15).map(s => (
                  <div key={s.id} className="p-4 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all cursor-pointer group">
                     <div className="flex justify-between items-center mb-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${s.paymentMethod.includes('Entrada') ? 'bg-selected/10 text-selected' : 'bg-primary/10 text-primary'}`}>#{s.id}</span>
                     </div>
                     <p className="text-[10px] font-black text-gray-800 truncate uppercase mb-1">{s.customerName}</p>
                     <p className="text-xs font-black text-gray-900 tracking-tighter">R$ {s.total.toFixed(2)}</p>
                  </div>
               ))}
            </div>
            <div className="p-8 border-t border-gray-100">
               <button onClick={() => setView('DASHBOARD')} className="w-full flex items-center justify-center gap-3 py-4 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 rounded-2xl transition-all">
                  <span className="material-symbols-outlined text-xl">grid_view</span> <span className="hidden lg:block">Sair do Terminal</span>
               </button>
            </div>
         </aside>

         <main className="flex-1 flex flex-col p-8 lg:p-14 overflow-hidden">
            <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
               <div className="relative flex-1 max-w-4xl group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                     <span className="material-symbols-outlined font-black text-3xl">barcode_scanner</span>
                  </div>
                  <input ref={searchInputRef} autoFocus className="w-full bg-white border-none rounded-[3rem] py-8 pl-20 pr-24 text-base font-black shadow-2xl shadow-gray-200/40 outline-none focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-gray-300 uppercase tracking-tight" placeholder="Escaneie ou busque..." value={search} onChange={e => setSearch(e.target.value)} />
                  <button onClick={() => setIsScannerOpen(true)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-primary/10 text-primary size-14 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg border-2 border-primary/20">
                     <span className="material-symbols-outlined text-3xl font-black">photo_camera</span>
                  </button>
               </div>
               <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] shadow-sm border border-gray-100">
                  <select className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 outline-none pr-10 cursor-pointer" value={selectedCustomerId || ''} onChange={e => setSelectedCustomerId(e.target.value || undefined)}>
                     <option value="">Consumidor Final</option>
                     {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
            </header>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                  {filteredProducts.map(p => (
                     <div key={p.id} onClick={() => addToCart(p)} className={`bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all cursor-pointer group relative overflow-hidden flex flex-col ${p.stock <= 0 && mode === 'SALE' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                        <div className="aspect-square bg-gray-50 rounded-[2.5rem] mb-6 p-6 flex items-center justify-center relative group-hover:bg-primary/5 transition-colors">
                           <img src={p.image} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" alt={p.name} />
                        </div>
                        <div className="flex-1">
                           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">{p.sku}</p>
                           <p className="text-[13px] font-black text-gray-800 uppercase leading-tight line-clamp-2 h-10 mb-6">{p.name}</p>
                        </div>
                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                           <p className="text-xl font-black text-primary tracking-tighter">R$ {p.price.toFixed(2)}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </main>

         <aside className="w-full lg:w-[550px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-50 animate-in slide-in-from-right duration-700">
            <div className={`p-10 lg:p-14 border-b border-gray-50 flex items-center justify-between ${mode === 'SALE' ? 'bg-primary/5' : 'bg-selected/5'}`}>
               <div className="flex items-center gap-6">
                  <div className={`size-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${mode === 'SALE' ? 'bg-primary shadow-primary/20' : 'bg-selected shadow-selected/20'}`}>
                     <span className="material-symbols-outlined text-4xl font-black">{mode === 'SALE' ? 'shopping_basket' : 'input'}</span>
                  </div>
                  <div>
                     <h2 className={`text-3xl font-black uppercase tracking-tighter leading-none ${mode === 'SALE' ? 'text-primary' : 'text-selected'}`}>{mode === 'SALE' ? 'Carrinho' : 'Entrada'}</h2>
                     <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-2 italic">PDV Terminal</p>
                  </div>
               </div>
               <p className={`text-4xl font-black ${mode === 'SALE' ? 'text-primary' : 'text-selected'}`}>{totalItems}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-6 scrollbar-hide">
               {cartItems.map(item => (
                  <div key={item.product.id} className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 group">
                     <div className="size-24 rounded-[1.5rem] bg-white border border-gray-100 p-4 shrink-0 shadow-sm overflow-hidden">
                        <img src={item.product.image} className="w-full h-full object-contain" alt={item.product.name} />
                     </div>
                     <div className="flex-1">
                        <p className="text-[13px] font-black text-gray-800 uppercase truncate mb-1">{item.product.name}</p>
                        <div className="flex items-center gap-6 mt-6">
                           <button onClick={() => updateQty(item.product.id, -1)} className="size-10 bg-white border border-gray-100 rounded-xl font-black">-</button>
                           <span className="text-sm font-black text-gray-900">{item.quantity}</span>
                           <button onClick={() => updateQty(item.product.id, 1)} className="size-10 bg-white border border-gray-100 rounded-xl font-black">+</button>
                        </div>
                     </div>
                     <p className="text-xl font-black text-primary tracking-tighter">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
               ))}
            </div>
            <div className="p-10 lg:p-14 bg-white border-t border-gray-100 space-y-10">
               <div className="bg-primary/5 rounded-[3rem] p-10">
                  <p className="text-[11px] font-black text-primary/40 uppercase tracking-[0.3em] mb-2">Total a Pagar</p>
                  <p className={`text-6xl font-black tracking-tighter ${mode === 'SALE' ? 'text-primary' : 'text-selected'}`}>R$ {total.toFixed(2)}</p>
               </div>
               <button disabled={cartItems.length === 0} onClick={handleFinalize} className={`w-full py-8 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-6 transition-all uppercase tracking-[0.4em] ${mode === 'SALE' ? 'bg-primary text-white shadow-primary/40' : 'bg-selected text-white shadow-selected/40'}`}>
                  Efetivar Operação <span className="material-symbols-outlined font-black text-3xl">verified_user</span>
               </button>
            </div>
         </aside>

         {lastReceipt && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-16">
               <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-3xl" onClick={() => setLastReceipt(null)}></div>
               <div className="bg-white w-full max-w-2xl rounded-[5rem] shadow-2xl relative z-10 overflow-hidden border border-white/10 flex flex-col max-h-[90vh] p-14 items-center">
                  <div className="bg-selected text-white size-28 rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl animate-bounce">
                     <span className="material-symbols-outlined text-6xl font-black">check_circle</span>
                  </div>
                  <h3 className="text-5xl font-black uppercase tracking-tighter mb-4 text-gray-900 text-center">Operação Efetuada</h3>
                  <p className="text-gray-400 font-black uppercase text-[12px] tracking-[0.5em] mb-10">Cupom Fiscal Vicmar • {lastReceipt.id}</p>
                  <button onClick={() => setLastReceipt(null)} className="w-full bg-primary text-white font-black py-7 rounded-3xl text-[11px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:brightness-110 transition-all flex items-center justify-center gap-4">
                     Novo Lançamento
                  </button>
               </div>
            </div>
         )}

         {isQuickAddOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-background-dark/90 backdrop-blur-xl" onClick={() => setIsQuickAddOpen(false)}></div>
               <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
                  <div className="bg-selected p-8 text-white flex justify-between items-center">
                     <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Produto Novo</h3>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-2 italic">Código: {quickAddData.barcode}</p>
                     </div>
                     <button onClick={() => setIsQuickAddOpen(false)} className="bg-white/20 size-10 rounded-full flex items-center justify-center hover:bg-white/40">
                        <span className="material-symbols-outlined font-black">close</span>
                     </button>
                  </div>
                  <div className="p-10 space-y-6">
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Nome do Produto</label>
                        <input autoFocus className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-selected/10 transition-all uppercase" placeholder="EX: LINHA DE CROCHÊ 500M" value={quickAddData.name} onChange={e => setQuickAddData({ ...quickAddData, name: e.target.value })} />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Preço de Venda</label>
                        <input type="number" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xl font-black text-primary outline-none focus:ring-4 focus:ring-selected/10 transition-all" placeholder="0.00" value={quickAddData.price} onChange={e => setQuickAddData({ ...quickAddData, price: e.target.value })} />
                     </div>
                     <button onClick={handleQuickAdd} disabled={!quickAddData.name || !quickAddData.price} className="w-full bg-selected text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-selected/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-30">
                        Cadastrar e Vender
                     </button>
                  </div>
               </div>
            </div>
         )}

         {isScannerOpen && (
            <BarcodeScanner
               onResult={(result) => {
                  const product = products.find(p => p.barcode === result || p.sku === result);
                  if (product) {
                     addToCart(product);
                     setIsScannerOpen(false);
                  } else {
                     setQuickAddData({ ...quickAddData, barcode: result });
                     setIsQuickAddOpen(true);
                     setIsScannerOpen(false);
                  }
               }}
               onClose={() => setIsScannerOpen(false)}
            />
         )}
      </div>
   );
};
