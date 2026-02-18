
import React, { useState } from 'react';
import { ViewType, CartItem } from '../types';

interface CheckoutProps {
  setView: (v: ViewType) => void;
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  onFinish: (method: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ setView, cart, removeFromCart, updateQuantity, onFinish }) => {
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão' | 'Boleto'>('Pix');
  
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discount = paymentMethod === 'Pix' ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-background-light animate-in slide-in-from-right duration-500 font-display">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary/5 py-4 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div onClick={() => setView('STOREFRONT')} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-primary size-9 rounded-xl flex items-center justify-center text-white transition-transform group-hover:-rotate-6 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-black">architecture</span>
            </div>
            <h1 className="text-lg font-black text-primary uppercase tracking-tighter leading-none">Vicmar</h1>
          </div>
          <button 
            onClick={() => setView('STOREFRONT')}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-selected flex items-center gap-2 transition-colors font-black"
          >
            <span className="material-symbols-outlined text-sm font-black">arrow_back</span>
            Continuar comprando
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-12">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl font-black tracking-tight uppercase leading-none">Minha Sacola</h2>
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{cart.length} itens</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            <section>
              {cart.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-dashed border-primary/20 flex flex-col items-center text-center shadow-sm">
                  <div className="size-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-6 text-primary">
                    <span className="material-symbols-outlined text-5xl font-black">shopping_basket</span>
                  </div>
                  <p className="text-xl font-black text-primary mb-6 uppercase tracking-tight">Sua sacola está vazia</p>
                  <button 
                    onClick={() => setView('STOREFRONT')} 
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20"
                  >
                    Ir para Vitrine
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-neutral-light flex items-center gap-6 group hover:shadow-xl transition-all">
                      <div className="size-28 rounded-2xl overflow-hidden bg-white shrink-0 border border-gray-100 p-2 shadow-inner">
                        <img src={item.product.image} className="w-full h-full object-contain" alt={item.product.name} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-lg mb-1 uppercase tracking-tight text-gray-800 line-clamp-1 leading-none">{item.product.name}</h4>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-4">{item.product.spec}</p>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center border border-primary/10 rounded-xl h-10 overflow-hidden bg-gray-50 shadow-inner">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="px-4 hover:bg-white text-primary font-black transition-colors">-</button>
                            <span className="w-8 text-center text-xs font-black text-text-main">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="px-4 hover:bg-white text-primary font-black transition-colors">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="flex items-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-widest hover:scale-105 transition-all">
                            <span className="material-symbols-outlined text-lg font-black">delete</span>
                            Remover
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary tracking-tighter">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-tight">un. R$ {item.product.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={cart.length === 0 ? 'opacity-20 pointer-events-none' : 'animate-in fade-in slide-in-from-bottom-5'}>
              <h3 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-4 text-text-main">
                <span className="bg-primary text-white size-8 rounded-full flex items-center justify-center text-xs font-black">02</span>
                Forma de Pagamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  onClick={() => setPaymentMethod('Pix')}
                  className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer relative group flex flex-col gap-2 ${paymentMethod === 'Pix' ? 'border-selected bg-selected/5 shadow-xl shadow-selected/5' : 'border-neutral-light bg-white hover:border-primary/40'}`}
                >
                  <span className={`material-symbols-outlined text-3xl font-black ${paymentMethod === 'Pix' ? 'text-selected' : 'text-gray-300'}`}>pix</span>
                  <p className={`font-black uppercase text-xs ${paymentMethod === 'Pix' ? 'text-selected' : 'text-gray-400'}`}>Pix</p>
                  <p className="text-[10px] text-selected font-black uppercase tracking-widest">5% de Desconto</p>
                  {paymentMethod === 'Pix' && <div className="absolute top-4 right-4 text-selected animate-in zoom-in"><span className="material-symbols-outlined font-black">check_circle</span></div>}
                </div>
                <div 
                  onClick={() => setPaymentMethod('Cartão')}
                  className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer relative group flex flex-col gap-2 ${paymentMethod === 'Cartão' ? 'border-selected bg-selected/5 shadow-xl shadow-selected/5' : 'border-neutral-light bg-white hover:border-primary/40'}`}
                >
                  <span className={`material-symbols-outlined text-3xl font-black ${paymentMethod === 'Cartão' ? 'text-selected' : 'text-gray-300'}`}>credit_card</span>
                  <p className={`font-black uppercase text-xs ${paymentMethod === 'Cartão' ? 'text-selected' : 'text-gray-400'}`}>Cartão</p>
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Até 6x s/ juros</p>
                  {paymentMethod === 'Cartão' && <div className="absolute top-4 right-4 text-selected animate-in zoom-in"><span className="material-symbols-outlined font-black">check_circle</span></div>}
                </div>
                <div 
                  onClick={() => setPaymentMethod('Boleto')}
                  className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer relative group flex flex-col gap-2 ${paymentMethod === 'Boleto' ? 'border-selected bg-selected/5 shadow-xl shadow-selected/5' : 'border-neutral-light bg-white hover:border-primary/40'}`}
                >
                  <span className={`material-symbols-outlined text-3xl font-black ${paymentMethod === 'Boleto' ? 'text-selected' : 'text-gray-300'}`}>payments</span>
                  <p className={`font-black uppercase text-xs ${paymentMethod === 'Boleto' ? 'text-selected' : 'text-gray-400'}`}>Boleto</p>
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">À vista</p>
                  {paymentMethod === 'Boleto' && <div className="absolute top-4 right-4 text-selected animate-in zoom-in"><span className="material-symbols-outlined font-black">check_circle</span></div>}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-primary/5 border border-primary/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-8xl text-primary scale-[2] font-black">receipt_long</span>
              </div>
              <h3 className="text-2xl font-black mb-10 tracking-tight uppercase text-text-main">Resumo</h3>
              <div className="space-y-6 mb-10 pb-10 border-b border-gray-100">
                <div className="flex justify-between text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-black">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
                  <span>Frete</span>
                  <span className="text-selected font-black uppercase">GRÁTIS</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-selected font-black text-[10px] uppercase tracking-[0.2em] animate-in slide-in-from-left">
                    <span>Desconto ({paymentMethod})</span>
                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-4">
                  <span className="text-lg font-black uppercase tracking-tighter text-text-main">Total</span>
                  <div className="text-right">
                    <p className="text-4xl font-black text-primary tracking-tighter animate-pulse">R$ {total.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              </div>

              <button 
                disabled={cart.length === 0}
                onClick={() => onFinish(paymentMethod)}
                className="w-full bg-primary text-white py-6 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:grayscale disabled:opacity-50 group uppercase tracking-widest font-black"
              >
                Finalizar Pedido
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform font-black">rocket_launch</span>
              </button>

              <p className="text-center text-[9px] text-gray-400 font-black mt-8 uppercase tracking-[0.3em] italic font-black">Vicmar • Tecnologia e Carinho</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
