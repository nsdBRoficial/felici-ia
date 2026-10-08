"use client";

import React, { useState } from "react";
import { Target, X, Sparkles } from "lucide-react";
import type { UserProfile } from "@/types/database";

/**
 * Propriedades recebidas pelo OnboardingModal.
 */
interface OnboardingModalProps {
  /** Se o modal de onboarding/ajuste de meta está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Dados atuais do perfil do usuário */
  userProfile: UserProfile;
  /** Callback para salvar as alterações */
  onSave: (updated: Partial<UserProfile>) => void;
}

/**
 * Lista dos dias úteis da semana disponíveis para marcação de rotina.
 */
const WEEKDAYS = [
  { id: 1, name: "Seg" },
  { id: 2, name: "Ter" },
  { id: 3, name: "Qua" },
  { id: 4, name: "Qui" },
  { id: 5, name: "Sex" },
  { id: 6, name: "Sáb" },
];

/**
 * Modal de Onboarding e Ajuste de Metas (Lógica Core Down-Top).
 * 
 * Permite ao jovem aprendiz personalizar:
 * 1. Nome ou apelido
 * 2. Meta financeira mensal (valor total da bolsa ou salário pretendido)
 * 3. Dias da semana em que frequenta as aulas teóricas no Senac
 * 4. Dias da semana em que atua presencialmente na empresa parceira
 * 
 * Exibe em tempo real o cálculo do ganho unitário desbloqueável por dia útil.
 */
export function OnboardingModal({
  isOpen,
  onClose,
  userProfile,
  onSave,
}: OnboardingModalProps) {
  // Estados locais para edição dos parâmetros
  const [metaMensal, setMetaMensal] = useState<number>(userProfile.meta_mensal || 880);
  const [nome, setNome] = useState<string>(userProfile.nome || "Aprendiz");
  const [diasSenac, setDiasSenac] = useState<number[]>(userProfile.dias_senac || [1, 2]);
  const [diasTrabalho, setDiasTrabalho] = useState<number[]>(
    userProfile.dias_trabalho || [3, 4, 5]
  );

  if (!isOpen) return null;

  /**
   * Alterna a seleção de um dia da semana entre Senac e Trabalho,
   * garantindo que o mesmo dia não seja atribuído a ambos simultaneamente.
   */
  const toggleDay = (type: "senac" | "trabalho", dayId: number) => {
    if (type === "senac") {
      if (diasSenac.includes(dayId)) {
        setDiasSenac(diasSenac.filter((d) => d !== dayId));
      } else {
        setDiasSenac([...diasSenac, dayId]);
        setDiasTrabalho(diasTrabalho.filter((d) => d !== dayId));
      }
    } else {
      if (diasTrabalho.includes(dayId)) {
        setDiasTrabalho(diasTrabalho.filter((d) => d !== dayId));
      } else {
        setDiasTrabalho([...diasTrabalho, dayId]);
        setDiasSenac(diasSenac.filter((d) => d !== dayId));
      }
    }
  };

  // Cálculo de projeção Down-Top em tempo real
  const totalAtividadesSemana = diasSenac.length + diasTrabalho.length;
  const diasMes = Math.max(1, totalAtividadesSemana * 4.4);
  const valorDiarioCalculado = Number((metaMensal / diasMes).toFixed(2));

  /**
   * Salva os parâmetros atualizados e fecha o modal.
   */
  const handleSave = () => {
    onSave({
      nome,
      meta_mensal: metaMensal,
      dias_senac: diasSenac,
      dias_trabalho: diasTrabalho,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configurar Meta</h3>
              <p className="text-xs text-slate-400">Lógica Down-Top de Ganhos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Campo de Nome / Apelido */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Seu Nome / Apelido</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Campo de Meta Mensal */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Meta Financeira Mensal (Bolsa / Salário)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">R$</span>
            <input
              type="number"
              step="10"
              value={metaMensal}
              onChange={(e) => setMetaMensal(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Seleção dos Dias de Senac */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-indigo-300">
            Dias de Aula no Senac (Teoria)
          </label>
          <div className="flex gap-1.5">
            {WEEKDAYS.map((w) => {
              const selected = diasSenac.includes(w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => toggleDay("senac", w.id)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                    selected
                      ? "bg-indigo-600 text-white font-bold"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {w.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seleção dos Dias de Empresa */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-amber-300">
            Dias na Empresa Parceira (Prática)
          </label>
          <div className="flex gap-1.5">
            {WEEKDAYS.map((w) => {
              const selected = diasTrabalho.includes(w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => toggleDay("trabalho", w.id)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                    selected
                      ? "bg-amber-600 text-white font-bold"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {w.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Painel de Pré-visualização da Conversão Down-Top */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Conversão Down-Top Ativada</span>
          </div>
          <p className="text-xs text-slate-300">
            Cada check-in registrado irá desbloquear:
          </p>
          <p className="text-lg font-black text-emerald-400">
            R$ {valorDiarioCalculado.toFixed(2)}{" "}
            <span className="text-xs font-normal text-slate-400">por dia útil</span>
          </p>
        </div>

        {/* Botão de Confirmação e Salvamento */}
        <button
          onClick={handleSave}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600 active:scale-98 transition"
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
