/**
 * Tipo discriminado para os tipos válidos de check-in diário.
 * - 'senac': Formação teórica nas dependências do Senac.
 * - 'trabalho': Prática profissional na empresa parceira conveniada.
 */
export type CheckinType = 'senac' | 'trabalho';

/**
 * Interface representativa do registro de perfil do aprendiz na tabela `users`.
 */
export interface UserProfile {
  /** Identificador único do usuário (UUID herdado de auth.users) */
  id: string;
  /** Nome ou apelido do aprendiz */
  nome: string;
  /** Meta financeira mensal em Reais (ex: 880.00) */
  meta_mensal: number;
  /** Dias da semana de atuação na empresa: 1 = Seg, 2 = Ter, etc. */
  dias_trabalho: number[];
  /** Dias da semana de aulas no Senac: 1 = Seg, 2 = Ter, etc. */
  dias_senac: number[];
  /** Saldo acumulado desbloqueado no mês corrente */
  saldo_atual: number;
  /** Dias consecutivos de presenças confirmadas (streak) */
  ofensiva: number;
  /** Data/hora de criação do registro no banco */
  created_at: string;
  /** Data/hora da última alteração no registro */
  updated_at: string;
}

/**
 * Interface representativa de um registro de check-in individual na tabela `daily_logs`.
 */
export interface DailyLog {
  /** Identificador único do log (UUID) */
  id: string;
  /** Chave estrangeira referenciando o id em users */
  user_id: string;
  /** Modalidade da presença confirmada */
  tipo_checkin: CheckinType;
  /** Data civil da presença no formato ISO YYYY-MM-DD */
  data: string;
  /** Valor monetário proporcional desbloqueado por esta presença */
  valor_adicionado: number;
  /** Data/hora de registro */
  created_at: string;
}

/**
 * Definição do esquema do banco de dados relacional Supabase para TypeScript.
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserProfile, 'id'>>;
      };
      daily_logs: {
        Row: DailyLog;
        Insert: Omit<DailyLog, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DailyLog, 'id'>>;
      };
    };
  };
}
