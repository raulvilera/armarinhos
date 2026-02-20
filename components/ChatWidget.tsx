
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { Product } from '../types';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export const ChatWidget: React.FC<{ currentView: string; products?: Product[] }> = ({ currentView, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Olá! Sou a assistente da Vicmar. Como posso te ajudar hoje?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getGeminiResponse(userMsg, currentView, products);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-[2.5rem] shadow-2xl flex flex-col border border-primary/20 overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-primary p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <div>
                <span className="font-black text-sm uppercase tracking-widest block">Gemini Vicmar</span>
                <span className="text-[10px] opacity-80 font-bold uppercase">Online agora</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-neutral-light/10">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-text-main rounded-bl-none border border-gray-100'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl text-sm italic text-primary flex items-center gap-2 border border-gray-100 shadow-sm">
                  <div className="flex gap-1">
                    <div className="size-1 bg-primary rounded-full"></div>
                    <div className="size-1 bg-primary rounded-full"></div>
                    <div className="size-1 bg-primary rounded-full"></div>
                  </div>
                  Pensando...
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
            <input
              className="flex-1 bg-gray-50 rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300"
              placeholder="Digite sua dúvida..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-primary text-white size-12 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white size-16 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <span className="material-symbols-outlined text-3xl relative z-10">smart_toy</span>
        </button>
      )}
    </div>
  );
};
