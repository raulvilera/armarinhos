
import React, { useState, useEffect } from 'react';
import { ViewType, Product, CartItem, Customer, Sale, FiscalInfo } from './types';
import { Storefront } from './pages/Storefront';
import { Dashboard } from './pages/Dashboard';
import { Catalog } from './pages/Catalog';
import { Checkout } from './pages/Checkout';
import { POS } from './pages/POS';
import { Customers } from './pages/Customers';
import { Login } from './pages/Login';
import { Subscriptions } from './pages/Subscriptions';
import { ChatWidget } from './components/ChatWidget';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('STOREFRONT');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [user, setUser] = useState<any>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    fetchData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setView('STOREFRONT');
      } else {
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (retries = 3) => {
    try {
      const [{ data: productsData, error: pError }, { data: customersData, error: cError }, { data: salesData, error: sError }] = await Promise.all([
        supabase.from('products').select('*').order('name'),
        supabase.from('customers').select('*').order('name'),
        supabase.from('sales').select('*').order('created_at', { ascending: false })
      ]);

      if (pError || cError || sError) throw pError || cError || sError;

      if (productsData) setProducts(productsData);
      if (customersData) setCustomers(customersData);
      if (salesData) setSales(salesData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      if (retries > 0) {
        setTimeout(() => fetchData(retries - 1), 2000);
      } else {
        showToast('Erro de conexão: Não foi possível carregar os dados.', 'info');
      }
    }
  };

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSetView = (newView: ViewType) => {
    const adminViews: ViewType[] = ['DASHBOARD', 'CATALOG', 'POS', 'CUSTOMERS', 'SUBSCRIPTIONS'];
    if (adminViews.includes(newView) && !user) {
      setView('LOGIN');
      return;
    }

    setView(newView);
    window.scrollTo(0, 0);
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

  const finishOrder = async (itemsToProcess?: CartItem[], paymentMethod: string = 'Pix', customerId?: string, isIncoming: boolean = false, fiscal?: FiscalInfo) => {
    const list = itemsToProcess || cart;
    if (list.length === 0) return;

    try {
      const subtotal = list.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
      const finalTotal = paymentMethod === 'Pix' && !itemsToProcess ? subtotal * 0.95 : subtotal;

      for (const item of list) {
        const newStock = isIncoming
          ? item.product.stock + item.quantity
          : Math.max(0, item.product.stock - item.quantity);

        await supabase.from('products').update({ stock: newStock }).eq('id', item.product.id);
      }

      if (customerId && !isIncoming) {
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
          await supabase.from('customers').update({
            "totalSpent": customer.totalSpent + finalTotal,
            "ordersCount": customer.ordersCount + 1,
            "lastPurchase": new Date().toISOString()
          }).eq('id', customerId);
        }
      }

      const newSale = {
        "customerName": isIncoming ? 'Fornecedor / Suprimento' : (customers.find(c => c.id === customerId)?.name || 'Cliente Balcão'),
        "total": finalTotal,
        "paymentMethod": isIncoming ? `Entrada: ${paymentMethod}` : paymentMethod,
        "fiscal": fiscal,
        "items": list
      };

      await supabase.from('sales').insert([newSale]);
      await fetchData();

      if (!itemsToProcess) {
        setCart([]);
        setCart([]);
        // setIsOrderComplete(true); // Removed transition screen
        handleSetView('STOREFRONT');
      } else {
        showToast(isIncoming ? "Estoque atualizado (Fornecedor)!" : "Venda PDV concluída!", 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao processar venda no servidor', 'info');
    }
  };

  const updateProduct = async (updated: Product) => {
    try {
      const { error } = await supabase.from('products').update(updated).eq('id', updated.id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      showToast('Produto atualizado!', 'success');
    } catch (err) {
      showToast('Erro ao atualizar produto', 'info');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    handleSetView('STOREFRONT');
  };

  const renderView = () => {
    switch (view) {
      case 'STOREFRONT':
        return <Storefront setView={handleSetView} addToCart={addToCart} products={products} cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />;
      case 'LOGIN':
        return <Login onLogin={() => { }} setView={handleSetView} />;
      case 'DASHBOARD':
        return <Dashboard setView={handleSetView} products={products} sales={sales} customers={customers} showToast={showToast} onLogout={handleLogout} />;
      case 'CATALOG':
        return (
          <Catalog
            setView={handleSetView}
            products={products}
            sales={sales}
            onAddProduct={async (p) => {
              try {
                const { data, error } = await supabase.from('products').insert([p]).select();
                if (error) throw error;
                if (data) setProducts([data[0], ...products]);
                showToast('Produto cadastrado!', 'success');
              } catch (err) {
                showToast('Erro ao cadastrar produto', 'info');
              }
            }}
            onDeleteProduct={async (id) => {
              try {
                const { error } = await supabase.from('products').delete().eq('id', id);
                if (error) throw error;
                setProducts(products.filter(p => p.id !== id));
                showToast('Produto removido!', 'success');
              } catch (err) {
                showToast('Erro ao remover produto', 'info');
              }
            }}
            onUpdateStock={async (id, stock) => {
              try {
                const { error } = await supabase.from('products').update({ stock }).eq('id', id);
                if (error) throw error;
                setProducts(products.map(p => p.id === id ? { ...p, stock } : p));
              } catch (err) {
                showToast('Erro ao atualizar estoque', 'info');
              }
            }}
            onUpdateProduct={updateProduct}
            showToast={showToast}
          />
        );
      case 'POS':
        return (
          <POS
            setView={handleSetView}
            products={products}
            sales={sales}
            customers={customers}
            onFinishSale={finishOrder}
            onAddProduct={async (p) => {
              try {
                const { data, error } = await supabase.from('products').insert([p]).select();
                if (error) throw error;
                const newProd = data[0];
                setProducts([newProd, ...products]);
                showToast('Novo produto cadastrado!', 'success');
                return newProd;
              } catch (err) {
                showToast('Erro ao cadastrar produto rápido', 'info');
                return null;
              }
            }}
          />
        );
      case 'CUSTOMERS':
        return (
          <Customers
            setView={handleSetView}
            customers={customers}
            onAddCustomer={async (c: any) => {
              try {
                const { data, error } = await supabase.from('customers').insert([c]).select();
                if (error) throw error;
                if (data) setCustomers([data[0], ...customers]);
                showToast('Cliente cadastrado!', 'success');
              } catch (err) {
                showToast('Erro ao cadastrar cliente', 'info');
              }
            }}
          />
        );
      case 'CHECKOUT':
        return <Checkout setView={handleSetView} cart={cart} removeFromCart={(id) => setCart(cart.filter(i => i.product.id !== id))} updateQuantity={(id, d) => setCart(cart.map(i => i.product.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i))} onFinish={(method) => finishOrder(undefined, method)} />;
      case 'SUBSCRIPTIONS':
        return <Subscriptions setView={handleSetView} />;
      default:
        return <Storefront setView={handleSetView} addToCart={addToCart} products={products} cartCount={cart.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-text-main font-display selection:bg-primary/20 overflow-x-hidden">
      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 rounded-full shadow-2xl flex items-center gap-4 border-2 ${toast.type === 'success' ? 'bg-white border-green-500 text-green-700' : 'bg-background-dark border-primary text-white'
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
