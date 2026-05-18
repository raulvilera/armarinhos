import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { SHOP_CONTACTS } from '../constants';

interface StorefrontProps {
  addToCart: (p: Product) => void;
  products: Product[];
  cartCount: number;
}

export const Storefront: React.FC<StorefrontProps> = ({ addToCart, products, cartCount }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Início');
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const categories = ['Início', 'Acessórios p/ máquina', 'Linhas e fios', 'Barbantes', 'Luminária p/ máquina', 'Aparelhos', 'Outros'];
  const sidebarCategories = ['Acessórios p/ máquina', 'Linhas e fios', 'Barbantes', 'Luminária p/ máquina', 'Aparelhos', 'Outros'];

  const filteredProducts = useMemo(() => products.filter(p => {
    const matchesCategory = activeCategory === 'Início' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [products, activeCategory, search]);

  const handleAddToCart = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    if (p.stock > 0) {
      setAddingId(p.id);
      addToCart(p);
      setTimeout(() => setAddingId(null), 900);
    }
  };

  const openProductDetail = (p: Product) => { setSelectedProduct(p); setCurrentImgIndex(0); };
  const nextImage = () => { if (selectedProduct?.images) setCurrentImgIndex(i => (i + 1) % selectedProduct.images!.length); };
  const prevImage = () => { if (selectedProduct?.images) setCurrentImgIndex(i => (i - 1 + selectedProduct.images!.length) % selectedProduct.images!.length); };

  const categoryIcons: Record<string, string> = {
    'Acessórios p/ máquina': 'settings',
    'Linhas e fios': 'network_node',
    'Barbantes': 'rotate_right',
    'Luminária p/ máquina': 'light_mode',
    'Aparelhos': 'devices',
    'Outros': 'category',
  };

  return (
    <div className="flex flex-col min-h-screen store-hero-bg store-texture font-sans text-foreground">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-blue-100/60 shadow-md">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <button
            onClick={() => { setActiveCategory('Início'); navigate('/'); }}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg border-t border-white/30"
                style={{ 
                  background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
                  boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.25)' 
                }}>
                <span className="material-symbols-outlined text-lg font-black">architecture</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
            </div>
            <div className="text-left leading-none">
              <div className="text-[15px] font-bold text-stone-800 tracking-tight">Vicmar</div>
              <div className="text-[9px] font-semibold text-blue-600 uppercase tracking-[0.25em]">Armarinhos</div>
            </div>
          </button>

          {/* Center: category pills (desktop) */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border-b border-black/15 ${
                  activeCategory === cat
                    ? 'text-white border-t border-white/30 shadow-md'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-blue-50/60 border-t border-transparent'
                }`}
                style={activeCategory === cat ? { 
                  background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
                  boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.25)'
                } : {}}>
                {cat}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearchOpen(v => !v)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border-b border-black/15 ${isSearchOpen ? 'text-white border-t border-white/30 shadow-md' : 'text-stone-500 bg-white border border-blue-100 hover:bg-blue-50/60'}`}
              style={isSearchOpen ? { 
                background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
                boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.25)'
              } : {}}>
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
            <button onClick={() => navigate('/checkout')}
              className="relative w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-stone-600 hover:bg-blue-50/60 transition-all">
              <span className="material-symbols-outlined text-[18px]">shopping_basket</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[18px] rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm border-t border-white/30"
                  style={{ 
                    background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
                    boxShadow: '0 2px 5px rgba(30, 58, 138, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.4)'
                  }}>
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/login')}
              className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-xl text-white text-[11px] font-bold transition-all border-b border-black/15 border-t border-white/30"
              style={{
                background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
                boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.25)'
              }}>
              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
              Lojista
            </button>
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div className="border-t border-blue-100/60 bg-white/95 px-5 lg:px-10 py-3">
            <div className="max-w-7xl mx-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-blue-500">search</span>
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-blue-50/20 border border-blue-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-300/50 placeholder:text-stone-400"
                placeholder="Busque por linhas, correias, agulhas..." />
            </div>
          </div>
        )}

        {/* Mobile categories */}
        <div className="md:hidden border-t border-blue-100/60 bg-white/80 px-4 py-2.5 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 w-max">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border-b border-black/15 ${
                  activeCategory === cat ? 'text-white border-t border-white/30 shadow-md' : 'text-stone-500 bg-stone-100 border-t border-transparent'
                }`}
                style={activeCategory === cat ? { 
                  background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
                  boxShadow: '0 3px 8px rgba(30, 58, 138, 0.25), inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -1.5px 2px rgba(0, 0, 0, 0.25)'
                } : {}}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="px-5 lg:px-10 pt-8 pb-4 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-amber-200/20 bg-[#faf6f0] flex flex-col md:flex-row min-h-[300px] md:h-[380px]">
          
          {/* LEFT SIDE: Realistic Store Shelves (Takes 45% on desktop, fits perfectly, no distortion) */}
          <div className="w-full md:w-[45%] h-48 md:h-full relative overflow-hidden shrink-0">
            <img 
              src="/assets/banner-orig.jpg" 
              alt="Prateleiras de Aviamentos Vicmar" 
              className="w-full h-full object-cover object-left md:object-center transition-transform duration-700 hover:scale-[1.03]"
            />
            {/* Smooth elegant gradient blending the photo into the cream text background */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#faf6f0]/10 to-[#faf6f0] pointer-events-none" />
          </div>

          {/* RIGHT SIDE: Elegant Calligraphy & Custom Info (Takes 55% and adapts perfectly) */}
          <div className="flex-1 flex flex-col justify-center p-6 md:p-10 lg:p-12 relative text-left">
            
            {/* Fine decorative top line */}
            <div className="absolute top-4 right-8 opacity-10 pointer-events-none select-none hidden lg:block">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 35 C 30 10, 80 50, 115 5" stroke="#db2777" strokeWidth="1.5" strokeDasharray="3 3"/>
              </svg>
            </div>

            {/* Typography & Slogan */}
            <div className="space-y-1 md:space-y-2 mb-4 max-w-xl">
              <h3 className="font-sans text-stone-500 text-[13px] md:text-sm font-semibold tracking-wide uppercase">
                Vicmar Armarinhos
              </h3>
              <h2 className="font-serif text-[24px] md:text-[34px] lg:text-[40px] text-stone-800 font-normal leading-tight">
                Tudo o que você <br className="xs:hidden" />
                <span className="font-cursive text-pink-600 text-[38px] md:text-[54px] lg:text-[62px] leading-none inline-block align-middle px-1">
                  imagina,
                </span>
                <br className="hidden md:block" />
                <span className="relative inline-block md:ml-2">
                  a gente tem!
                  {/* Subtle underline stroke below "a gente tem" */}
                  <span className="absolute left-0 bottom-0.5 w-full h-[2px] bg-pink-100 rounded" />
                </span>
              </h2>
              <p className="text-stone-500 text-[11px] md:text-[13px] leading-relaxed max-w-md pt-1">
                A maior variedade de aviamentos para dar <span className="text-pink-600 font-semibold">vida às suas criações</span>.
              </p>
            </div>

            {/* 4 Quality Badges (Horizontal scroll on mobile, perfect flex on desktop) */}
            <div className="flex items-center gap-3 md:gap-5 overflow-x-auto scrollbar-hide py-1 mb-5">
              
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                  <span className="material-symbols-outlined text-[16px] font-bold">verified</span>
                </div>
                <div className="leading-none">
                  <p className="text-[9px] font-bold text-stone-700 uppercase">Qualidade</p>
                  <p className="text-[8px] text-stone-400">Que você confia</p>
                </div>
              </div>

              <div className="w-px h-6 bg-stone-200 shrink-0 hidden sm:block" />

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                  <span className="material-symbols-outlined text-[16px] font-bold">dashboard</span>
                </div>
                <div className="leading-none">
                  <p className="text-[9px] font-bold text-stone-700 uppercase">Variedade</p>
                  <p className="text-[8px] text-stone-400">Que inspira</p>
                </div>
              </div>

              <div className="w-px h-6 bg-stone-200 shrink-0 hidden sm:block" />

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                  <span className="material-symbols-outlined text-[16px] font-bold">shopping_bag</span>
                </div>
                <div className="leading-none">
                  <p className="text-[9px] font-bold text-stone-700 uppercase">Compre Fácil</p>
                  <p className="text-[8px] text-stone-400">Online 24 horas</p>
                </div>
              </div>

              <div className="w-px h-6 bg-stone-200 shrink-0 hidden sm:block" />

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                  <span className="material-symbols-outlined text-[16px] font-bold">local_shipping</span>
                </div>
                <div className="leading-none">
                  <p className="text-[9px] font-bold text-stone-700 uppercase">Envio Rápido</p>
                  <p className="text-[8px] text-stone-400">Para toda região</p>
                </div>
              </div>

            </div>

            {/* Bottom CTA Button */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('departamentos-title');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-semibold text-white bg-pink-600 shadow-md shadow-pink-600/20 hover:bg-pink-700 hover:shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">favorite</span>
                Seu projeto começa aqui!
              </button>
              
              <div className="hidden sm:flex items-center gap-2 bg-[#f3eae0] px-3.5 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-stone-600 text-xs">location_on</span>
                <span className="text-[9px] font-bold text-stone-600 uppercase tracking-wider">Av. Imperador 4877</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl mx-auto px-5 lg:px-10 py-6 w-full">
        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <aside className="hidden lg:flex w-56 shrink-0 flex-col gap-2 sticky top-40">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 px-3 mb-1">Departamentos</p>
            {sidebarCategories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[12px] font-semibold transition-all text-left ${
                  activeCategory === cat
                    ? 'text-white shadow-md'
                    : 'text-stone-500 hover:text-stone-800 bg-white hover:bg-amber-50 border border-amber-100/60 shadow-sm'
                }`}
                style={activeCategory === cat ? { background: 'linear-gradient(135deg, hsl(35 72% 44%), hsl(28 68% 36%))' } : {}}>
                <span className={`material-symbols-outlined text-[16px] ${activeCategory === cat ? 'text-white/80' : 'text-amber-500'}`}>
                  {categoryIcons[cat] || 'category'}
                </span>
                {cat}
              </button>
            ))}

            {/* Contact card */}
            <div className="mt-4 p-4 rounded-xl border border-amber-100 bg-white shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-2">Atendimento</p>
              <p className="text-[11px] text-stone-500 mb-3 leading-snug">Dúvidas sobre produtos? Fale conosco!</p>
              <a href={SHOP_CONTACTS.whatsappUrl} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-white text-[11px] font-semibold"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                <span className="material-symbols-outlined text-[14px]">call</span>
                WhatsApp
              </a>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 w-full min-w-0">
            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg md:text-xl font-semibold text-stone-800">
                {activeCategory === 'Início' ? 'Todos os Produtos' : activeCategory}
              </h3>
              <span className="text-[11px] text-stone-400 font-medium">{filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'itens'}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(p => (
                <div key={p.id} onClick={() => openProductDetail(p)}
                  className="bg-white rounded-2xl border border-amber-100/70 overflow-hidden cursor-pointer card-lift group relative flex flex-col shadow-sm">

                  {/* Image */}
                  <div className="relative aspect-square bg-amber-50/50 flex items-center justify-center overflow-hidden">
                    <img src={p.image} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-110" alt="" />
                    <img src={p.image} className="relative z-10 w-4/5 h-4/5 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105" alt={p.name} />
                    {p.stock <= 0 && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-red-500">Esgotado</span>
                      </div>
                    )}
                    {p.stock > 0 && p.stock <= 5 && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="px-2 py-1 rounded-full text-[9px] font-bold uppercase text-amber-700 bg-amber-100 border border-amber-200">Últimas un.</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5 flex flex-col flex-1">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-amber-600/70 mb-1">{p.category}</p>
                    <p className="text-[11px] font-semibold text-stone-700 leading-tight line-clamp-2 flex-1">{p.name}</p>
                    <div className="mt-3 pt-3 border-t border-amber-50 flex items-center justify-between">
                      <div className="font-mono-price">
                        <p className="text-[9px] text-stone-300 font-medium">R$</p>
                        <p className="text-base font-bold text-stone-800 leading-none">{p.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <button disabled={p.stock <= 0} onClick={e => handleAddToCart(e, p)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          addingId === p.id
                            ? 'bg-green-500 text-white scale-110 shadow-md'
                            : p.stock <= 0
                            ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                            : 'text-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
                        }`}
                        style={addingId === p.id || p.stock <= 0 ? {} : { background: 'linear-gradient(135deg, hsl(35 72% 44%), hsl(28 68% 36%))' }}>
                        <span className="material-symbols-outlined text-[14px] font-black">
                          {addingId === p.id ? 'done' : 'add_shopping_cart'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-24 flex flex-col items-center gap-4 text-stone-300">
                <span className="material-symbols-outlined text-6xl">search_off</span>
                <p className="text-sm font-semibold uppercase tracking-wider">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── PRODUCT MODAL ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative z-10 w-full max-w-4xl bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl max-h-[95vh] sm:max-h-[88vh] border border-amber-100/30 animate-fade-in">

            {/* Image panel */}
            <div className="w-full lg:w-5/12 shrink-0 bg-amber-50/60 relative flex items-center justify-center p-8 min-h-[260px] lg:min-h-[auto]">
              <img src={selectedProduct.images?.[currentImgIndex] || selectedProduct.image}
                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-15" alt="" />
              <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                <img src={selectedProduct.images?.[currentImgIndex] || selectedProduct.image}
                  className="w-full h-full object-contain drop-shadow-xl" alt={selectedProduct.name} />
              </div>
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <>
                  <div className="absolute inset-x-3 inset-y-0 flex items-center justify-between pointer-events-none">
                    <button onClick={prevImage} className="pointer-events-auto w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md border border-amber-100 text-stone-600 hover:bg-white transition-all">
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    <button onClick={nextImage} className="pointer-events-auto w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md border border-amber-100 text-stone-600 hover:bg-white transition-all">
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                    {selectedProduct.images.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentImgIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${idx === currentImgIndex ? 'w-6 bg-amber-500' : 'w-1.5 bg-amber-300/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Info panel */}
            <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto scrollbar-hide relative">
              <button onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-all text-stone-500">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>

              <div className="mb-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4 border"
                  style={{ color: 'hsl(35 72% 44%)', background: 'hsl(38 60% 94%)', borderColor: 'hsl(38 40% 85%)' }}>
                  <span className="material-symbols-outlined text-[12px]">{categoryIcons[selectedProduct.category] || 'category'}</span>
                  {selectedProduct.category}
                </span>

                <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-800 leading-tight mb-3">{selectedProduct.name}</h2>
                <p className="text-stone-500 text-sm leading-relaxed mb-5">{selectedProduct.description}</p>

                {selectedProduct.spec && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">Especificações</p>
                    <p className="text-[12px] text-stone-600 font-medium leading-snug">{selectedProduct.spec}</p>
                  </div>
                )}

                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
                  selectedProduct.stock <= 0 ? 'bg-red-50 border-red-100 text-red-600'
                  : selectedProduct.stock <= 5 ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-green-50 border-green-100 text-green-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedProduct.stock <= 0 ? 'bg-red-500'
                    : selectedProduct.stock <= 5 ? 'bg-amber-500'
                    : 'bg-green-500'}`} />
                  {selectedProduct.stock <= 0 ? 'Esgotado'
                    : selectedProduct.stock <= 5 ? `Últimas ${selectedProduct.stock} unidades`
                    : `${selectedProduct.stock} unidades em estoque`}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-amber-100">
                <div className="flex items-end justify-between mb-5">
                  <div className="font-mono-price">
                    <p className="text-[10px] font-medium text-stone-400">Preço</p>
                    <p className="text-4xl font-bold text-stone-800 leading-none">
                      <span className="text-lg mr-1 text-stone-400">R$</span>
                      {selectedProduct.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button disabled={selectedProduct.stock <= 0}
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold btn-store-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    {selectedProduct.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                  </button>
                  <a href={`${SHOP_CONTACTS.whatsappUrl}?text=Olá! Gostaria de informações sobre: ${selectedProduct.name}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold btn-whatsapp">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    Perguntar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="mt-12 border-t border-amber-100 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, hsl(35 72% 44%), hsl(28 68% 36%))' }}>
              <span className="material-symbols-outlined text-lg">architecture</span>
            </div>
            <div>
              <p className="font-serif text-base font-bold text-stone-800">Armarinhos Vicmar</p>
              <p className="text-[10px] text-stone-400 font-medium tracking-wider">Tradição e qualidade · Av. Imperador 4877</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={SHOP_CONTACTS.whatsappUrl} target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[12px] font-semibold shadow-sm"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              <span className="material-symbols-outlined text-[15px]">call</span>
              WhatsApp
            </a>
            <a href={SHOP_CONTACTS.instagramUrl} target="_blank"
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-amber-100 text-stone-500 hover:bg-amber-50 hover:text-amber-600 transition-all">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </a>
          </div>
        </div>
        <div className="border-t border-amber-50 py-4 text-center">
          <p className="text-[10px] text-stone-300 font-medium">© 2025 Armarinhos Vicmar · Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};
