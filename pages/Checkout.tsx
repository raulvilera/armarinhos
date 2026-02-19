
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
    <div className="min-h-screen bg-[#F8F7F9] font-display selection:bg-primary/10">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div onClick={() => setView('STOREFRONT')} className="flex items-center gap-2 md:gap-3 cursor-pointer group">
            <div className="bg-primary size-8 md:size-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-6 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-black text-lg md:text-xl">architecture</span>
            </div>
            <h1 className="text-base md:text-lg font-black text-primary uppercase tracking-tighter leading-none">Vicmar</h1>
          </div>
          <button
            onClick={() => setView('STOREFRONT')}
            className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary hover:text-selected flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm md:text-base">arrow_back</span>
            <span className="hidden sm:inline">Continuar comprando</span>
            <span className="sm:hidden">Voltar</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 md:gap-4 mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase leading-none text-gray-900">Minha Sacola</h2>
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-widest">{cart.length} itens</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Itens e Pagamento */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            <section>
              {cart.length === 0 ? (
                <div className="bg-white p-12 md:p-20 rounded-[2.5rem] md:rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center text-center shadow-sm">
                  <div className="size-20 md:size-24 bg-primary/5 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-6 text-primary">
                    <span className="material-symbols-outlined text-4xl md:text-5xl font-black">shopping_basket</span>
                  </div>
                  <p className="text-lg md:text-xl font-black text-gray-400 mb-6 uppercase tracking-tight">Sua sacola está vazia</p>
                  <button
                    onClick={() => setView('STOREFRONT')}
                    className="bg-primary text-white px-8 md:px-10 py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    Ir para Vitrine
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 md:gap-6 group hover:shadow-xl transition-all">
                      <div className="size-24 md:size-28 rounded-xl md:rounded-2xl overflow-hidden bg-white shrink-0 border border-gray-50 p-2 shadow-inner">
                        <img src={item.product.image} className="w-full h-full object-contain" alt={item.product.name} />
                      </div>
                      <div className="flex-1 text-center sm:text-left w-full">
                        <h4 className="font-black text-base md:text-lg mb-1 uppercase tracking-tight text-gray-800 line-clamp-1 leading-none">{item.product.name}</h4>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-4">{item.product.spec}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-6">
                          <div className="flex items-center border border-gray-100 rounded-lg md:rounded-xl h-10 overflow-hidden bg-gray-50 shadow-inner">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="px-4 hover:bg-white text-primary font-black transition-colors">-</button>
                            <span className="w-8 text-center text-xs font-black text-gray-900">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="px-4 hover:bg-white text-primary font-black transition-colors">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="flex items-center gap-2 text-[9px] font-black text-red-600 uppercase tracking-widest hover:scale-105 transition-all">
                            <span className="material-symbols-outlined text-lg">delete</span>
                            <span className="hidden sm:inline">Remover</span>
                          </button>
                        </div>
                      </div>
                      <div className="text-center sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                        <p className="text-xl md:text-2xl font-black text-primary tracking-tighter">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                        <p className="text-[9px] font-black text-gray-300 uppercase">un. R$ {item.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={cart.length === 0 ? 'opacity-20 pointer-events-none' : 'animate-in fade-in slide-in-from-bottom-5'}>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-4 text-gray-900">
                <span className="bg-primary text-white size-8 rounded-full flex items-center justify-center text-xs font-black">02</span>
                Forma de Pagamento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setPaymentMethod('Pix')}
                  className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${paymentMethod === 'Pix' ? 'border-selected bg-selected/5 shadow-xl shadow-selected/5' : 'border-gray-100 bg-white hover:border-primary/40'}`}
                >
                  <span className={`material-symbols-outlined text-3xl font-black ${paymentMethod === 'Pix' ? 'text-selected' : 'text-gray-300'}`}>pix</span>
                  <p className={`font-black uppercase text-[10px] md:text-xs ${paymentMethod === 'Pix' ? 'text-selected' : 'text-gray-400'}`}>Pix</p>
                  <p className="text-[9px] text-selected font-black uppercase tracking-widest animate-pulse">5% OFF</p>
                  {paymentMethod === 'Pix' && <div className="absolute top-4 right-4 text-selected animate-in zoom-in"><span className="material-symbols-outlined font-black">check_circle</span></div>}
                </div>
                <div
                  onClick={() => setPaymentMethod('Cartão')}
                  className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${paymentMethod === 'Cartão' ? 'border-selected bg-selected/5 shadow-xl shadow-selected/5' : 'border-gray-100 bg-white hover:border-primary/40'}`}
                >
                  <span className={`material-symbols-outlined text-3xl font-black ${paymentMethod === 'Cartão' ? 'text-selected' : 'text-gray-300'}`}>credit_card</span>
                  <p className={`font-black uppercase text-[10px] md:text-xs ${paymentMethod === 'Cartão' ? 'text-selected' : 'text-gray-400'}`}>Cartão</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Em até 6x</p>
                  {paymentMethod === 'Cartão' && <div className="absolute top-4 right-4 text-selected animate-in zoom-in"><span className="material-symbols-outlined font-black">check_circle</span></div>}
                </div>
                <div
                  onClick={() => setPaymentMethod('Boleto')}
                  className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${paymentMethod === 'Boleto' ? 'border-selected bg-selected/5 shadow-xl shadow-selected/5' : 'border-gray-100 bg-white hover:border-primary/40'}`}
                >
                  <span className={`material-symbols-outlined text-3xl font-black ${paymentMethod === 'Boleto' ? 'text-selected' : 'text-gray-300'}`}>payments</span>
                  <p className={`font-black uppercase text-[10px] md:text-xs ${paymentMethod === 'Boleto' ? 'text-selected' : 'text-gray-400'}`}>Boleto</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">À vista</p>
                  {paymentMethod === 'Boleto' && <div className="absolute top-4 right-4 text-selected animate-in zoom-in"><span className="material-symbols-outlined font-black">check_circle</span></div>}
                </div>
              </div>
            </section>
          </div>

          {/* Resumo (Sticky) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-primary/5 border border-gray-100 sticky top-28 overflow-hidden">
              <div className="absolute -top-6 -right-6 opacity-5 rotate-12 pointer-events-none">
                <span className="material-symbols-outlined text-[120px] text-primary font-black">receipt_long</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-10 tracking-tight uppercase text-gray-900 border-b border-gray-50 pb-6 relative z-10">Resumo</h3>
              <div className="space-y-6 mb-10 relative z-10">
                <div className="flex justify-between text-gray-400 font-black text-[10px] uppercase tracking-widest">
                  <span>Subtotal ({cart.length} itens)</span>
                  <span className="text-gray-900">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-black text-[10px] uppercase tracking-widest">
                  <span>Entrega</span>
                  <span className="text-selected font-black uppercase">Grátis</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-selected font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-left">
                    <span>Desconto Pagamento</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                  <span className="text-lg font-black uppercase tracking-tighter text-gray-900">Total Geral</span>
                  <div className="text-right">
                    <p className="text-3xl md:text-4xl font-black text-primary tracking-tighter">R$ {total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={() => onFinish(paymentMethod)}
                className="w-full bg-primary text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40 uppercase tracking-widest relative z-10"
              >
                Finalizar Pedido
                <span className="material-symbols-outlined text-xl font-black">rocket_launch</span>
              </button>

              <div className="pt-8 text-center relative z-10">
                <p className="text-[8px] md:text-[9px] text-gray-300 font-black uppercase tracking-[0.4em] italic leading-tight">Compra Segura • SSL Digital<br />Vicmar Armarinhos</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
