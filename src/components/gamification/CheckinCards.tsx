"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { GraduationCap, Briefcase, CheckCircle2, Sparkles } from "lucide-react";
import type { CheckinType, UserProfile, DailyLog } from "@/types/database";

/**
 * Propriedades do componente CheckinCards.
 */
interface CheckinCardsProps {
  /** Perfil atualizado do usuário com metas e dados de assiduidade */
  userProfile: UserProfile;
  /** Lista de logs diários já registrados pelo aprendiz */
  dailyLogs: DailyLog[];
  /** Callback executado após a validação e sucesso de um novo check-in */
  onCheckinSuccess: (type: CheckinType, valor: number) => void;
}

/**
 * Componente CheckinCards (Gamificação e Lógica Core Down-Top).
 * 
 * Permite que o jovem aprendiz registre seu comparecimento diário:
 * 1. "Fui ao Senac" (Formação teórica)
 * 2. "Fui ao Trabalho" (Prática na empresa parceira)
 * 
 * Executa o cálculo Down-Top (Meta / Dias Úteis do Mês), dispara o efeito
 * visual de confete e assegura o bloqueio contra registros duplicados no mesmo dia.
 */
export function CheckinCards({
  userProfile,
  dailyLogs,
  onCheckinSuccess,
}: CheckinCardsProps) {
  // Mensagem de feedback temporária após ação do usuário
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  // Data atual no formato YYYY-MM-DD calculada após a montagem do componente (evita erros de SSR)
  const [todayStr, setTodayStr] = useState<string>("");

  useEffect(() => {
    // Sincroniza a data civil local após o carregamento no navegador
    setTodayStr(new Date().toISOString().split("T")[0]);
  }, []);

  // Verifica se o check-in do Senac já foi realizado na data atual
  const checkedInSenacToday = Boolean(
    todayStr && dailyLogs.some((log) => log.data === todayStr && log.tipo_checkin === "senac")
  );

  // Verifica se o check-in da Empresa já foi realizado na data atual
  const checkedInTrabalhoToday = Boolean(
    todayStr && dailyLogs.some((log) => log.data === todayStr && log.tipo_checkin === "trabalho")
  );

  // Lógica Down-Top:
  // Calcula o total de dias de atividade por semana e projeta a média mensal (~4.4 semanas)
  const totalDaysPerWeek =
    (userProfile.dias_senac.length || 2) + (userProfile.dias_trabalho.length || 3);
  const totalDaysInMonth = Math.max(1, totalDaysPerWeek * 4.4);
  // Valor individual desbloqueado a cada presença confirmada
  const valorPorDia = Number(
    (userProfile.meta_mensal / totalDaysInMonth).toFixed(2)
  );

  /**
   * Dispara a animação festiva de confetes na tela.
   */
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
    });
  };

  /**
   * Processa a tentativa de check-in com validação de duplicidade.
   */
  const handleCheckin = (type: CheckinType) => {
    const isAlreadyChecked =
      type === "senac" ? checkedInSenacToday : checkedInTrabalhoToday;

    // Regra de Bloqueio de Duplicidade: Não permite registro repetido no mesmo dia
    if (isAlreadyChecked) {
      setFeedbackMessage(
        `Você já registrou sua presença de ${
          type === "senac" ? "Senac" : "Trabalho"
        } hoje! O bloqueio de duplicidade garante a integridade da sua rotina.`
      );
      setTimeout(() => setFeedbackMessage(null), 4000);
      return;
    }

    // Dispara a celebração gamificada e atualiza o estado global
    triggerConfetti();
    onCheckinSuccess(type, valorPorDia);
    setFeedbackMessage(
      `🎉 Parabéns! Você desbloqueou +R$ ${valorPorDia.toFixed(
        2
      )} no seu saldo com a lógica Down-Top!`
    );
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  return (
    <div className="space-y-4">
      {/* Título da seção e badge de taxa diária calculada */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">
            Missões Diárias
          </h2>
          <p className="text-xs text-slate-400">
            Registre seu comparecimento para desbloquear seus ganhos
          </p>
        </div>
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          R$ {valorPorDia.toFixed(2)}/dia
        </span>
      </div>

      {/* Banner de feedback comemorativo ou informativo */}
      {feedbackMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/50 p-3 text-xs text-emerald-200 animate-in fade-in slide-in-from-top duration-300">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Grade com os 2 cards de missão diária */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card de Registro do Senac */}
        <button
          onClick={() => handleCheckin("senac")}
          disabled={checkedInSenacToday}
          className={`group relative flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all ${
            checkedInSenacToday
              ? "border-emerald-700/60 bg-emerald-950/20 opacity-80 cursor-default"
              : "border-slate-700/80 bg-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-800 active:scale-95 shadow-lg"
          }`}
        >
          <div className="flex w-full items-center justify-between">
            <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition">
              <GraduationCap className="h-5 w-5" />
            </div>
            {checkedInSenacToday && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" /> Concluído
              </span>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
              Fui ao Senac
            </h3>
            <p className="text-[11px] text-slate-400">Formação Teórica</p>
          </div>

          <div className="mt-3 flex items-center justify-between w-full pt-2 border-t border-slate-700/50">
            <span className="text-[11px] font-medium text-indigo-300">
              +{valorPorDia.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400">
              {checkedInSenacToday ? "Check-in Feito" : "Clique p/ registrar"}
            </span>
          </div>
        </button>

        {/* Card de Registro da Empresa Parceira */}
        <button
          onClick={() => handleCheckin("trabalho")}
          disabled={checkedInTrabalhoToday}
          className={`group relative flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all ${
            checkedInTrabalhoToday
              ? "border-emerald-700/60 bg-emerald-950/20 opacity-80 cursor-default"
              : "border-slate-700/80 bg-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-800 active:scale-95 shadow-lg"
          }`}
        >
          <div className="flex w-full items-center justify-between">
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition">
              <Briefcase className="h-5 w-5" />
            </div>
            {checkedInTrabalhoToday && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" /> Concluído
              </span>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
              Fui ao Trabalho
            </h3>
            <p className="text-[11px] text-slate-400">Prática na Empresa</p>
          </div>

          <div className="mt-3 flex items-center justify-between w-full pt-2 border-t border-slate-700/50">
            <span className="text-[11px] font-medium text-amber-300">
              +{valorPorDia.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400">
              {checkedInTrabalhoToday ? "Check-in Feito" : "Clique p/ registrar"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
