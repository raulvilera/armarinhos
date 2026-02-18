
import React, { useState, useEffect } from 'react';
import { ViewType, Product, CartItem, Customer, Sale } from './types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS } from './constants';
import { Storefront } from './pages/Storefront';
import { Dashboard } from './pages/Dashboard';
import { Catalog } from './pages/Catalog';
import { Checkout } from './pages/Checkout';
import { POS } from './pages/POS';
import { Customers } from './pages/Customers';
import { ChatWidget } from './components/ChatWidget';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('STOREFRONT');
  
  // Persistência com LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vicmar_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('vicmar_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('vicmar_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Efeito para salvar dados
  useEffect(() => {
    localStorage.setItem('vicmar_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vicmar_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('vicmar_sales', JSON.stringify(sales));
  }, [sales]);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSetView = (newView: ViewType) => {
    setIsLoading(true);
    setTimeout(() => {
      setView(newView);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast("Ops! Este item está sem estoque.", 'info');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`${product.name} adicionado!`, 'success');
  };

  const finishOrder = (itemsToDeduct?: CartItem[], paymentMethod: string = 'Pix', customerId?: string) => {
    const list = itemsToDeduct || cart;
    if (list.length === 0) return;

    const subtotal = list.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const finalTotal = paymentMethod === 'Pix' && !itemsToDeduct ? subtotal * 0.95 : subtotal;
    
    // 1. Atualização Robusta de Estoque
    setProducts(prev => prev.map(p => {
      const cartItem = list.find(ci => ci.product.id === p.id);
      return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity) } : p;
    }));

    // 2. Atualização de Clientes
    if (customerId) {
      setCustomers(prev => prev.map(c => 
        c.id === customerId 
          ? { ...c, totalSpent: c.totalSpent + finalTotal, ordersCount: c.ordersCount + 1, lastPurchase: new Date().toISOString() } 
          : c
      ));
    }

    // 3. Registro de Venda
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      date: new Date().toISOString(),
      items: JSON.parse(JSON.stringify(list)), // Clone profundo
      total: finalTotal,
      paymentMethod,
      customerName: customers.find(c => c.id === customerId)?.name || 'Cliente Balcão'
    };
    setSales(prev => [newSale, ...prev]);
    
    // 4. Limpeza e Transição
    if (!itemsToDeduct) {
        setCart([]);
        setIsOrderComplete(true);
        setTimeout(() => {
          setIsOrderComplete(false);
          handleSetView('STOREFRONT');
        }, 2500);
    } else {
        showToast("Venda PDV concluída!", 'success');
    }
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast('Produto atualizado!', 'success');
  };

  const renderView = () => {
    if (isOrderComplete) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-10 animate-in fade-in zoom-in duration-700">
           <div className="size-40 bg-primary text-white rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl shadow-primary/30 border-8 border-primary/5 animate-bounce">
              <span className="material-symbols-outlined text-7xl font-black">celebration</span>
           </div>
           <h2 className="text-5xl font-black text-primary mb-4 tracking-tighter uppercase">Obrigado!</h2>
           <p className="text-gray-400 font-bold text-lg max-w-sm uppercase tracking-widest italic leading-relaxed">Seu pedido no Armarinhos Vicmar foi processado com sucesso.</p>
           <div className="mt-12 flex flex-col items-center">
             <div className="w-1 bg-primary/10 h-16 mb-4"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Redirecionando para a loja</p>
           </div>
        </div>
      );
    }

    switch (view) {
      case 'STOREFRONT':
        return <Storefront setView={handleSetView} addToCart={addToCart} products={products} cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />;
      case 'DASHBOARD':
        return <Dashboard setView={handleSetView} products={products} sales={sales} customers={customers} showToast={showToast} />;
      case 'CATALOG':
        return (
          <Catalog 
            setView={handleSetView} 
            products={products} 
            onAddProduct={(p) => setProducts([p, ...products])} 
            onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))} 
            onUpdateStock={(id, stock) => setProducts(products.map(p => p.id === id ? {...p, stock} : p))} 
            onUpdateProduct={updateProduct}
            showToast={showToast}
          />
        );
      case 'POS':
        return <POS setView={handleSetView} products={products} sales={sales} customers={customers} onFinishSale={finishOrder} />;
      case 'CUSTOMERS':
        return <Customers setView={handleSetView} customers={customers} onAddCustomer={(c) => { setCustomers([c, ...customers]); showToast('Cliente cadastrado!'); }} />;
      case 'CHECKOUT':
        return <Checkout setView={handleSetView} cart={cart} removeFromCart={(id) => setCart(cart.filter(i => i.product.id !== id))} updateQuantity={(id, d) => setCart(cart.map(i => i.product.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onFinish={(method) => finishOrder(undefined, method)} />;
      default:
        return <Storefront setView={handleSetView} addToCart={addToCart} products={products} cartCount={cart.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-text-main font-display selection:bg-primary/20 overflow-x-hidden">
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="relative">
              <div className="bg-primary size-24 rounded-[2.5rem] flex items-center justify-center text-white animate-spin shadow-2xl shadow-primary/40 relative z-10">
                <span className="material-symbols-outlined text-4xl font-black">auto_fix_high</span>
              </div>
              <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] animate-ping"></div>
            </div>
            <p className="mt-12 text-[10px] font-black text-primary uppercase tracking-[0.6em] animate-pulse">Vicmar • Sincronizando Dados</p>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-8 duration-500 border-2 ${
          toast.type === 'success' ? 'bg-white border-green-500 text-green-700' : 'bg-background-dark border-primary text-white'
        }`}>
          <div className={`size-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-100' : 'bg-primary/20'}`}>
            <span className="material-symbols-outlined text-lg font-black">{toast.type === 'success' ? 'check' : 'info'}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
        </div>
      )}

      {renderView()}
      <ChatWidget currentView={view} products={products} />
    </div>
  );
};

export default App;
