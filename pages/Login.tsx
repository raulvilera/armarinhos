
import React, { useState } from 'react';
<<<<<<< HEAD
import { supabase } from '../services/supabaseClient';
=======
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
import { ViewType } from '../types';

interface LoginProps {
  onLogin: () => void;
  setView: (v: ViewType) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

<<<<<<< HEAD
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.includes('@') ? username : `${username}@armarinhos.com`, // Fallback para usuários sem email completo
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        onLogin();
        setView('DASHBOARD');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
=======
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login: admin / vicmar
    if (username === 'admin' && password === 'vicmar') {
      onLogin();
      setView('DASHBOARD');
    } else {
      setError('Credenciais incorretas. Tente admin / vicmar.');
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-6 font-display">
      <div className="w-full max-w-md animate-in zoom-in fade-in duration-500">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-primary p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-9xl">lock</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="bg-white/20 size-16 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl font-black">architecture</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Acesso Vicmar</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-70 mt-2 italic">Área Administrativa</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-12 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 animate-pulse">
                {error}
              </div>
            )}
<<<<<<< HEAD

=======
            
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Usuário</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">person</span>
<<<<<<< HEAD
                <input
=======
                <input 
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
                  type="text"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  placeholder="Seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Senha</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">lock_open</span>
<<<<<<< HEAD
                <input
=======
                <input 
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
                  type="password"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

<<<<<<< HEAD
            <button
=======
            <button 
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
            >
              Entrar no Painel
            </button>

<<<<<<< HEAD
            <button
=======
            <button 
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
              type="button"
              onClick={() => setView('STOREFRONT')}
              className="w-full text-center text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-primary transition-colors mt-6"
            >
              Voltar para a Loja
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
