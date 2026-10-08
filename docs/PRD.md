# 📄 Product Requirements Document (PRD) - FELICI-IÁ

| Informação | Detalhe |
| :--- | :--- |
| **Nome do Produto** | FELICI-IÁ |
| **Status** | Em Desenvolvimento / Pronto para Deploy Vercel |
| **Autor** | Equipe de Inovação & Tecnologia FELICI-IÁ |
| **Data** | Outubro de 2026 |
| **Versão** | 1.0.0 |

---

## 1. Visão Geral do Produto

O **FELICI-IÁ** é uma aplicação web mobile-first voltada para jovens aprendizes vinculados ao Senac e empresas parceiras. A plataforma combina **gamificação comportamental**, **lógica financeira Down-Top** e uma **mentora virtual em IA generativa (FELICI-IÁ)** para transformar a assiduidade e o aprendizado profissional em uma jornada de progresso tangível e recompensadora.

### 1.1 Proposta de Valor
> "Converta o seu esforço diário em progresso financeiro real e construa seu amanhã com a mentoria inteligente da FELICI-IÁ."

---

## 2. Personas do Usuário

### Persona Principal: Lucas, o Jovem Aprendiz
* **Idade:** 17 anos.
* **Contexto:** Primeiro contrato formal de trabalho. Frequenta o Senac 2 dias por semana e atua no setor administrativo da empresa parceira 3 dias por semana.
* **Dores:** Recebe uma bolsa-auxílio fixa de R$ 880,00, mas gasta a maior parte na primeira semana por não saber quantificar o custo diário de seus hábitos. Às vezes se sente desmotivado nas aulas teóricas por achar distante do retorno financeiro.
* **Necessidades:** Saber exatamente quanto "ganha por dia de aula e de trabalho", ter um incentivo diário para nunca faltar e receber orientações financeiras descomplicadas.

---

## 3. Requisitos Funcionais (RF)

| ID | Nome | Descrição | Prioridade |
| :--- | :--- | :--- | :---: |
| **RF01** | **Onboarding de Metas** | O sistema deve permitir ao usuário definir sua Meta Financeira Mensal (R$) e selecionar os dias da semana destinados ao Senac e à Empresa. | Alta |
| **RF02** | **Cálculo Down-Top Dinâmico** | O sistema deve calcular automaticamente a taxa diária de ganho: `Valor_Diário = Meta_Mensal / (Dias_Úteis_Mês)`. | Alta |
| **RF03** | **Check-in Gamificado** | Na Home, o usuário deve ter dois cards de ação: "Fui ao Senac" e "Fui ao Trabalho". Ao clicar, o saldo atual é incrementado e a ofensiva atualizada. | Alta |
| **RF04** | **Bloqueio de Duplicidade** | O sistema deve impedir que o usuário registre o mesmo tipo de check-in mais de uma vez no mesmo dia civil, desabilitando o botão e exibindo aviso. | Crítica |
| **RF05** | **Feedback Visual & Comemoração** | Ao concluir um check-in, o sistema deve disparar animações comemorativas (efeito confete) e atualizar o contador com transições suaves. | Média |
| **RF06** | **Navegação Shell Mobile-First** | A interface deve possuir barra inferior fixa com 3 abas: Início (Home), Carteira (Wallet) e Perfil (Profile). | Alta |
| **RF07** | **Botão Flutuante (FAB) da IA** | Um botão circular destacado com a identidade da FELICI-IÁ deve permanecer acessível na parte inferior direita, abrindo o chat com um toque. | Alta |
| **RF08** | **Modal do Chatbot Estilo Mensageiro** | O modal de chat deve permitir envio de mensagens, fornecer sugestões rápidas de perguntas e renderizar texto formatado (Markdown). | Alta |
| **RF09** | **Injeção de Contexto Pedagógico na IA** | A rota `/api/chat` deve injetar os dados do aluno (saldo acumulado, meta, ofensiva) e as diretrizes de `regras_senac.md` no System Prompt do Google Gemini. | Alta |
| **RF10** | **Carteira e Extrato Detalhado** | Na aba Carteira, o usuário visualiza o percentual atingido da meta, separação de ganhos no Senac vs. Empresa e lista dos últimos check-ins. | Média |

