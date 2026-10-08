"use client";

import React from "react";
import { Wallet, TrendingUp, Calendar, ArrowUpRight, GraduationCap, Briefcase } from "lucide-react";
import type { UserProfile, DailyLog } from "@/types/database";

interface WalletViewProps {
  userProfile: UserProfile;
  dailyLogs: DailyLog[];
}

export function WalletView({ userProfile, dailyLogs }: WalletViewProps) {
  const meta = userProfile.meta_mensal || 880;
  const saldo = userProfile.saldo_atual || 0;
  const percentualMeta = Math.min(100, Math.round((saldo / Math.max(1, meta)) * 100));

  // Ganhos separados
  const ganhoSenac = dailyLogs
    .filter((l) => l.tipo_checkin === "senac")
    .reduce((acc, curr) => acc + curr.valor_adicionado, 0);

  const ganhoTrabalho = dailyLogs
    .filter((l) => l.tipo_checkin === "trabalho")
    .reduce((acc, curr) => acc + curr.valor_adicionado, 0);

  return (
    <div className="space-y-5 px-4 pt-4 pb-8">
      <div>
        <h1 className="text-xl font-bold text-white">Minha Carteira</h1>
        <p className="text-xs text-slate-400">
          Acompanhamento do saldo desbloqueado e histórico
        </p>
      </div>

      {/* Saldo Principal Card */}
      <div className="rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Saldo Atual Desbloqueado</span>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="h-3 w-3" /> {percentualMeta}% da meta
          </span>
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            R$ {saldo.toFixed(2)}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Meta Mensal: R$ {meta.toFixed(2)}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${percentualMeta}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>R$ 0,00</span>
            <span>R$ {(meta - saldo > 0 ? meta - saldo : 0).toFixed(2)} restantes</span>
          </div>
        </div>
      </div>

      {/* Detalhamento Senac vs Empresa */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <GraduationCap className="h-4 w-4" />
            <span className="text-xs font-bold">Senac (Teoria)</span>
          </div>
          <p className="mt-2 text-lg font-bold text-white">
            R$ {ganhoSenac.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400">
            {dailyLogs.filter((l) => l.tipo_checkin === "senac").length} presenças
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Briefcase className="h-4 w-4" />
            <span className="text-xs font-bold">Empresa (Prática)</span>
          </div>
          <p className="mt-2 text-lg font-bold text-white">
            R$ {ganhoTrabalho.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400">
            {dailyLogs.filter((l) => l.tipo_checkin === "trabalho").length} presenças
          </p>
        </div>
      </div>

      {/* Histórico Recente */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">Histórico de Desbloqueios</h3>
        {dailyLogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">
            Nenhum check-in registrado ainda neste mês.
          </div>
        ) : (
          <div className="space-y-2">
            {dailyLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2 ${
                      log.tipo_checkin === "senac"
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {log.tipo_checkin === "senac" ? (
                      <GraduationCap className="h-4 w-4" />
                    ) : (
                      <Briefcase className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {log.tipo_checkin === "senac" ? "Presença Senac" : "Presença Empresa"}
                    </h4>
                    <p className="text-[10px] text-slate-400">{log.data}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">
                    +R$ {log.valor_adicionado.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
