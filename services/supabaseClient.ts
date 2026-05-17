import { createClient } from '@supabase/supabase-js';

const dummyUrl = 'https://placeholder-project.supabase.co';
const dummyAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE1Nzg0MDU3MDgsImV4cCI6MTg5NDAxNzcwOH0.dummy-key';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || dummyUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || dummyAnonKey;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("AVISO: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontrados no .env. Utilizando credenciais de fallback.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Verifica se a conexão com o Supabase está ativa e funcional.
 */
export const checkSupabaseConnection = async (): Promise<{ ok: boolean; message: string }> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false, message: "Configuração ausente (.env)" };
  }

  try {
    // Tenta fazer uma query simples na tabela de produtos para testar a conexão
    const { error } = await supabase.from('products').select('id').limit(1);

    if (error) {
      if (error.message.includes('fetch')) {
        return { ok: false, message: "Erro de rede: Não foi possível alcançar o servidor." };
      }
      return { ok: false, message: `Erro de API: ${error.message}` };
    }

    return { ok: true, message: "Conexão estabelecida com sucesso." };
  } catch (err) {
    return { ok: false, message: "Erro inesperado ao conectar." };
  }
};

