import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRO: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontrados no .env.local");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

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

