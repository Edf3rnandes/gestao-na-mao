import type { Database } from "./database.types";

export type { Database };

export type Categoria = "pessoal" | "empresarial";
export type StatusDemanda = "backlog" | "fazendo" | "feito";
export type Prioridade = "baixa" | "media" | "alta" | "urgente";
export type TipoBloco =
  | "trabalho"
  | "treino"
  | "alimentacao"
  | "pessoal"
  | "evento"
  | "livre";

type DemandaRow = Database["public"]["Tables"]["demandas"]["Row"];
export interface Demanda
  extends Omit<DemandaRow, "categoria" | "status" | "prioridade"> {
  categoria: Categoria;
  status: StatusDemanda;
  prioridade: Prioridade;
}

type RotinaRow = Database["public"]["Tables"]["rotina_semanal"]["Row"];
export interface RotinaSemanal extends Omit<RotinaRow, "tipo"> {
  tipo: TipoBloco;
}

type EventoRow = Database["public"]["Tables"]["eventos"]["Row"];
export interface Evento extends Omit<EventoRow, "tipo"> {
  tipo: Exclude<TipoBloco, "livre">;
}
