import { GoogleGenAI } from "@google/genai";

/**
 * Retorna uma instância configurada do cliente oficial GoogleGenAI.
 * 
 * Utiliza instanciação sob demanda (lazy initialization) para proteger o processo
 * de compilação estática (`next build`) na Vercel quando a variável de ambiente
 * `GEMINI_API_KEY` ainda não foi cadastrada no painel da plataforma.
 * 
 * @returns Instância do GoogleGenAI ou `null` se a chave não estiver presente.
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Modelo padrão do Gemini utilizado pela FELICI-IÁ.
 * Oferece alta velocidade, excelente capacidade de raciocínio e custo otimizado.
 */
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
