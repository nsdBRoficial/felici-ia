"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Flame, Sparkles, ChevronRight } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { FeliciiaFab } from "@/components/chatbot/FeliciiaFab";
import { FeliciiaModal } from "@/components/chatbot/FeliciiaModal";
import { CheckinCards } from "@/components/gamification/CheckinCards";
import { OnboardingModal } from "@/components/gamification/OnboardingModal";
import { WalletView } from "@/components/wallet/WalletView";
import { ProfileView } from "@/components/profile/ProfileView";
import type { UserProfile, DailyLog, CheckinType } from "@/types/database";

/**
 * Perfil padrão inicial utilizado em modo demonstrativo ou primeiro acesso do usuário.
 */
const DEFAULT_PROFILE: UserProfile = {
  id: "user-local-1",
  nome: "Jovem Aprendiz",
  meta_mensal: 880.0,
  dias_senac: [1, 2], // Segunda e Terça
  dias_trabalho: [3, 4, 5], // Quarta, Quinta e Sexta
  saldo_atual: 240.0,
  ofensiva: 6,
  created_at: "2026-10-01T00:00:00.000Z",
  updated_at: "2026-10-01T00:00:00.000Z",
};

/**
 * Logs diários iniciais para exibição de histórico pré-populado na demonstração.
 */
const INITIAL_LOGS: DailyLog[] = [
  {
    id: "log-1",
    user_id: "user-local-1",
    tipo_checkin: "senac",
    data: "2026-10-06",
    valor_adicionado: 40.0,
    created_at: "2026-10-06T10:00:00.000Z",
  },
  {
    id: "log-2",
    user_id: "user-local-1",
    tipo_checkin: "trabalho",
    data: "2026-10-07",
    valor_adicionado: 40.0,
    created_at: "2026-10-07T14:00:00.000Z",
  },
];

/**
 * Página Principal da aplicação FELICI-IÁ.
 * 
 * Integra o fluxo mobile-first completo:
 * - Alternância entre abas (Início, Carteira e Perfil)
 * - Persistência híbrida no LocalStorage do navegador
 * - Visualização do Saldo Desbloqueado com a lógica Down-Top
 * - Check-in gamificado diário com proteção contra duplicidade
 * - FAB e Modal do Chatbot inteligente da FELICI-IÁ
 */
