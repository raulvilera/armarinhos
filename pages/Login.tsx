import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, checkSupabaseConnection } from '../services/supabaseClient';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ ok: boolean; message: string; loading: boolean }>({
    ok: false, message: 'Verificando conexão...', loading: true
  });

  useEffect(() => {
    const verifyConnection = async () => {
      const result = await checkSupabaseConnection();
      setConnectionStatus({ ...result, loading: false });
    };
    verifyConnection();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // BYPASS DEMONSTRAÇÃO OFFLINE:
    // Se o usuário digitar admin/admin ou vicmar/vicmar123, libera o acesso imediatamente para o modo offline!
    const isDemoUser = (username === 'admin' && password === 'admin') || (username === 'vicmar' && password === 'vicmar123');
    if (isDemoUser) {
      onLogin();
      navigate('/dashboard');
      return;
    }

    if (!connectionStatus.ok) { 
      setError(`Erro de conexão: ${connectionStatus.message}. (Para testar offline, entre com usuário "admin" e senha "admin")`); 
      return; 
    }

    try {
      const email = username.includes('@') ? username : `${username}@armarinhos.com`;
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message.includes('Invalid login credentials')
          ? 'Credenciais inválidas. Verifique usuário e senha.'
          : authError.message);
        return;
      }
      if (data.user) { onLogin(); navigate('/dashboard'); }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao realizar login.');
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ background: 'hsl(40 20% 97%)' }}>

      {/* Left panel - standardized split banner design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col bg-[#faf6f0] border-r border-blue-100">
        
        {/* TOP HALF: Realistic Store Shelves Image */}
        <div className="w-full h-1/2 relative overflow-hidden shrink-0">
          <img 
            src="/assets/banner-orig.jpg" 
            alt="Prateleiras de Aviamentos Vicmar" 
            className="w-full h-full object-cover object-center"
          />
          {/* Smooth blend overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf6f0] via-[#faf6f0]/10 to-transparent pointer-events-none" />
        </div>

        {/* BOTTOM HALF: Elegant Calligraphy & System Info */}
        <div className="flex-1 flex flex-col justify-between p-12 relative text-left">
          {/* Decorative swirls path */}
          <div className="absolute top-4 right-8 opacity-10 pointer-events-none select-none">
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 35 C 30 10, 80 50, 115 5" stroke="#db2777" strokeWidth="1.5" strokeDasharray="3 3"/>
            </svg>
          </div>

          {/* Top Branding */}
          <div className="space-y-1">
            <h3 className="font-sans text-stone-500 text-[13px] font-semibold tracking-wide uppercase">
              Vicmar Armarinhos
            </h3>
            <h2 className="font-serif text-[28px] lg:text-[34px] text-stone-800 font-normal leading-tight">
              Tudo o que você <br />
              <span className="font-cursive text-pink-600 text-[42px] lg:text-[50px] leading-none inline-block align-middle px-1">
                imagina,
              </span>
              <br />
              <span className="relative inline-block">
                a gente tem!
                {/* Subtle underline stroke below "a gente tem" */}
                <span className="absolute left-0 bottom-0.5 w-full h-[2px] bg-pink-100 rounded" />
              </span>
            </h2>
            <p className="text-stone-500 text-[12px] leading-relaxed max-w-sm pt-1">
              A maior variedade de aviamentos para dar <span className="text-pink-600 font-semibold">vida às suas criações</span>.
            </p>
          </div>

          {/* System Badges */}
          <div className="space-y-3 my-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                <span className="material-symbols-outlined text-[16px] font-bold">verified</span>
              </div>
              <div className="leading-none">
                <p className="text-[10px] font-bold text-stone-700 uppercase">Qualidade e Tradição</p>
                <p className="text-[9px] text-stone-400">Desde o início do seu projeto</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                <span className="material-symbols-outlined text-[16px] font-bold">admin_panel_settings</span>
              </div>
              <div className="leading-none">
                <p className="text-[10px] font-bold text-stone-700 uppercase">Sistema de Gestão</p>
                <p className="text-[9px] text-stone-400">Acesso seguro e restrito a lojistas</p>
              </div>
            </div>
          </div>

          {/* Bottom Branding / Address */}
          <div className="flex items-center justify-between border-t border-stone-200/60 pt-4">
            <div className="flex items-center gap-2 bg-[#f3eae0] px-3.5 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-stone-600 text-xs">location_on</span>
              <span className="text-[9px] font-bold text-stone-600 uppercase tracking-wider">Av. Imperador 4877</span>
            </div>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Modo Administrativo</span>
          </div>

        </div>

      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg border-t border-white/30"
              style={{ 
                background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
                boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.25)' 
              }}>
              <span className="material-symbols-outlined text-lg">architecture</span>
            </div>
            <div className="leading-none">
              <p className="text-[15px] font-bold text-stone-800">Vicmar Armarinhos</p>
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Área Administrativa</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Bem-vindo de volta</h1>
            <p className="text-sm text-stone-400 mt-1">Entre com suas credenciais para continuar</p>
          </div>

          {/* Connection status */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-6 text-[11px] font-medium ${
            connectionStatus.loading ? 'bg-blue-50 text-blue-700 border border-blue-100'
            : connectionStatus.ok ? 'bg-green-50 text-green-700 border border-green-100'
            : 'bg-red-50 text-red-600 border border-red-100'}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              connectionStatus.loading ? 'bg-blue-400 animate-pulse'
              : connectionStatus.ok ? 'bg-green-500'
              : 'bg-red-500'}`} />
            {connectionStatus.loading ? 'Verificando conexão...'
              : connectionStatus.ok ? 'Conectado ao servidor'
              : connectionStatus.message}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[12px] font-medium text-red-600">
                <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">error</span>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-400">Usuário</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-stone-400">person</span>
                <input
                  type="text" required autoComplete="username"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all placeholder:text-stone-300"
                  placeholder="Seu usuário"
                  value={username} onChange={e => setUsername(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-400">Senha</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-stone-400">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'} required autoComplete="current-password"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all placeholder:text-stone-300"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={connectionStatus.loading}
              className="w-full py-3.5 rounded-xl text-[13px] text-white font-bold mt-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.98] border-b border-black/15 border-t border-white/30"
              style={{ 
                background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
                boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 3px rgba(0, 0, 0, 0.25)'
              }}>
              {connectionStatus.loading ? 'Aguarde...' : 'Entrar no Painel'}
            </button>

            <button type="button" onClick={() => navigate('/')}
              className="w-full text-center text-[11px] font-medium text-stone-400 hover:text-blue-600 transition-colors pt-2">
              ← Voltar para a loja
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
