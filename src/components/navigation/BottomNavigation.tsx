"use client";

import React from "react";
import { Home, Wallet, User, Flame } from "lucide-react";

interface BottomNavigationProps {
  activeTab: "home" | "wallet" | "profile";
  onTabChange: (tab: "home" | "wallet" | "profile") => void;
  streakCount: number;
}

export function BottomNavigation({
  activeTab,
  onTabChange,
  streakCount,
}: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-around px-4">
        <button
          onClick={() => onTabChange("home")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "home"
              ? "text-emerald-400 scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[11px] font-medium tracking-tight">Início</span>
        </button>

        <button
          onClick={() => onTabChange("wallet")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "wallet"
              ? "text-emerald-400 scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-[11px] font-medium tracking-tight">Carteira</span>
        </button>

        <button
          onClick={() => onTabChange("profile")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "profile"
              ? "text-emerald-400 scale-105"
              : "text-slate-400 hover:text-slate-200"
          }`}
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
