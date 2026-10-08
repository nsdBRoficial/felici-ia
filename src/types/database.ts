export type CheckinType = 'senac' | 'trabalho';

export interface UserProfile {
  id: string;
  nome: string;
  meta_mensal: number;
  dias_trabalho: number[]; // Dias da semana: 1 = Seg, 2 = Ter, etc.
  dias_senac: number[];
  saldo_atual: number;
  ofensiva: number;
  created_at: string;
  updated_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  tipo_checkin: CheckinType;
  data: string; // YYYY-MM-DD
  valor_adicionado: number;
  created_at: string;
}

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
