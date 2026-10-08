# 📋 Backlog de Issues & Kanban - FELICI-IÁ

Este documento contém todas as issues mapeadas para o desenvolvimento do **FELICI-IÁ**, divididas por Épicos e organizadas com títulos, tags e critérios de aceite.

---

## 🏗️ Épico 1: Setup e Infraestrutura Base

### Issue 1.1: [Setup] Inicializar Next.js + Tailwind + Vercel
- **Labels:** `setup`, `frontend`, `infrastructure`
- **Descrição:**
  Inicializar o projeto base utilizando Next.js com App Router, TypeScript e configurar TailwindCSS e Shadcn/ui para os componentes visuais. Realizar a configuração do repositório e o deploy contínuo inicial na Vercel.
- **Critérios de Aceite:**
  - [ ] Projeto Next.js criado com App Router e TypeScript.
  - [ ] TailwindCSS configurado e funcionando.
  - [ ] Shadcn/ui inicializado com componentes essenciais (`button`, `card`, `dialog`, etc.).
  - [ ] Deploy automático ativo e funcionando na Vercel.

---

### Issue 1.2: [Setup] Configurar Supabase e Variáveis de Ambiente
- **Labels:** `setup`, `backend`, `auth`
- **Descrição:**
  Criar o projeto no Supabase, obter as credenciais (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) e configurar no `.env.local` e nas variáveis de ambiente da Vercel. Configurar o provedor de autenticação Google OAuth.
- **Critérios de Aceite:**
  - [ ] Projeto criado no Supabase.
  - [ ] Chaves configuradas no `.env.local` e documentadas no `.env.example`.
  - [ ] Google OAuth configurado no console do Google Cloud e integrado ao Supabase Auth.
  - [ ] Cliente do Supabase (`@supabase/supabase-js` / `@supabase/ssr`) configurado no Next.js.

---

### Issue 1.3: [Setup] Configurar Google Gemini API
- **Labels:** `setup`, `ai`, `backend`
- **Descrição:**
  Gerar a chave de API no Google AI Studio e integrar ao ambiente de desenvolvimento (`GEMINI_API_KEY` em `.env.local`). Configurar SDK oficial (`@google/genai` ou `@google/generative-ai`).
- **Critérios de Aceite:**
  - [ ] API Key obtida no Google AI Studio.
  - [ ] Chave inserida no `.env.local` e nas variáveis da Vercel.
  - [ ] SDK instalado e serviço de teste instanciado com sucesso.

---

## 🗄️ Épico 2: Banco de Dados e Modelagem

### Issue 2.1: [DB] Criar esquema de tabelas no Supabase
- **Labels:** `database`, `backend`
- **Descrição:**
  Criar o script SQL de migração com as tabelas principais do sistema: `users` e `daily_logs`.
  - **Tabela `users`:**
    - `id` (UUID, PK referenciando `auth.users`)
    - `nome` (Text)
    - `meta_mensal` (Numeric/Decimal)
    - `dias_trabalho` (Integer/Array de dias)
    - `dias_senac` (Integer/Array de dias)
    - `saldo_atual` (Numeric/Decimal, default 0)
    - `ofensiva` (Integer, default 0)
    - `created_at` (Timestamp)
  - **Tabela `daily_logs`:**
    - `id` (UUID, PK)
    - `user_id` (UUID, FK para `users.id`)
    - `tipo_checkin` (Enum/Text: 'senac' | 'trabalho')
    - `data` (Date)
    - `valor_adicionado` (Numeric/Decimal)
    - `created_at` (Timestamp)
- **Critérios de Aceite:**
  - [ ] Script SQL executado e versionado na pasta `supabase/migrations`.
  - [ ] Tipos TypeScript gerados ou mapeados para o schema.

---

### Issue 2.2: [DB] Políticas de Segurança (RLS)
- **Labels:** `database`, `security`
- **Descrição:**
  Habilitar Row Level Security (RLS) nas tabelas `users` e `daily_logs`. Criar políticas para garantir que cada usuário autenticado tenha permissão apenas para ler e modificar seus próprios registros (`auth.uid() = id` ou `auth.uid() = user_id`).
- **Critérios de Aceite:**
  - [ ] RLS habilitado em `users` e `daily_logs`.
  - [ ] Políticas de `SELECT`, `INSERT`, `UPDATE` validadas para usuários autenticados.
  - [ ] Acesso anônimo ou de terceiros bloqueado.

---

## 📱 Épico 3: Interface e Autenticação (Mobile-First)

### Issue 3.1: [Auth] Tela de Login
- **Labels:** `frontend`, `auth`, `ui`
- **Descrição:**
  Criar a interface inicial de autenticação mobile-first, com apresentação visual da FELICI-IÁ e botão "Entrar com Google" disparando o fluxo de login via Supabase Auth.
- **Critérios de Aceite:**
  - [ ] Layout mobile-first responsivo e atraente com a identidade visual da FELICI-IÁ.
  - [ ] Botão "Entrar com Google" funcional com redirect correto.
  - [ ] Redirecionamento automático pós-login para o Onboarding (se usuário novo) ou Home (se já cadastrado).

---

### Issue 3.2: [UI] Layout Base e Bottom Navigation
- **Labels:** `frontend`, `ui`
- **Descrição:**
  Desenvolver o shell da aplicação mobile-first com a barra de navegação inferior fixa (Bottom Navigation) contendo as abas: Home, Carteira e Perfil.
