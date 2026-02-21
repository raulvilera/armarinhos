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
  const [connectionStatus, setConnectionStatus] = useState<{ ok: boolean; message: string; loading: boolean }>({
    ok: false,
    message: 'Verificando conexão...',
    loading: true
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

    if (!connectionStatus.ok) {
      setError(`Erro de conexão: ${connectionStatus.message}`);
      return;
    }

    try {
      const email = username.includes('@') ? username : `${username}@armarinhos.com`;
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Credenciais inválidas. Verifique seu usuário e senha.');
        } else {
          throw authError;
        }
        return;
      }

      if (data.user) {
        onLogin();
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao realizar login.');
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-6 font-display">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
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

          <div className="px-12 pt-8 pb-4">

          </div>

          <form onSubmit={handleLogin} className="p-12 pt-4 space-y-6">
            {error && (
              <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border bg-red-50 text-red-600 border-red-100`}>
                {error}
              </div>
            )}

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Usuário</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">person</span>
                <input
                  type="text"
                  required
                  autoComplete="username"
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
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-black focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <button
                type="submit"
                disabled={connectionStatus.loading}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                Entrar no Painel
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
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
