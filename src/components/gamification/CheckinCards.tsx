"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { GraduationCap, Briefcase, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import type { CheckinType, UserProfile, DailyLog } from "@/types/database";

interface CheckinCardsProps {
  userProfile: UserProfile;
  dailyLogs: DailyLog[];
  onCheckinSuccess: (type: CheckinType, valor: number) => void;
}

export function CheckinCards({
  userProfile,
  dailyLogs,
  onCheckinSuccess,
}: CheckinCardsProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [todayStr, setTodayStr] = useState<string>("");

  React.useEffect(() => {
    setTodayStr(new Date().toISOString().split("T")[0]);
  }, []);

  // Verifica se já fez checkin hoje
  const checkedInSenacToday = Boolean(
    todayStr && dailyLogs.some((log) => log.data === todayStr && log.tipo_checkin === "senac")
  );
  const checkedInTrabalhoToday = Boolean(
    todayStr && dailyLogs.some((log) => log.data === todayStr && log.tipo_checkin === "trabalho")
  );

  // Lógica Down-Top: Meta / (dias Senac + Empresa no mês ~ 22 dias médios)
  const totalDaysPerWeek =
    (userProfile.dias_senac.length || 2) + (userProfile.dias_trabalho.length || 3);
  const totalDaysInMonth = Math.max(1, totalDaysPerWeek * 4.4); // Aproximação de 4.4 semanas
  const valorPorDia = Number(
    (userProfile.meta_mensal / totalDaysInMonth).toFixed(2)
  );

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
    });
  };

  const handleCheckin = (type: CheckinType) => {
    const isAlreadyChecked =
      type === "senac" ? checkedInSenacToday : checkedInTrabalhoToday;

    if (isAlreadyChecked) {
      setFeedbackMessage(
        `Você já registrou sua presença de ${
          type === "senac" ? "Senac" : "Trabalho"
        } hoje! O bloqueio de duplicidade mantém sua integridade diária.`
      );
      setTimeout(() => setFeedbackMessage(null), 4000);
      return;
    }

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

      {feedbackMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/50 p-3 text-xs text-emerald-200 animate-in fade-in slide-in-from-top duration-300">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Card Senac */}
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

        {/* Card Trabalho */}
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
