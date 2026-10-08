<#
.SYNOPSIS
    Script para criar automaticamente as issues no GitHub para o repositório felici-ia.

.DESCRIPTION
    Requer GitHub CLI (gh) autenticado: gh auth login
    Ou execute manualmente passando o token do GitHub.
#>

$repo = "nsdBRoficial/felici-ia"

$issues = @(
    @{
        title = "[Setup] Inicializar Next.js + Tailwind + Vercel"
        body = "Criar o projeto Next.js (App Router), configurar TailwindCSS, Shadcn/ui (para componentes base) e realizar o primeiro deploy na Vercel.`n`n**Épico:** Épico 1: Setup e Infraestrutura Base"
        labels = "setup,frontend"
    },
    @{
        title = "[Setup] Configurar Supabase e Variáveis de Ambiente"
        body = "Criar projeto no Supabase, obter chaves (URL, Anon Key) e configurar .env.local. Habilitar autenticação via Google OAuth.`n`n**Épico:** Épico 1: Setup e Infraestrutura Base"
        labels = "setup,backend,auth"
    },
    @{
        title = "[Setup] Configurar Google Gemini API"
        body = "Gerar API Key no Google AI Studio e integrar ao .env.local.`n`n**Épico:** Épico 1: Setup e Infraestrutura Base"
        labels = "setup,ai"
    },
    @{
        title = "[DB] Criar esquema de tabelas no Supabase"
        body = "Criar tabela users (id, nome, meta_mensal, dias_trabalho, dias_senac, saldo_atual, ofensiva) e daily_logs (id, user_id, tipo_checkin, data, valor_adicionado).`n`n**Épico:** Épico 2: Banco de Dados e Modelagem"
        labels = "database,backend"
    },
    @{
        title = "[DB] Políticas de Segurança (RLS)"
        body = "Configurar Row Level Security no Supabase para garantir que um usuário só possa ler/editar seus próprios dados.`n`n**Épico:** Épico 2: Banco de Dados e Modelagem"
        labels = "database,security"
    },
    @{
        title = "[Auth] Tela de Login"
        body = "Criar tela inicial com botão 'Entrar com Google' redirecionando via Supabase Auth.`n`n**Épico:** Épico 3: Interface e Autenticação (Mobile-First)"
        labels = "frontend,auth,ui"
    },
    @{
        title = "[UI] Layout Base e Bottom Navigation"
        body = "Desenvolver a estrutura visual mobile-first com barra de navegação inferior (Home, Carteira, Perfil).`n`n**Épico:** Épico 3: Interface e Autenticação (Mobile-First)"
        labels = "frontend,ui"
    },
    @{
        title = "[UI] Componente FAB (Floating Action Button)"
        body = "Criar o botão flutuante da FELICI-IÁ que abrirá o modal do chatbot em qualquer tela.`n`n**Épico:** Épico 3: Interface e Autenticação (Mobile-First)"
        labels = "frontend,ui"
    },
    @{
        title = "[Feature] Onboarding de Meta"
        body = "Tela/modal para o aluno, no primeiro acesso, definir sua 'Meta Financeira Mensal' e os dias da semana de Senac/Empresa.`n`n**Épico:** Épico 4: Gamificação e Lógica Core (Down-Top)"
        labels = "frontend,feature"
    },
    @{
        title = "[Feature] Missões Diárias e Check-in"
        body = "Criar os cards na Home ('Fui ao Senac', 'Fui ao Trabalho'). Ao clicar, calcular o ganho diário (Meta / Dias Úteis) e atualizar o saldo_atual no Supabase.`n`n**Épico:** Épico 4: Gamificação e Lógica Core (Down-Top)"
        labels = "frontend,feature"
    },
    @{
        title = "[Feature] Bloqueio de Duplicidade"
        body = "Criar regra no frontend e backend para impedir que o usuário faça o mesmo check-in duas vezes no mesmo dia.`n`n**Épico:** Épico 4: Gamificação e Lógica Core (Down-Top)"
        labels = "feature,backend"
    },
    @{
        title = "[IA] Rota /api/chat"
        body = "Desenvolver a API Route no Next.js para comunicar com o modelo Gemini.`n`n**Épico:** Épico 5: Inteligência Artificial (A FELICI-IÁ)"
        labels = "backend,ai"
    },
    @{
        title = "[IA] Injeção de Contexto (System Prompt)"
        body = "Programar a rota para buscar o saldo e ofensiva do usuário no Supabase e injetar junto ao arquivo regras_senac.md como instrução invisível para a IA.`n`n**Épico:** Épico 5: Inteligência Artificial (A FELICI-IÁ)"
        labels = "ai,backend"
    },
    @{
        title = "[IA] Interface do Chatbot"
        body = "Desenvolver o modal de mensagens (estilo WhatsApp) acionado pelo FAB, com suporte a markdown e loading states.`n`n**Épico:** Épico 5: Inteligência Artificial (A FELICI-IÁ)"
        labels = "frontend,ai,ui"
    }
)

Write-Host "Verificando autenticação no GitHub CLI..." -ForegroundColor Cyan

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "GitHub CLI (gh) não encontrado no PATH." -ForegroundColor Yellow
    Write-Host "Você pode instalar via winget: winget install --id GitHub.cli" -ForegroundColor Yellow
    Write-Host "Ou criar as issues diretamente no GitHub copiando do arquivo ISSUES.md." -ForegroundColor Green
    exit 1
}

foreach ($issue in $issues) {
    Write-Host "Criando issue: $($issue.title)..." -ForegroundColor Yellow
    gh issue create --repo $repo --title $issue.title --body $issue.body --label $issue.labels
}

Write-Host "`nTodas as issues foram processadas!" -ForegroundColor Green
