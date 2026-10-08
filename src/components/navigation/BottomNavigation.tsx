"use client";

import React from "react";
import { Home, Wallet, User, Flame } from "lucide-react";

/**
 * Propriedades do componente BottomNavigation.
 */
interface BottomNavigationProps {
  /** Identificador da aba atualmente ativa */
  activeTab: "home" | "wallet" | "profile";
  /** Função de callback para troca de abas */
  onTabChange: (tab: "home" | "wallet" | "profile") => void;
  /** Quantidade de dias consecutivos da ofensiva (streak) */
  streakCount: number;
}

/**
 * Componente de Navegação Inferior (Bottom Navigation) Mobile-First.
 * 
 * Permanece fixado no rodapé da viewport com suporte a efeito de vidro (glassmorphism),
 * permitindo alternar rapidamente entre a tela inicial (Missões e Resumo),
 * a Carteira (Extrato e Metas) e o Perfil do Jovem Aprendiz.
 */
export function BottomNavigation({
  activeTab,
  onTabChange,
  streakCount,
}: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-around px-4">
        {/* Aba 1: Início (Home) */}
        <button
          onClick={() => onTabChange("home")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "home"
              ? "text-emerald-400 scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
          aria-label="Ir para tela inicial"
        >
          <Home className="h-5 w-5" />
          <span className="text-[11px] font-medium tracking-tight">Início</span>
        </button>

        {/* Aba 2: Carteira (Wallet) */}
        <button
          onClick={() => onTabChange("wallet")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "wallet"
              ? "text-emerald-400 scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
          aria-label="Ir para carteira e extrato"
        >
          <Wallet className="h-5 w-5" />
          <span className="text-[11px] font-medium tracking-tight">Carteira</span>
        </button>

        {/* Aba 3: Perfil (Profile) */}
        <button
          onClick={() => onTabChange("profile")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "profile"
              ? "text-emerald-400 scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
          aria-label="Ir para perfil e configurações"
        >
          <div className="relative">
            <User className="h-5 w-5" />
            {streakCount > 0 && (
              <span className="absolute -top-1.5 -right-3 flex items-center text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1 rounded-full border border-amber-500/30">
                <Flame className="h-2.5 w-2.5 fill-amber-400 mr-0.5" />
                {streakCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium tracking-tight">Perfil</span>
        </button>
      </div>
    </nav>
  );
}
