import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Cria o cliente do Supabase para uso em Client Components no navegador.
 * 
 * Utiliza o pacote oficial `@supabase/ssr` para gerenciar sessões e autenticação via cookies.
 * Inclui valores padrão de contingência para evitar falhas durante o build estático.
 * 
 * @returns Instância tipada do cliente Supabase para o Browser.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