- **Critérios de Aceite:**
  - [ ] Componente `BottomNavigation` fixo no rodapé no mobile.
  - [ ] Ícones ativos/inativos e transição suave entre rotas.
  - [ ] Área de conteúdo com safe-area padding adequada para dispositivos móveis.

---

### Issue 3.3: [UI] Componente FAB (Floating Action Button)
- **Labels:** `frontend`, `ui`
- **Descrição:**
  Criar o botão flutuante da FELICI-IÁ posicionado acima da barra de navegação inferior. Ao ser clicado, abre o modal/drawer de chat com a inteligência artificial a partir de qualquer tela da aplicação.
- **Critérios de Aceite:**
  - [ ] FAB com visual destacado, animação sutil (micro-interações) e acessibilidade.
  - [ ] Abertura suave do modal/drawer de conversa.
  - [ ] Disponível globalmente nas telas protegidas.

---

## 🎮 Épico 4: Gamificação e Lógica Core (Down-Top)

### Issue 4.1: [Feature] Onboarding de Meta
- **Labels:** `frontend`, `feature`
- **Descrição:**
  Desenvolver tela/modal exibida no primeiro acesso do aluno, permitindo definir sua "Meta Financeira Mensal" (ex: R$ 800,00) e os dias da semana de Senac e Empresa.
- **Critérios de Aceite:**
  - [ ] Validação de preenchimento dos valores e seleção dos dias.
  - [ ] Salvamento dos dados na tabela `users`.
  - [ ] Cálculo prévio demonstrando a taxa diária/hora para o usuário.

---

### Issue 4.2: [Feature] Missões Diárias e Check-in
- **Labels:** `frontend`, `backend`, `feature`
- **Descrição:**
  Criar os cards de ação na Home ("Fui ao Senac", "Fui ao Trabalho"). Ao clicar em um card:
  1. O sistema calcula o ganho diário com base na lógica down-top (`Meta / Dias Úteis do Mês`).
  2. Registra um novo item em `daily_logs`.
  3. Incrementa o `saldo_atual` e atualiza a `ofensiva` do usuário no Supabase.
  4. Exibe feedback comemorativo (animação de ganho e atualização do saldo).
- **Critérios de Aceite:**
  - [ ] Cards visuais na Home com estado de pendente e concluído.
  - [ ] Cálculo correto do ganho por presença.
  - [ ] Atualização em tempo real do saldo desbloqueado e da ofensiva.

---

### Issue 4.3: [Feature] Bloqueio de Duplicidade
- **Labels:** `feature`, `backend`, `security`
- **Descrição:**
  Implementar regras no frontend (estado visual desabilitado) e no backend (constraint no banco ou validação na API/RPC) para impedir que o usuário registre o mesmo check-in mais de uma vez no mesmo dia civil.
- **Critérios de Aceite:**
  - [ ] Botão do card fica desabilitado com indicador visual "Concluído hoje".
  - [ ] Constraint no Supabase (`UNIQUE(user_id, tipo_checkin, data)`) ou validação na inserção rejeitando duplicidade com mensagem amigável.

---

## 🤖 Épico 5: Inteligência Artificial (A FELICI-IÁ)

### Issue 5.1: [IA] Rota `/api/chat`
- **Labels:** `backend`, `ai`
- **Descrição:**
  Desenvolver a API Route no Next.js (`app/api/chat/route.ts`) para receber mensagens do usuário, conectar com a API do Google Gemini e retornar a resposta (com streaming de resposta se aplicável).
- **Critérios de Aceite:**
  - [ ] Endpoint `/api/chat` protegido por sessão/token do Supabase.
  - [ ] Comunicação funcional com Gemini (ex: modelo `gemini-1.5-flash` ou `gemini-2.0-flash`).
  - [ ] Tratamento de erros e rate-limits.

---

### Issue 5.2: [IA] Injeção de Contexto (System Prompt)
- **Labels:** `ai`, `backend`
- **Descrição:**
  Programar a rota `/api/chat` para recuperar o perfil do usuário (nome, saldo atual acumulado, meta financeira, ofensiva) e injetar o conteúdo de `regras_senac.md` (diretrizes pedagógicas e financeiras do programa) no prompt de sistema invisível da FELICI-IÁ.
- **Critérios de Aceite:**
  - [ ] Arquivo `regras_senac.md` criado com regras do programa Jovem Aprendiz / Senac.
  - [ ] Persona da FELICI-IÁ definida (amigável, encorajadora, focada em educação financeira e compromisso).
  - [ ] Respostas contextualizadas com o saldo real e a ofensiva do usuário.

---

### Issue 5.3: [IA] Interface do Chatbot
- **Labels:** `frontend`, `ai`, `ui`
- **Descrição:**
  Desenvolver a interface de chat (estilo WhatsApp / Messenger) aberta pelo FAB, com histórico da conversa, balões de mensagem do usuário e da FELICI-IÁ, suporte a formatação markdown, sugestões rápidas de perguntas e loading states.
- **Critérios de Aceite:**
  - [ ] Design responsivo adaptado para teclado mobile.
  - [ ] Renderização de texto formatado (Markdown).
  - [ ] Indicador de digitação ("FELICI-IÁ está pensando...").
  - [ ] Auto-scroll para a mensagem mais recente.
