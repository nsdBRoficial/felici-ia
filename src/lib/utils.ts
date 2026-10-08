import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário padrão para concatenação condicional de classes CSS
 * mesclando regras do Tailwind com suporte a especificidade e resolução de conflitos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor numérico para o formato monetário padrão brasileiro (R$ 0,00).
 * 
 * @param value Valor numérico a ser formatado.
 * @returns String formatada em Real (BRL).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
