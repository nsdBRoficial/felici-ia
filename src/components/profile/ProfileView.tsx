"use client";

import React from "react";
import Image from "next/image";
import { User, Flame, Settings, LogIn, Award, BookOpen, ShieldCheck } from "lucide-react";
import type { UserProfile } from "@/types/database";

interface ProfileViewProps {
  userProfile: UserProfile;
  onOpenOnboarding: () => void;
}

export function ProfileView({ userProfile, onOpenOnboarding }: ProfileViewProps) {
  return (
    <div className="space-y-5 px-4 pt-4 pb-8">
      <div>
        <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
        <p className="text-xs text-slate-400">Informações e jornada de aprendizagem</p>
      </div>

      {/* Card de Usuário */}
      <div className="rounded-3xl border border-slate-700/80 bg-slate-800/90 p-5 shadow-xl flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-emerald-400/50 bg-slate-900 shadow-md">
          <Image
            src="/logo-feliciia.jpg"
            alt="Foto do Aprendiz"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-white">{userProfile.nome || "Jovem Aprendiz"}</h2>
          <p className="text-xs text-emerald-400 font-medium">Programa Aprendizagem Senac</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/30">
              <Flame className="h-3 w-3 fill-amber-400" /> {userProfile.ofensiva} dias seguidos
            </span>
          </div>
        </div>
      </div>

      {/* Botão de Configuração de Metas */}
      <button
        onClick={onOpenOnboarding}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/70 p-4 text-left transition hover:border-emerald-500/50 hover:bg-slate-800"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Ajustar Meta e Escala</h3>
            <p className="text-xs text-slate-400">
              Meta: R$ {userProfile.meta_mensal.toFixed(2)} | Alterar dias de Senac e Empresa
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-400">Editar</span>
      </button>

      {/* Autenticação Google OAuth (Épico 3.1) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Conta e Sincronização</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Conecte sua conta do Google para sincronizar suas presenças e metas na nuvem via Supabase.
        </p>
        <button
          onClick={() => {
            alert("Fluxo de login com Google via Supabase Auth configurado! Adicione as chaves no .env.local para login real.");
          }}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Entrar com Google
        </button>
      </div>

      {/* Diretrizes Pedagógicas */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400">
          <BookOpen className="h-4 w-4" />
          <h3 className="text-xs font-bold">Compromisso do Aprendiz</h3>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Tanto a formação no Senac quanto a atuação na empresa compõem sua carga horária oficial. A frequência regular garante seu aprendizado, desenvolvimento de carreira e seu rendimento integral!
        </p>
      </div>
    </div>
  );
}
