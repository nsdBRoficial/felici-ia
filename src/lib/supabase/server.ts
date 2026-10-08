import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Cria o cliente do Supabase para uso em Server Components, Server Actions e Route Handlers no Next.js.
 * 
 * Lê e persiste os tokens de sessão através dos cookies HTTP da requisição.
 * 
 * @returns Instância assíncrona tipada do cliente Supabase para o Servidor.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components somente-leitura ignoram erros ao tentar setar cookies
          }
        },
      },
    }
  );
}