---

## 4. Requisitos Não-Funcionais (RNF)

| ID | Requisito | Critério de Aceitação |
| :--- | :--- | :--- |
| **RNF01** | **Mobile-First Responsivo** | O layout deve ser restrito e otimizado para telas móveis (largura máxima de `max-w-md`), simulando um aplicativo nativo. |
| **RNF02** | **Performance & SSR** | O bundle Next.js deve ser compilado com Turbopack, com carregamento do Core Web Vitals LCP < 1.8s. |
| **RNF03** | **Disponibilidade & Deploy Vercel** | A aplicação deve estar pronta para deploy contínuo (zero-configuration) na Vercel via Git push. |
| **RNF04** | **Segurança de Dados (RLS)** | No Supabase, nenhuma linha de `users` ou `daily_logs` pode ser lida ou alterada por outro usuário que não seja o proprietário autenticado. |
| **RNF05** | **Resiliência da IA** | Se a chave `GEMINI_API_KEY` não estiver preenchida, o sistema deve retornar respostas instrutivas de fallback sem derrubar a aplicação. |
| **RNF06** | **Persistência Híbrida** | A aplicação deve funcionar em modo demonstrativo com sincronização instantânea em `LocalStorage` e pronta para migração com Supabase. |

---

## 5. Regras de Negócio (RN)

### RN01 — A Fórmula do Ganho Diário (Down-Top)
1. O usuário cadastra os dias da semana em que estuda (ex: 2 dias) e trabalha (ex: 3 dias). Total semanal: 5 dias.
2. O sistema estima os dias úteis no mês: $\text{Dias Mensais} \approx \text{Dias Semanais} \times 4.4$ (aprox. 22 dias).
3. O valor desbloqueado a cada check-in unitário é:
   $$\text{Valor Check-in} = \frac{\text{Meta Mensal}}{\text{Dias Mensais}}$$

### RN02 — Bloqueio de Duplicidade Diária
* Uma chave composta lógica `(user_id, tipo_checkin, data_atual)` só pode ser registrada uma vez.
* No banco de dados, é garantida por `CONSTRAINT unique_checkin_per_day UNIQUE (user_id, tipo_checkin, data)`.

### RN03 — Mecânica da Ofensiva (Streak)
* Cada dia com pelo menos um check-in válido incrementa o contador de ofensiva em +1.
* A ofensiva estimula a criação do hábito e a assiduidade contínua do aprendiz.

---

## 6. Arquitetura Técnica

```mermaid
graph TD
    User([Jovem Aprendiz Mobile]) -->|Acessa Next.js 16 App Router| Frontend[Frontend React 19 + Tailwind v4]
    Frontend -->|Interações Locais / Cache| LocalStorage[(LocalStorage Cache)]
    Frontend -->|API Route POST /api/chat| NextAPI[/api/chat Route Handler]
    NextAPI -->|Lê diretrizes pedagógicas| RegrasDoc[regras_senac.md]
    NextAPI -->|SDK Google GenAI| Gemini[Google Gemini 2.5 Flash]
    Frontend -->|Autenticação & Sync Futuro| Supabase[(Supabase PostgreSQL + RLS)]
    Frontend -->|Hospedagem & CDN Edge| Vercel[Vercel Serverless Platform]
```

---

## 7. Critérios de Aceite para Deploy na Vercel

- [x] O comando `npm run build` executa sem erros de lint ou TypeScript.
- [x] Arquivo `.env.example` versionado com as variáveis requeridas documentadas.
- [x] Rotas dinâmicas `/api/chat` compatíveis com o runtime Edge/Node.js da Vercel.
- [x] Imagens e ícones estáticos servidos a partir da pasta `/public`.
- [x] Configuração `vercel.json` fornecida com headers de segurança e otimizações.
