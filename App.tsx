
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
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    // Carregar dados iniciais independente da sessão
    fetchData();

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setView('STOREFRONT');
      } else {
        fetchData(); // Recarregar dados com privilégios de admin se logado
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [{ data: productsData }, { data: customersData }, { data: salesData }] = await Promise.all([
        supabase.from('products').select('*').order('name'),
        supabase.from('customers').select('*').order('name'),
        supabase.from('sales').select('*').order('created_at', { ascending: false })
      ]);

      if (productsData) setProducts(productsData);
      if (customersData) setCustomers(customersData);
      if (salesData) setSales(salesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Erro ao carregar dados do servidor', 'info');
    } finally {
      setIsLoading(false);
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

  const finishOrder = async (itemsToProcess?: CartItem[], paymentMethod: string = 'Pix', customerId?: string, isIncoming: boolean = false, fiscal?: FiscalInfo) => {
    const list = itemsToProcess || cart;
    if (list.length === 0) return;

    setIsLoading(true);
    try {
      const subtotal = list.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
      const finalTotal = paymentMethod === 'Pix' && !itemsToProcess ? subtotal * 0.95 : subtotal;

      // Atualizar estoque no Supabase
      for (const item of list) {
        const newStock = isIncoming
          ? item.product.stock + item.quantity
          : Math.max(0, item.product.stock - item.quantity);

        await supabase.from('products').update({ stock: newStock }).eq('id', item.product.id);
      }

      // Atualizar cliente se necessário
      if (customerId && !isIncoming) {
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
          await supabase.from('customers').update({
            total_spent: customer.totalSpent + finalTotal,
            orders_count: customer.ordersCount + 1,
            last_purchase: new Date().toISOString()
          }).eq('id', customerId);
        }
      }

      // Registrar venda
      const newSale = {
        customer_name: isIncoming ? 'Fornecedor / Suprimento' : (customers.find(c => c.id === customerId)?.name || 'Cliente Balcão'),
        total: finalTotal,
        payment_method: isIncoming ? `Entrada: ${paymentMethod}` : paymentMethod,
        fiscal_info: fiscal,
        items: list
      };

      await supabase.from('sales').insert([newSale]);

      // Recarregar dados
      await fetchData();

      if (!itemsToProcess) {
        setCart([]);
        setIsOrderComplete(true);
        setTimeout(() => {
          setIsOrderComplete(false);
          handleSetView('STOREFRONT');
        }, 2500);
      } else {
        showToast(isIncoming ? "Estoque atualizado (Fornecedor)!" : "Venda PDV concluída!", 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao processar venda no servidor', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (updated: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updated)
        .eq('id', updated.id);

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
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-8 duration-500 border-2 ${toast.type === 'success' ? 'bg-white border-green-500 text-green-700' : 'bg-background-dark border-primary text-white'
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