export default function HomePage() {
  // Aba ativa na navegação inferior ('home' | 'wallet' | 'profile')
  const [activeTab, setActiveTab] = useState<"home" | "wallet" | "profile">("home");
  // Perfil financeiro e de assiduidade do usuário
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  // Lista de check-ins registrados
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(INITIAL_LOGS);
  // Controle de visibilidade do modal do chatbot
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Controle de visibilidade do modal de onboarding / edição de metas
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  /**
   * Efeito de inicialização: recupera dados persistidos do LocalStorage para manter
   * os testes do usuário salvos mesmo após atualizar a página no navegador.
   */
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("feliciia_user_profile");
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      const savedLogs = localStorage.getItem("feliciia_daily_logs");
      if (savedLogs) {
        setDailyLogs(JSON.parse(savedLogs));
      }
    } catch {
      // Ignora falhas em ambientes restritos
    }
  }, []);

  /**
   * Atualiza e persiste o perfil do usuário localmente.
   */
  const saveProfile = (updated: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...updated };
    setUserProfile(newProfile);
    try {
      localStorage.setItem("feliciia_user_profile", JSON.stringify(newProfile));
    } catch {}
  };

  /**
   * Registra um novo check-in diário com sucesso (Senac ou Trabalho):
   * incrementa o saldo acumulado, avança a ofensiva e salva o registro histórico.
   */
  const handleCheckinSuccess = (type: CheckinType, valor: number) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const newLog: DailyLog = {
      id: "log-" + Date.now(),
      user_id: userProfile.id,
      tipo_checkin: type,
      data: todayStr,
      valor_adicionado: valor,
      created_at: new Date().toISOString(),
    };

    const newLogs = [newLog, ...dailyLogs];
    const newSaldo = userProfile.saldo_atual + valor;
    const newOfensiva = userProfile.ofensiva + 1;

    setDailyLogs(newLogs);
    saveProfile({
      saldo_atual: Number(newSaldo.toFixed(2)),
      ofensiva: newOfensiva,
    });

    try {
      localStorage.setItem("feliciia_daily_logs", JSON.stringify(newLogs));
    } catch {}
  };

  // Cálculo da porcentagem da meta mensal atingida até o momento
  const percentualMeta = Math.min(
    100,
    Math.round((userProfile.saldo_atual / Math.max(1, userProfile.meta_mensal)) * 100)
  );

  return (
    <main className="flex-1 flex flex-col">
      {/* ------------------------------------------------------------- */}
      {/* ABA 1: TELA INICIAL (Home)                                     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "home" && (
        <div className="space-y-5 px-4 pt-4 pb-6">
          {/* Cabeçalho Superior com Avatar, Saudação e Ofensiva */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-emerald-400/40 bg-slate-800 shadow-md">
                <Image
                  src="/logo-feliciia.jpg"
                  alt="FELICI-IÁ"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-base font-bold text-white flex items-center gap-1.5">
                  Olá, {userProfile.nome}! 👋
                </h1>
                <p className="text-xs text-slate-400">Jovem Aprendiz Senac</p>
              </div>
            </div>

            {/* Contador de Ofensiva (Streak Gamificado) */}
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-3 py-1 text-xs font-bold text-amber-400 shadow-sm">
              <Flame className="h-4 w-4 fill-amber-400 animate-pulse" />
              <span>{userProfile.ofensiva} dias</span>
            </div>
          </div>

          {/* Hero Card: Saldo Atual Desbloqueado com a Lógica Down-Top */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-emerald-950/40 p-5 shadow-2xl glass-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Lógica Down-Top
              </span>
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="text-[11px] font-semibold text-slate-300 hover:text-emerald-300 underline decoration-emerald-500/40"
              >
                Ajustar Meta
              </button>
            </div>

            <div className="mt-3">
              <p className="text-xs font-medium text-slate-400">Saldo Desbloqueado no Mês</p>
              <h2 className="text-3xl font-black tracking-tight text-white mt-0.5">
                R$ {userProfile.saldo_atual.toFixed(2)}
              </h2>
            </div>

            {/* Barra de Progresso em direção à Meta Mensal */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Meta: R$ {userProfile.meta_mensal.toFixed(2)}</span>
                <span className="text-emerald-400 font-bold">{percentualMeta}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${percentualMeta}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cards de Missão Diária (Check-in no Senac e no Trabalho) */}
          <CheckinCards
            userProfile={userProfile}
            dailyLogs={dailyLogs}
            onCheckinSuccess={handleCheckinSuccess}
          />

          {/* Pílula / Card de Dica Diária da FELICI-IÁ */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-teal-500/10 p-1.5 text-teal-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-200">Dica da FELICI-IÁ</h3>
              </div>
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center text-[11px] font-semibold text-teal-400 hover:underline"
              >
                Conversar <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Você sabia que separar apenas 10% do valor que você desbloqueia a cada semana já constrói sua reserva de emergência antes do fim do contrato de aprendizagem?"
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ABA 2: CARTEIRA E EXTRATO (Wallet)                            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "wallet" && (
        <WalletView userProfile={userProfile} dailyLogs={dailyLogs} />
      )}

      {/* ------------------------------------------------------------- */}
      {/* ABA 3: PERFIL DO APRENDIZ (Profile)                           */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "profile" && (
        <ProfileView
          userProfile={userProfile}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />
      )}

      {/* Botão Flutuante da FELICI-IÁ (Visível em qualquer aba) */}
      <FeliciiaFab onClick={() => setIsChatOpen(true)} isOpen={isChatOpen} />

      {/* Modal do Chatbot da IA */}
      <FeliciiaModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userProfile={userProfile}
      />

      {/* Modal de Configuração de Metas (Onboarding) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        userProfile={userProfile}
        onSave={saveProfile}
      />

      {/* Barra de Navegação Inferior Fixa */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        streakCount={userProfile.ofensiva}
      />
    </main>
  );
}
