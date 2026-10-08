"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

/**
 * Propriedades do componente FeliciiaFab.
 */
interface FeliciiaFabProps {
  /** Função disparada ao clicar no botão flutuante para abrir o chat */
  onClick: () => void;
  /** Indica se o modal do chat já está aberto (para ocultar o botão) */
  isOpen: boolean;
}

/**
 * Componente FAB (Floating Action Button) da FELICI-IÁ.
 * 
 * Permanece fixado na parte inferior direita da tela (acima da Bottom Navigation),
 * oferecendo acesso rápido à mentora virtual de inteligência artificial
 * a partir de qualquer aba do aplicativo.
 */
export function FeliciiaFab({ onClick, isOpen }: FeliciiaFabProps) {
  // Se o modal de conversa já estiver ativo, o botão flutuante fica invisível
  if (isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 max-w-md">
      <button
        onClick={onClick}
        aria-label="Abrir conversa com a FELICI-IÁ"
        className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1.5 pr-4 shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 active:scale-95 glow-emerald"
      >
        {/* Anel luminoso com efeito pulsante contínuo */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-75 blur-sm transition group-hover:opacity-100 animate-pulse-glow" />

        {/* Conteúdo interno do botão: Avatar + Identificação */}
        <div className="relative flex items-center gap-2.5">
          {/* Avatar com a identidade visual da FELICI-IÁ */}
          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/80 bg-slate-900 shadow-inner">
            <Image
              src="/logo-feliciia.jpg"
              alt="Avatar da FELICI-IÁ"
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>

          {/* Rótulo textual e indicador visual de IA */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white drop-shadow-sm">FELICI-IÁ</span>
              <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300 animate-bounce" />
            </div>
            <span className="text-[10px] font-medium text-emerald-100">Falar com a IA</span>
          </div>
        </div>
      </button>
    </div>
  );
}
