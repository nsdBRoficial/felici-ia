"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, Sparkles } from "lucide-react";
import type { UserProfile } from "@/types/database";

/**
 * Estrutura de cada mensagem no histórico do chat.
 */
interface Message {
  id: string;
  sender: "user" | "ia";
  text: string;
  time: string;
}

/**
 * Propriedades recebidas pelo componente FeliciiaModal.
 */
interface FeliciiaModalProps {
  /** Estado que controla se o modal está visível */
  isOpen: boolean;
  /** Função de callback para fechar o modal */
  onClose: () => void;
  /** Perfil e estatísticas financeiras atuais do aprendiz */
  userProfile: UserProfile;
}

/**
 * Perguntas rápidas sugeridas exibidas no topo do chat para facilitar a interação.
 */
const QUICK_QUESTIONS = [
  "Quanto ganho por dia de Senac?",
  "O que acontece se eu faltar sem justificativa?",
  "Dica para economizar minha bolsa!",
  "Como aumentar minha ofensiva?",
];

/**
 * Modal do Chatbot da FELICI-IÁ (Interface estilo WhatsApp / Mensageiro).
 * 
 * Permite que o aprendiz converse com a IA, tire dúvidas sobre regras pedagógicas do Senac,
 * receba conselhos de planejamento financeiro baseados na sua meta real e veja respostas
 * contextualizadas com o saldo acumulado.
 */
export function FeliciiaModal({ isOpen, onClose, userProfile }: FeliciiaModalProps) {
  // Histórico de mensagens da conversa, iniciando com uma saudação calorosa
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ia",
      text: `Olá, ${userProfile.nome || "Aprendiz"}! 🌟 Eu sou a **FELICI-IÁ**, sua mentora financeira e companheira no Senac.\n\nVocê já acumulou **R$ ${userProfile.saldo_atual.toFixed(2)}** neste mês e está com **${userProfile.ofensiva} dias de ofensiva 🔥**!\n\nComo posso te ajudar hoje?`,
      time: "Hoje",
    },
  ]);

  // Texto digitado pelo usuário no campo de entrada
  const [inputText, setInputText] = useState("");
  // Indicador de carregamento enquanto a IA processa a resposta
  const [isLoading, setIsLoading] = useState(false);
  // Referência para rolagem automática até o final da conversa
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Rola suavemente a lista de mensagens para o final ao receber novas mensagens.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  /**
   * Envia uma mensagem para a rota de backend /api/chat integrada ao Google Gemini.
   */
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const currentTime = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Adiciona a mensagem do usuário à lista local
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Dispara requisição para a API Route no Next.js
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro na comunicação com a API da FELICI-IÁ");
      }

      const data = await response.json();

      // Adiciona a resposta da IA ao histórico
      const iaMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ia",
        text: data.reply,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, iaMessage]);
    } catch {
      // Resposta amigável e segura de contingência caso a conexão falhe
      const fallbackReply = `Estou funcionando no modo seguro de contingência! 🌟\n\nVocê me perguntou: "${text}".\n\nLembre-se: com a sua meta de **R$ ${userProfile.meta_mensal.toFixed(2)}**, cada dia de assiduidade no Senac e no trabalho desbloqueia seu futuro!`;

      const iaMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ia",
        text: fallbackReply,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, iaMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-0 sm:p-4">
      <div className="relative flex h-[90vh] w-full max-w-md flex-col rounded-t-3xl sm:rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Cabeçalho do Chat com Avatar, Status e Botão de Fechar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-emerald-400 bg-slate-800">
              <Image
                src="/logo-feliciia.jpg"
                alt="Avatar da FELICI-IÁ"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">FELICI-IÁ</h3>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
              </div>
              <p className="text-[11px] text-slate-400">Mentora do Jovem Aprendiz</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal do chat"
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pílulas de Perguntas Rápidas (Chips de Sugestão) */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-800/80 bg-slate-950/60 p-2.5 scrollbar-none text-xs">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-800/50 transition active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Corpo de Mensagens com Rolagem Suave */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-900 to-slate-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`mt-1 text-right text-[10px] ${
                    msg.sender === "user" ? "text-emerald-200" : "text-slate-400"
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Feedback de Digitação da IA */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 border border-slate-700/50 rounded-2xl px-3 py-2 w-fit">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
              <span>FELICI-IÁ está digitando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Barra Inferior de Entrada de Texto */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 border-t border-slate-800 bg-slate-900 p-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tire uma dúvida com a FELICI-IÁ..."
            className="flex-1 rounded-full border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            aria-label="Enviar mensagem"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
