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
    if (!connectionStatus.ok) { setError(`Erro de conexão: ${connectionStatus.message}`); return; }
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

      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(160deg, hsl(215 38% 9%) 0%, hsl(215 42% 6%) 100%)' }}>
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        {/* Gold decorative circles */}
        <div className="absolute top-1/4 -right-20 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, hsl(43 96% 56%), transparent 70%)' }} />
        <div className="absolute bottom-1/3 -left-12 w-48 h-48 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, hsl(38 90% 50%), transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(43 96% 56%), hsl(38 90% 46%))' }}>
            <span className="material-symbols-outlined text-xl text-stone-900">architecture</span>
          </div>
          <div className="leading-none">
            <p className="text-[15px] font-bold text-white">Vicmar</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] mt-0.5" style={{ color: 'hsl(43 70% 65%)' }}>Armarinhos</p>
          </div>
        </div>

        {/* Center text */}
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] border"
            style={{ color: 'hsl(43 80% 70%)', borderColor: 'hsl(43 60% 30%)', background: 'hsl(43 60% 15% / 0.5)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Sistema de Gestão
          </div>
          <h2 className="font-serif text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Gestão inteligente<br />
            <span style={{ color: 'hsl(43 80% 65%)' }}>para sua retrosaria</span>
          </h2>
          <p className="text-[13px] leading-relaxed" style={{ color: 'hsl(215 15% 55%)' }}>
            Controle de estoque, vendas, clientes e financeiro — tudo em um só lugar.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {[
            { icon: 'inventory_2', label: 'Estoque' },
            { icon: 'point_of_sale', label: 'Vendas' },
            { icon: 'group', label: 'Clientes' },
            { icon: 'bar_chart', label: 'Relatórios' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
              style={{ background: 'hsl(215 30% 14%)', border: '1px solid hsl(215 28% 18%)' }}>
              <span className="material-symbols-outlined text-[16px]" style={{ color: 'hsl(43 80% 60%)' }}>{f.icon}</span>
              <span className="text-[11px] font-medium" style={{ color: 'hsl(215 15% 65%)' }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(35 72% 44%), hsl(28 68% 36%))' }}>
              <span className="material-symbols-outlined text-lg text-white">architecture</span>
            </div>
            <div className="leading-none">
              <p className="text-[15px] font-bold text-stone-800">Vicmar Armarinhos</p>
              <p className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">Área Administrativa</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Bem-vindo de volta</h1>
            <p className="text-sm text-stone-400 mt-1">Entre com suas credenciais para continuar</p>
          </div>

          {/* Connection status */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-6 text-[11px] font-medium ${
            connectionStatus.loading ? 'bg-amber-50 text-amber-700 border border-amber-100'
            : connectionStatus.ok ? 'bg-green-50 text-green-700 border border-green-100'
            : 'bg-red-50 text-red-600 border border-red-100'}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              connectionStatus.loading ? 'bg-amber-400 animate-pulse'
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
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:border-amber-300 transition-all placeholder:text-stone-300"
                  style={{ '--tw-ring-color': 'hsl(38 60% 75% / 0.4)' } as any}
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
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:border-amber-300 transition-all placeholder:text-stone-300"
                  style={{ '--tw-ring-color': 'hsl(38 60% 75% / 0.4)' } as any}
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={connectionStatus.loading}
              className="w-full py-3.5 rounded-xl text-[13px] font-semibold text-white mt-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-md"
              style={{ background: 'linear-gradient(135deg, hsl(215 38% 18%), hsl(215 42% 12%))' }}>
              {connectionStatus.loading ? 'Aguarde...' : 'Entrar no Painel'}
            </button>

            <button type="button" onClick={() => navigate('/')}
              className="w-full text-center text-[11px] font-medium text-stone-400 hover:text-amber-600 transition-colors pt-2">
              ← Voltar para a loja
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
