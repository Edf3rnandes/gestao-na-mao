export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      colaboradores: {
        Row: {
          ativo: boolean
          categoria_folha: string | null
          criado_em: string
          data_desligamento: string | null
          id: string
          nivel: number
          nome: string
          tipo: string
          unidade: string
        }
        Insert: {
          ativo?: boolean
          categoria_folha?: string | null
          criado_em?: string
          data_desligamento?: string | null
          id?: string
          nivel?: number
          nome: string
          tipo: string
          unidade?: string
        }
        Update: {
          ativo?: boolean
          categoria_folha?: string | null
          criado_em?: string
          data_desligamento?: string | null
          id?: string
          nivel?: number
          nome?: string
          tipo?: string
          unidade?: string
        }
        Relationships: []
      }
      demandas: {
        Row: {
          categoria: string
          concluido_em: string | null
          created_at: string
          data_vencimento: string | null
          descricao: string | null
          id: string
          ordem: number
          prioridade: string
          proxima_acao: string | null
          status: string
          tags: string[]
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria?: string
          concluido_em?: string | null
          created_at?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          ordem?: number
          prioridade?: string
          proxima_acao?: string | null
          status?: string
          tags?: string[]
          titulo: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          categoria?: string
          concluido_em?: string | null
          created_at?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          ordem?: number
          prioridade?: string
          proxima_acao?: string | null
          status?: string
          tags?: string[]
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          created_at: string
          data: string
          demanda_id: string | null
          descricao: string | null
          dia_todo: boolean
          hora_fim: string | null
          hora_inicio: string | null
          id: string
          local: string | null
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: string
          demanda_id?: string | null
          descricao?: string | null
          dia_todo?: boolean
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          local?: string | null
          tipo?: string
          titulo: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          data?: string
          demanda_id?: string | null
          descricao?: string | null
          dia_todo?: boolean
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          local?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demandas"
            referencedColumns: ["id"]
          },
        ]
      }
      feriados: {
        Row: {
          conta_trabalhado: boolean
          data: string
          descricao: string | null
          id: string
          unidade: string
        }
        Insert: {
          conta_trabalhado?: boolean
          data: string
          descricao?: string | null
          id?: string
          unidade?: string
        }
        Update: {
          conta_trabalhado?: boolean
          data?: string
          descricao?: string | null
          id?: string
          unidade?: string
        }
        Relationships: []
      }
      ferias: {
        Row: {
          colaborador: string
          data_fim: string
          data_inicio: string
          id: string
          obs: string | null
        }
        Insert: {
          colaborador: string
          data_fim: string
          data_inicio: string
          id?: string
          obs?: string | null
        }
        Update: {
          colaborador?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          obs?: string | null
        }
        Relationships: []
      }
      financeiro_config: {
        Row: {
          id: string
          valor: number
        }
        Insert: {
          id: string
          valor?: number
        }
        Update: {
          id?: string
          valor?: number
        }
        Relationships: []
      }
      financeiro_custos_gerais: {
        Row: {
          criado_em: string
          descricao: string
          id: string
          valor: number
        }
        Insert: {
          criado_em?: string
          descricao: string
          id?: string
          valor?: number
        }
        Update: {
          criado_em?: string
          descricao?: string
          id?: string
          valor?: number
        }
        Relationships: []
      }
      financeiro_fechamentos: {
        Row: {
          custo_fixo_unidades: number
          custo_folha: number
          custo_geral: number
          custo_repasse: number
          custo_total: number
          fechado_em: string
          inadimplencia_pct: number
          matriculados: number
          mes: string
          receita_bruta: number
          receita_extra: number
          receita_liquida: number
          resultado_final: number
        }
        Insert: {
          custo_fixo_unidades?: number
          custo_folha?: number
          custo_geral?: number
          custo_repasse?: number
          custo_total?: number
          fechado_em?: string
          inadimplencia_pct?: number
          matriculados?: number
          mes: string
          receita_bruta?: number
          receita_extra?: number
          receita_liquida?: number
          resultado_final?: number
        }
        Update: {
          custo_fixo_unidades?: number
          custo_folha?: number
          custo_geral?: number
          custo_repasse?: number
          custo_total?: number
          fechado_em?: string
          inadimplencia_pct?: number
          matriculados?: number
          mes?: string
          receita_bruta?: number
          receita_extra?: number
          receita_liquida?: number
          resultado_final?: number
        }
        Relationships: []
      }
      financeiro_receitas_extra: {
        Row: {
          categoria: string
          criado_em: string
          descricao: string
          id: string
          valor: number
        }
        Insert: {
          categoria?: string
          criado_em?: string
          descricao: string
          id?: string
          valor?: number
        }
        Update: {
          categoria?: string
          criado_em?: string
          descricao?: string
          id?: string
          valor?: number
        }
        Relationships: []
      }
      financeiro_unidades: {
        Row: {
          custos_fixos_extra: number
          mensalidade_media: number
          repasse_tipo: string
          repasse_valor: number
          unidade: string
        }
        Insert: {
          custos_fixos_extra?: number
          mensalidade_media?: number
          repasse_tipo?: string
          repasse_valor?: number
          unidade: string
        }
        Update: {
          custos_fixos_extra?: number
          mensalidade_media?: number
          repasse_tipo?: string
          repasse_valor?: number
          unidade?: string
        }
        Relationships: []
      }
      folha_overrides: {
        Row: {
          campo: string
          colaborador: string
          id: string
          mes: string
          valor: number
        }
        Insert: {
          campo: string
          colaborador: string
          id?: string
          mes: string
          valor: number
        }
        Update: {
          campo?: string
          colaborador?: string
          id?: string
          mes?: string
          valor?: number
        }
        Relationships: []
      }
      grade_horaria: {
        Row: {
          codigo: string
          colaborador: string
          data_fim: string | null
          data_inicio: string | null
          duracao_horas: number
          horario: string
          id: string
          nivel: number
          nota: string | null
          sem_vt: boolean
          tipo: string
          turma: string
          unidade: string
        }
        Insert: {
          codigo: string
          colaborador: string
          data_fim?: string | null
          data_inicio?: string | null
          duracao_horas?: number
          horario?: string
          id?: string
          nivel?: number
          nota?: string | null
          sem_vt?: boolean
          tipo: string
          turma: string
          unidade: string
        }
        Update: {
          codigo?: string
          colaborador?: string
          data_fim?: string | null
          data_inicio?: string | null
          duracao_horas?: number
          horario?: string
          id?: string
          nivel?: number
          nota?: string | null
          sem_vt?: boolean
          tipo?: string
          turma?: string
          unidade?: string
        }
        Relationships: []
      }
      lancamentos: {
        Row: {
          colaborador: string
          criado_em: string
          data: string
          horas: number
          id: number
          motivo: string | null
          nivel: number
          tipo: string
          usa_vt: string
        }
        Insert: {
          colaborador: string
          criado_em?: string
          data: string
          horas?: number
          id?: never
          motivo?: string | null
          nivel?: number
          tipo: string
          usa_vt?: string
        }
        Update: {
          colaborador?: string
          criado_em?: string
          data?: string
          horas?: number
          id?: never
          motivo?: string | null
          nivel?: number
          tipo?: string
          usa_vt?: string
        }
        Relationships: []
      }
      rotina_semanal: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id: string
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id?: string
          tipo: string
          titulo: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          dia_semana?: number
          hora_fim?: string
          hora_inicio?: string
          id?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      turmas_semanais: {
        Row: {
          categoria: string
          criado_em: string
          horario: string
          id: string
          limite: number
          matriculados: number
          semana: string
          turma: string
          unidade: string
        }
        Insert: {
          categoria: string
          criado_em?: string
          horario?: string
          id?: string
          limite?: number
          matriculados?: number
          semana: string
          turma: string
          unidade: string
        }
        Update: {
          categoria?: string
          criado_em?: string
          horario?: string
          id?: string
          limite?: number
          matriculados?: number
          semana?: string
          turma?: string
          unidade?: string
        }
        Relationships: []
      }
      unidades: {
        Row: {
          id: string
          nome: string
        }
        Insert: {
          id?: string
          nome: string
        }
        Update: {
          id?: string
          nome?: string
        }
        Relationships: []
      }
      valores: {
        Row: {
          id: string
          valor_hora: number
          valor_vt: number
        }
        Insert: {
          id: string
          valor_hora?: number
          valor_vt?: number
        }
        Update: {
          id?: string
          valor_hora?: number
          valor_vt?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
