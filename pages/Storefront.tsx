
import React, { useRef, useState, useMemo } from 'react';
import { ViewType, Product } from '../types';
import { SHOP_CONTACTS } from '../constants';

interface StorefrontProps {
  setView: (v: ViewType) => void;
  addToCart: (p: Product) => void;
  products: Product[];
  cartCount: number;
}

export const Storefront: React.FC<StorefrontProps> = ({ setView, addToCart, products, cartCount }) => {
  const [activeCategory, setActiveCategory] = useState('Início');
  const [search, setSearch] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  const categoriesRef = useRef<HTMLDivElement>(null);

  const categories = ['Início', 'Acessórios p/ máquina', 'Linhas e fios', 'Barbantes', 'Luminária p/ máquina', 'Aparelhos', 'Outros'];
  const sidebarCategories = ['Acessórios p/ máquina', 'Linhas e fios', 'Barbantes', 'Luminária p/ máquina', 'Aparelhos', 'Outros'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'Início' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  const handleAddToCart = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    if (p.stock > 0) {
      setAddingId(p.id);
      addToCart(p);
      setTimeout(() => setAddingId(null), 800);
    }
  };

  const openProductDetail = (p: Product) => {
    setSelectedProduct(p);
    setCurrentImgIndex(0);
  };

  const nextImage = () => {
    if (selectedProduct?.images) {
      setCurrentImgIndex((prev) => (prev + 1) % selectedProduct.images!.length);
    }
  };

  const prevImage = () => {
    if (selectedProduct?.images) {
      setCurrentImgIndex((prev) => (prev - 1 + selectedProduct.images!.length) % selectedProduct.images!.length);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFD] animate-in fade-in duration-700 font-display text-text-main">
      {/* Header Premium */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-6 px-6 lg:px-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setActiveCategory('Início'); setView('STOREFRONT'); }}>
             <div className="bg-primary size-11 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                <span className="material-symbols-outlined text-2xl font-black">architecture</span>
             </div>
             <div className="flex flex-col">
                <h1 className="text-xl font-black text-primary tracking-tighter uppercase leading-none text-left">Vicmar</h1>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest text-left">Armarinhos</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('CHECKOUT')} 
              className="relative size-12 bg-white border border-gray-100 border-b-4 rounded-2xl text-primary hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center group"
              aria-label="Ver Carrinho"
            >
              <span className="material-symbols-outlined text-2xl font-black">shopping_basket</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-selected text-white size-5 rounded-full text-[10px] flex items-center justify-center font-black ring-4 ring-white shadow-lg animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView('LOGIN')} 
              className="size-12 bg-gray-50 border border-gray-100 border-b-4 rounded-2xl flex items-center justify-center text-primary hover:bg-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-1 active:border-b-0 transition-all"
              aria-label="Área do Lojista"
            >
              <span className="material-symbols-outlined text-2xl font-black">admin_panel_settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Barra de Busca e Filtros Superior com efeito 3D */}
      <div className="bg-white border-b border-gray-50 py-6 px-6 lg:px-20 sticky top-[89px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className={`size-12 rounded-2xl flex items-center justify-center border-b-4 transition-all ${isSearchVisible ? 'bg-primary text-white border-primary/40 shadow-lg' : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="material-symbols-outlined font-black">search</span>
            </button>

            <div className="flex flex-1 items-center gap-3 overflow-hidden relative">
               <div ref={categoriesRef} className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-1 py-2">
                 {categories.map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => setActiveCategory(cat)} 
                     className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-4 shadow-sm hover:-translate-y-0.5 active:translate-y-1 active:border-b-0 ${
                       activeCategory === cat 
                       ? 'bg-selected text-white border-selected/40 shadow-selected/20' 
                       : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {isSearchVisible && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <input 
                autoFocus
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-300 shadow-inner font-black"
                placeholder="Busque por linhas, correias, agulhas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-20 py-12 w-full">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <aside className="hidden md:flex w-64 shrink-0 flex-col gap-8 sticky top-[230px]">
            <div className="flex flex-col space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1 px-2 text-left">Departamentos</h3>
              {sidebarCategories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border-b-4 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-1 active:border-b-0 ${
                    activeCategory === cat 
                    ? 'bg-primary text-white border-primary/40 shadow-primary/20' 
                    : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => openProductDetail(p)} 
                  className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer flex flex-col h-full relative"
                >
                  <div className="relative overflow-hidden bg-gray-50 aspect-square flex items-center justify-center">
                    <img 
                      src={p.image} 
                      className="absolute inset-0 w-full h-full object-cover blur-[18px] opacity-40 scale-125 transition-transform group-hover:scale-150 duration-1000" 
                      alt=""
                    />
                    <img 
                      src={p.image} 
                      className="relative z-10 w-4/5 h-4/5 object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl" 
                      alt={p.name} 
                    />
                    {p.stock <= 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Esgotado</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 pt-4 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[8px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1">{p.category}</p>
                      <p className="text-[11px] font-black text-gray-800 mb-4 line-clamp-2 uppercase leading-tight h-8">{p.name}</p>
                    </div>
                    <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                       <p className="text-lg font-black text-gray-900 tracking-tighter"><span className="text-[10px] uppercase text-gray-300 mr-1">R$</span>{p.price.toFixed(2).replace('.', ',')}</p>
                       <button 
                         disabled={p.stock <= 0} 
                         onClick={(e) => handleAddToCart(e, p)} 
                         className={`size-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${addingId === p.id ? 'bg-selected text-white scale-110 shadow-selected/20' : 'bg-primary text-white hover:bg-primary/90'}`}
                       >
                         <span className="material-symbols-outlined font-black text-base">{addingId === p.id ? 'done' : 'add_shopping_cart'}</span>
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center opacity-30">
                <span className="material-symbols-outlined text-7xl font-black mb-4">search_off</span>
                <p className="font-black uppercase tracking-widest">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Detalhes - Kyte Premium Style */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)}></div>
           <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden relative z-10 flex flex-col lg:flex-row animate-in zoom-in duration-500 shadow-2xl max-h-[90vh] border border-white/10">
              
              {/* Galeria de Imagens do Modal */}
              <div className="w-full lg:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden relative border-r border-gray-100">
                 <img src={selectedProduct.images?.[currentImgIndex] || selectedProduct.image} className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20" alt="" />
                 
                 <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                    <img 
                      src={selectedProduct.images?.[currentImgIndex] || selectedProduct.image} 
                      className="w-full h-full object-contain mix-blend-multiply animate-in fade-in zoom-in duration-500 drop-shadow-xl" 
                      alt={selectedProduct.name} 
                    />
                    
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-2">
                        <button 
                          onClick={prevImage}
                          className="pointer-events-auto bg-white/95 size-12 rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all text-primary active:scale-90 border border-gray-100"
                        >
                          <span className="material-symbols-outlined font-black text-3xl">chevron_left</span>
                        </button>
                        <button 
                          onClick={nextImage}
                          className="pointer-events-auto bg-white/95 size-12 rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all text-primary active:scale-90 border border-gray-100"
                        >
                          <span className="material-symbols-outlined font-black text-3xl">chevron_right</span>
                        </button>
                      </div>
                    )}
                 </div>

                 {selectedProduct.images && selectedProduct.images.length > 1 && (
                   <ul className="flex gap-2 mt-8 relative z-10">
                      {selectedProduct.images.map((_, idx) => (
                        <li 
                          key={idx}
                          onClick={() => setCurrentImgIndex(idx)}
                          className={`size-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentImgIndex ? 'bg-primary w-8 shadow-lg shadow-primary/20' : 'bg-primary/20 hover:bg-primary/40'}`}
                        />
                      ))}
                   </ul>
                 )}
              </div>

              {/* Informações do Produto (Painel Direito) */}
              <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col bg-white overflow-y-auto text-left relative">
                 <button onClick={() => setSelectedProduct(null)} className="absolute top-10 right-10 size-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100">
                   <span className="material-symbols-outlined font-black">close</span>
                 </button>

                 <div className="mb-auto">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/5 px-6 py-3 rounded-full border border-primary/10 mb-8 inline-block">{selectedProduct.category}</span>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-none uppercase tracking-tighter mb-6">{selectedProduct.name}</h2>
                    <p className="text-gray-500 leading-relaxed font-bold text-base mb-10">{selectedProduct.description}</p>
                    
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                       <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Detalhes e Especificações</p>
                       <p className="text-sm font-black text-gray-700 uppercase leading-snug">{selectedProduct.spec || 'Uso Profissional • Armarinhos Vicmar'}</p>
                    </div>
                 </div>
                 
                 <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                       <p className="text-5xl font-black text-primary tracking-tighter"><span className="text-lg mr-2">R$</span>{selectedProduct.price.toFixed(2).replace('.', ',')}</p>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-1">Status de Disponibilidade</p>
                          <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-full ${selectedProduct.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {selectedProduct.stock > 0 ? `${selectedProduct.stock} un. em estoque` : 'Esgotado'}
                          </span>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <button 
                         disabled={selectedProduct.stock <= 0} 
                         onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} 
                         className="bg-primary text-white py-6 rounded-[1.5rem] font-black text-base shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:grayscale disabled:opacity-50"
                       >
                         {selectedProduct.stock > 0 ? 'Adicionar ao Carrinho' : 'Avise-me'}
                       </button>
                       <a 
                        href={`${SHOP_CONTACTS.whatsappUrl}?text=Olá! Gostaria de mais informações sobre: ${selectedProduct.name}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-[#25D366] text-white py-6 rounded-[1.5rem] font-black text-base shadow-xl shadow-green-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                       >
                         <span className="material-symbols-outlined">call</span>
                         Tire suas Dúvidas
                       </a>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <footer className="py-20 px-6 lg:px-20 bg-white border-t border-gray-100 mt-auto">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left">
               <h4 className="text-xl font-black text-primary uppercase tracking-tighter leading-none">Armarinhos Vicmar</h4>
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mt-3 italic">Tradição e Qualidade em Aviamentos • Av. Imperador 4877</p>
            </div>
            <div className="flex gap-4">
               <a href={SHOP_CONTACTS.whatsappUrl} target="_blank" className="size-12 bg-gray-50 text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100">
                  <span className="material-symbols-outlined font-black">call</span>
               </a>
               <a href={SHOP_CONTACTS.instagramUrl} target="_blank" className="size-12 bg-gray-50 text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100">
                  <span className="material-symbols-outlined font-black">photo_camera</span>
               </a>
            </div>
         </div>
      </footer>
    </div>
  );
};
