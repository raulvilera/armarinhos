import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, CartItem, Sale, Customer, FiscalInfo } from '../types';
import { BarcodeScanner } from '../components/BarcodeScanner';

interface POSProps {
   products: Product[];
   sales: Sale[];
   customers: Customer[];
   onFinishSale: (items: CartItem[], method: string, customerId?: string, isIncoming?: boolean, fiscal?: FiscalInfo) => void;
   onAddProduct: (p: any) => Promise<Product | null>;
}

type POSMode = 'SALE' | 'SUPPLIER';

export const POS: React.FC<POSProps> = ({ products, sales, customers, onFinishSale, onAddProduct }) => {
   const navigate = useNavigate();
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
      <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
         {/* Main Content (Search & Products) */}
         <div className="flex-1 flex flex-col min-w-0">
            <div className="flex flex-wrap gap-4 mb-8">
               <button onClick={() => { setMode('SALE'); setCartItems([]); }} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SALE' ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}>Frente de Caixa</button>
               <button onClick={() => { setMode('SUPPLIER'); setCartItems([]); }} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SUPPLIER' ? 'bg-selected text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}>Entrada Fornecedor</button>
            </div>

            <header className="mb-8 flex flex-col xl:flex-row gap-6">
               <div className="relative flex-1 group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                     <span className="material-symbols-outlined font-black text-2xl">barcode_scanner</span>
                  </div>
                  <input ref={searchInputRef} autoFocus className="w-full bg-white border border-gray-100 rounded-[2rem] py-5 pl-16 pr-20 text-sm font-black shadow-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300 uppercase tracking-tight" placeholder="Escaneie ou busque..." value={search} onChange={e => setSearch(e.target.value)} />
                  <button onClick={() => setIsScannerOpen(true)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/10 text-primary size-12 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg border-2 border-primary/20">
                     <span className="material-symbols-outlined text-xl font-black">photo_camera</span>
                  </button>
               </div>
               <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 min-w-[200px]">
                  <select className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 outline-none w-full" value={selectedCustomerId || ''} onChange={e => setSelectedCustomerId(e.target.value || undefined)}>
                     <option value="">Consumidor Final</option>
                     {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
            </header>

            <div className="overflow-y-auto max-h-[calc(100vh-350px)] pr-2 scrollbar-hide">
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredProducts.map(p => (
                     <div key={p.id} onClick={() => addToCart(p)} className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col ${p.stock <= 0 && mode === 'SALE' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                        <div className="aspect-square bg-gray-50 rounded-[1.5rem] mb-4 p-4 flex items-center justify-center relative group-hover:bg-primary/5 transition-colors">
                           <img src={p.image} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" alt={p.name} />
                        </div>
                        <div className="flex-1">
                           <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">{p.sku}</p>
                           <p className="text-xs font-black text-gray-800 uppercase leading-tight line-clamp-2 h-8 mb-4">{p.name}</p>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                           <p className="text-lg font-black text-primary tracking-tighter">R$ {p.price.toFixed(2)}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Cart Side */}
         <div className="w-full lg:w-[400px] xl:w-[450px] bg-white border border-gray-100 rounded-[2.5rem] flex flex-col shadow-sm shrink-0 overflow-hidden sticky top-0 max-h-[calc(100vh-100px)]">
            <div className={`p-8 border-b border-gray-50 flex items-center justify-between ${mode === 'SALE' ? 'bg-primary/5 text-primary' : 'bg-selected/5 text-selected'}`}>
               <div className="flex items-center gap-4">
                  <div className={`size-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${mode === 'SALE' ? 'bg-primary shadow-primary/20' : 'bg-selected shadow-selected/20'}`}>
                     <span className="material-symbols-outlined text-2xl font-black">{mode === 'SALE' ? 'shopping_basket' : 'input'}</span>
                  </div>
                  <div>
                     <h2 className="text-xl font-black uppercase tracking-tighter leading-none">{mode === 'SALE' ? 'Carrinho' : 'Entrada'}</h2>
                     <p className="text-[8px] font-black opacity-40 uppercase tracking-[0.3em] mt-1">Total de Itens: {totalItems}</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
               {cartItems.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group">
                     <div className="size-16 rounded-xl bg-white border border-gray-100 p-2 shrink-0 overflow-hidden">
                        <img src={item.product.image} className="w-full h-full object-contain" alt={item.product.name} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-gray-800 uppercase truncate mb-1">{item.product.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                           <button onClick={(e) => { e.stopPropagation(); updateQty(item.product.id, -1); }} className="size-7 bg-white border border-gray-100 rounded-lg font-black text-xs hover:bg-gray-50">-</button>
                           <span className="text-xs font-black text-gray-900">{item.quantity}</span>
                           <button onClick={(e) => { e.stopPropagation(); updateQty(item.product.id, 1); }} className="size-7 bg-white border border-gray-100 rounded-lg font-black text-xs hover:bg-gray-50">+</button>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-primary tracking-tighter">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeItem(item.product.id)} className="text-[8px] font-black text-red-400 uppercase tracking-widest mt-1 hover:text-red-600 transition-colors">Remover</button>
                     </div>
                  </div>
               ))}
               {cartItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-10">
                     <span className="material-symbols-outlined text-6xl">shopping_basket</span>
                     <p className="font-black uppercase tracking-widest mt-4">Vazio</p>
                  </div>
               )}
            </div>

            <div className="p-8 bg-white border-t border-gray-100 space-y-6">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Método:</span>
                  <div className="flex gap-2">
                     <button onClick={() => setPaymentMethod('Pix')} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'Pix' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>Pix</button>
                     <button onClick={() => setPaymentMethod('Crédito')} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'Crédito' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>Cartão</button>
                  </div>
               </div>

               <div className="bg-primary/5 rounded-[2rem] p-6 shadow-sm border border-primary/5">
                  <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1">Total Final</p>
                  <p className={`text-4xl font-black tracking-tighter ${mode === 'SALE' ? 'text-primary' : 'text-selected'}`}>R$ {total.toFixed(2).replace('.', ',')}</p>
               </div>

               <button disabled={cartItems.length === 0} onClick={handleFinalize} className={`w-full py-6 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-4 transition-all uppercase tracking-[0.3em] ${mode === 'SALE' ? 'bg-primary text-white shadow-primary/20' : 'bg-selected text-white shadow-selected/20'} disabled:opacity-20`}>
                  Finalizar <span className="material-symbols-outlined font-black text-xl">verified_user</span>
               </button>
            </div>
         </div>

         {/* Receipt Modal */}
         {lastReceipt && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setLastReceipt(null)}></div>
               <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 flex flex-col p-10 items-center animate-in zoom-in duration-300">
                  <div className="bg-selected text-white size-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-selected/20">
                     <span className="material-symbols-outlined text-5xl font-black">check_circle</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-gray-900 text-center leading-none">Venda Concluída</h3>
                  <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] mb-8">Comprovante • {lastReceipt.id}</p>
                  <button onClick={() => setLastReceipt(null)} className="w-full bg-primary text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-4">
                     Novo Atendimento
                  </button>
               </div>
            </div>
         )}

         {/* Quick Add Modal */}
         {isQuickAddOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsQuickAddOpen(false)}></div>
               <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
                  <div className="bg-selected p-8 text-white flex justify-between items-center">
                     <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Produto Novo</h3>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-2 italic">SCANNER: {quickAddData.barcode}</p>
                     </div>
                     <button onClick={() => setIsQuickAddOpen(false)} className="bg-white/20 size-10 rounded-full flex items-center justify-center hover:bg-white/40">
                        <span className="material-symbols-outlined font-black">close</span>
                     </button>
                  </div>
                  <div className="p-10 space-y-6">
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Nome Comercial</label>
                        <input autoFocus className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-black outline-none focus:ring-4 focus:ring-selected/10 transition-all uppercase" placeholder="EX: LINHA DE CROCHÊ 500M" value={quickAddData.name} onChange={e => setQuickAddData({ ...quickAddData, name: e.target.value })} />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Preço de Venda (R$)</label>
                        <input type="number" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xl font-black text-primary outline-none focus:ring-4 focus:ring-selected/10 transition-all" placeholder="0,00" value={quickAddData.price} onChange={e => setQuickAddData({ ...quickAddData, price: e.target.value })} />
                     </div>
                     <button onClick={handleQuickAdd} disabled={!quickAddData.name || !quickAddData.price} className="w-full bg-selected text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-selected/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-30">
                        Cadastrar e Vender <span className="material-symbols-outlined font-black">add_circle</span>
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
