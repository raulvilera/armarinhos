
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
   const [showCartMobile, setShowCartMobile] = useState(false);

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
      setShowCartMobile(false);
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
      <div className="flex flex-col lg:flex-row h-screen bg-[#F0F2F5] overflow-hidden font-display selection:bg-primary/10">
         {/* Mobile Header */}
         <div className="lg:hidden bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 z-50 shadow-sm">
            <div className="flex items-center gap-3" onClick={() => setView('DASHBOARD')}>
               <div className="bg-primary size-9 rounded-xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl">terminal</span>
               </div>
               <span className="font-black text-sm text-primary uppercase tracking-tighter">Vicmar POS</span>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setShowCartMobile(!showCartMobile)} className="relative size-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary border border-gray-100">
                  <span className="material-symbols-outlined">shopping_basket</span>
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-selected text-white size-5 rounded-full text-[10px] flex items-center justify-center font-black">{totalItems}</span>}
               </button>
               <button onClick={() => setView('DASHBOARD')} className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined text-xl">close</span>
               </button>
            </div>
         </div>

         {/* Left Aside (Navigation & History) - Hidden on Mobile */}
         <aside className="hidden lg:flex w-80 bg-white border-r border-gray-100 flex-col shadow-sm z-40 transition-all shrink-0">
            <div className="p-10 flex flex-col items-start gap-10">
               <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('DASHBOARD')}>
                  <div className="bg-primary size-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:rotate-6 transition-transform">
                     <span className="material-symbols-outlined text-3xl font-black">terminal</span>
                  </div>
                  <div>
                     <h1 className="text-2xl font-black tracking-tighter uppercase text-primary leading-none">Vicmar</h1>
                     <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 mt-1 italic">Gestão Admin</p>
                  </div>
               </div>
               <div className="w-full space-y-3">
                  <button onClick={() => { setMode('SALE'); setCartItems([]); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SALE' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-gray-400 hover:bg-primary/5'}`}>
                     <span className="material-symbols-outlined text-xl">shopping_cart</span>
                     <span>Frente de Caixa</span>
                  </button>
                  <button onClick={() => { setMode('SUPPLIER'); setCartItems([]); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SUPPLIER' ? 'bg-selected text-white shadow-xl shadow-selected/30' : 'text-gray-400 hover:bg-primary/5'}`}>
                     <span className="material-symbols-outlined text-xl">local_shipping</span>
                     <span>Entrada Fornecedor</span>
                  </button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide space-y-4">
               {sales.slice(0, 5).map(s => (
                  <div key={s.id} className="p-5 rounded-3xl bg-gray-50 border border-gray-100/50 hover:border-primary/20 transition-all cursor-pointer group">
                     <div className="flex justify-between items-center mb-1">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${s.paymentMethod.includes('Entrada') ? 'bg-selected/10 text-selected' : 'bg-primary/10 text-primary'}`}>#{s.id}</span>
                        <span className="text-[8px] font-black text-gray-300 uppercase">{new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                     <p className="text-[10px] font-black text-gray-800 truncate uppercase">{s.customerName}</p>
                     <p className="text-xs font-black text-primary tracking-tighter">R$ {s.total.toFixed(2)}</p>
                  </div>
               ))}
            </div>
            <div className="p-8 border-t border-gray-100">
               <button onClick={() => setView('DASHBOARD')} className="w-full flex items-center justify-center gap-3 py-4 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 rounded-2xl transition-all">
                  <span className="material-symbols-outlined text-xl">grid_view</span> <span className="hidden xl:block">Sair do Terminal</span>
               </button>
            </div>
         </aside>

         {/* Middle Content (Search & Products) */}
         <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-14 overflow-hidden">
            <header className="mb-6 md:mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-10">
               <div className="relative flex-1 group">
                  <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                     <span className="material-symbols-outlined font-black text-2xl md:text-3xl">barcode_scanner</span>
                  </div>
                  <input ref={searchInputRef} autoFocus className="w-full bg-white border-none rounded-2xl md:rounded-[3rem] py-4 md:py-8 pl-16 md:pl-20 pr-20 md:pr-24 text-sm md:text-base font-black shadow-xl shadow-gray-200/40 outline-none focus:ring-4 md:ring-8 md:focus:ring-primary/5 transition-all placeholder:text-gray-300 uppercase tracking-tight" placeholder="Escaneie ou busque..." value={search} onChange={e => setSearch(e.target.value)} />
                  <button onClick={() => setIsScannerOpen(true)} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-primary/10 text-primary size-10 md:size-14 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg border-2 border-primary/20">
                     <span className="material-symbols-outlined text-xl md:text-3xl font-black">photo_camera</span>
                  </button>
               </div>
               <div className="flex items-center gap-4 bg-white p-3 md:p-3 rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100">
                  <select className="bg-transparent border-none text-[9px] md:text-[10px] font-black uppercase tracking-widest focus:ring-0 outline-none pr-8 md:pr-10 cursor-pointer w-full" value={selectedCustomerId || ''} onChange={e => setSelectedCustomerId(e.target.value || undefined)}>
                     <option value="">Consumidor Final</option>
                     {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
            </header>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
                  {filteredProducts.map(p => (
                     <div key={p.id} onClick={() => addToCart(p)} className={`bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden flex flex-col ${p.stock <= 0 && mode === 'SALE' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                        <div className="aspect-square bg-gray-50 rounded-[1.5rem] md:rounded-[2.5rem] mb-4 md:mb-6 p-4 md:p-6 flex items-center justify-center relative group-hover:bg-primary/5 transition-colors">
                           <img src={p.image} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" alt={p.name} />
                        </div>
                        <div className="flex-1">
                           <p className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1 md:mb-2">{p.sku}</p>
                           <p className="text-[11px] md:text-[13px] font-black text-gray-800 uppercase leading-tight line-clamp-2 h-8 md:h-10 mb-4 md:mb-6">{p.name}</p>
                        </div>
                        <div className="pt-4 md:pt-6 border-t border-gray-100 flex items-center justify-between">
                           <p className="text-base md:text-xl font-black text-primary tracking-tighter">R$ {p.price.toFixed(2)}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </main>

         {/* Cart Aside (Desktop version or mobile slide-up) */}
         <aside className={`
            fixed lg:static inset-y-0 right-0 z-[60] w-full lg:w-[450px] xl:w-[500px] bg-white border-l border-gray-100 flex flex-col shadow-sm transition-transform duration-500 transform
            ${showCartMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
         `}>
            {/* Cart Header (includes closing button for mobile) */}
            <div className={`p-8 md:p-10 xl:p-14 border-b border-gray-50 flex items-center justify-between ${mode === 'SALE' ? 'bg-primary/5' : 'bg-selected/5'}`}>
               <div className="flex items-center gap-4 md:gap-6">
                  <div className={`size-12 md:size-16 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${mode === 'SALE' ? 'bg-primary shadow-primary/20' : 'bg-selected shadow-selected/20'}`}>
                     <span className="material-symbols-outlined text-2xl md:text-4xl font-black">{mode === 'SALE' ? 'shopping_basket' : 'input'}</span>
                  </div>
                  <div>
                     <h2 className={`text-xl md:text-3xl font-black uppercase tracking-tighter leading-none ${mode === 'SALE' ? 'text-primary' : 'text-selected'}`}>{mode === 'SALE' ? 'Carrinho' : 'Entrada'}</h2>
                     <p className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-1 md:mt-2 italic">PDV Terminal</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <p className={`text-2xl md:text-4xl font-black ${mode === 'SALE' ? 'text-primary' : 'text-selected'}`}>{totalItems}</p>
                  <button onClick={() => setShowCartMobile(false)} className="lg:hidden size-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                     <span className="material-symbols-outlined">close</span>
                  </button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-10 xl:p-14 space-y-4 md:space-y-6 scrollbar-hide">
               {cartItems.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 md:gap-6 bg-gray-50/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 group">
                     <div className="size-16 md:size-24 rounded-lg md:rounded-[1.5rem] bg-white border border-gray-100 p-2 md:p-4 shrink-0 shadow-sm overflow-hidden">
                        <img src={item.product.image} className="w-full h-full object-contain" alt={item.product.name} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[11px] md:text-[13px] font-black text-gray-800 uppercase truncate mb-1">{item.product.name}</p>
                        <div className="flex items-center gap-4 md:gap-6 mt-3 md:mt-6">
                           <button onClick={() => updateQty(item.product.id, -1)} className="size-8 md:size-10 bg-white border border-gray-100 rounded-lg md:rounded-xl font-black">-</button>
                           <span className="text-xs md:text-sm font-black text-gray-900">{item.quantity}</span>
                           <button onClick={() => updateQty(item.product.id, 1)} className="size-8 md:size-10 bg-white border border-gray-100 rounded-lg md:rounded-xl font-black">+</button>
                        </div>
                     </div>
                     <p className="text-sm md:text-xl font-black text-primary tracking-tighter whitespace-nowrap">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
               ))}
               {cartItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                     <span className="material-symbols-outlined text-8xl">shopping_basket</span>
                     <p className="font-black uppercase tracking-widest mt-4">Vazio</p>
                  </div>
               )}
            </div>
            <div className="p-6 md:p-10 xl:p-14 bg-white border-t border-gray-100 space-y-6 md:space-y-10">
               <div className="bg-primary/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10">
                  <p className="text-[9px] md:text-[11px] font-black text-primary/40 uppercase tracking-[0.3em] mb-1 md:mb-2">Total a Pagar</p>
                  <p className={`text-4xl md:text-6xl font-black tracking-tighter ${mode === 'SALE' ? 'text-primary' : 'text-selected'}`}>R$ {total.toFixed(2)}</p>
               </div>
               <button disabled={cartItems.length === 0} onClick={handleFinalize} className={`w-full py-6 md:py-8 rounded-[1.5rem] md:rounded-[2.5rem] font-black text-base md:text-xl shadow-2xl flex items-center justify-center gap-4 md:gap-6 transition-all uppercase tracking-[0.2em] md:tracking-[0.4em] ${mode === 'SALE' ? 'bg-primary text-white shadow-primary/40' : 'bg-selected text-white shadow-selected/40'}`}>
                  Efetivar <span className="material-symbols-outlined font-black text-2xl md:text-3xl">verified_user</span>
               </button>
            </div>
         </aside>

         {/* Receipt Modal */}
         {lastReceipt && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-3xl" onClick={() => setLastReceipt(null)}></div>
               <div className="bg-white w-full max-w-2xl rounded-[3rem] md:rounded-[5rem] shadow-2xl relative z-10 overflow-hidden border border-white/10 flex flex-col max-h-[90vh] p-8 md:p-14 items-center">
                  <div className="bg-selected text-white size-20 md:size-28 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center mb-6 md:mb-10 shadow-2xl">
                     <span className="material-symbols-outlined text-4xl md:text-6xl font-black">check_circle</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 md:mb-4 text-gray-900 text-center leading-none">Operação Efetuada</h3>
                  <p className="text-gray-400 font-black uppercase text-[9px] md:text-[12px] tracking-[0.5em] mb-8 md:mb-10">Cupom • {lastReceipt.id}</p>
                  <button onClick={() => setLastReceipt(null)} className="w-full bg-primary text-white font-black py-5 md:py-7 rounded-2xl md:rounded-3xl text-[10px] md:text-[11px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:brightness-110 transition-all flex items-center justify-center gap-4">
                     Novo Lançamento
                  </button>
               </div>
            </div>
         )}

         {/* Quick Add Modal */}
         {isQuickAddOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-background-dark/90 backdrop-blur-xl" onClick={() => setIsQuickAddOpen(false)}></div>
               <div className="bg-white w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden">
                  <div className="bg-selected p-6 md:p-8 text-white flex justify-between items-center">
                     <div>
                        <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter leading-none">Produto Novo</h3>
                        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-60 mt-2 italic">Código: {quickAddData.barcode}</p>
                     </div>
                     <button onClick={() => setIsQuickAddOpen(false)} className="bg-white/20 size-8 md:size-10 rounded-full flex items-center justify-center hover:bg-white/40">
                        <span className="material-symbols-outlined font-black">close</span>
                     </button>
                  </div>
                  <div className="p-8 md:p-10 space-y-4 md:space-y-6">
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Nome do Produto</label>
                        <input autoFocus className="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm font-black outline-none focus:ring-4 focus:ring-selected/10 transition-all uppercase" placeholder="EX: LINHA DE CROCHÊ 500M" value={quickAddData.name} onChange={e => setQuickAddData({ ...quickAddData, name: e.target.value })} />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Preço de Venda</label>
                        <input type="number" className="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-lg md:text-xl font-black text-primary outline-none focus:ring-4 focus:ring-selected/10 transition-all" placeholder="0.00" value={quickAddData.price} onChange={e => setQuickAddData({ ...quickAddData, price: e.target.value })} />
                     </div>
                     <button onClick={handleQuickAdd} disabled={!quickAddData.name || !quickAddData.price} className="w-full bg-selected text-white py-5 md:py-6 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-selected/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-30">
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
