-- ==============================================================================
-- Schema Inicial FELICI-IÁ (Épico 2: Banco de Dados e Modelagem)
-- ==============================================================================

-- 1. Tabela: users
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  meta_mensal numeric(10, 2) not null default 0.00,
  dias_trabalho integer[] not null default '{}',
  dias_senac integer[] not null default '{}',
  saldo_atual numeric(10, 2) not null default 0.00,
  ofensiva integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela: daily_logs
create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  tipo_checkin text not null check (tipo_checkin in ('senac', 'trabalho')),
  data date not null default current_date,
  valor_adicionado numeric(10, 2) not null default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Bloqueio de duplicidade: não permite o mesmo check-in mais de uma vez no mesmo dia
  constraint unique_checkin_per_day unique (user_id, tipo_checkin, data)
);

-- 3. Habilita Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.daily_logs enable row level security;

-- 4. Políticas de Segurança (RLS) para 'users'
create policy "Usuários podem ver seu próprio perfil"
  on public.users for select
  using (auth.uid() = id);

create policy "Usuários podem criar seu próprio perfil"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil"
  on public.users for update
  using (auth.uid() = id);

-- 5. Políticas de Segurança (RLS) para 'daily_logs'
create policy "Usuários podem ver seus próprios logs"
  on public.daily_logs for select
  using (auth.uid() = user_id);

create policy "Usuários podem registrar seus próprios check-ins"
  on public.daily_logs for insert
  with check (auth.uid() = user_id);

-- 6. Trigger para atualizar updated_at automaticamente em 'users'
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger tr_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();
