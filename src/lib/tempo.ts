import type { Evento, RotinaSemanal, TipoBloco } from "@/lib/supabase/types";

export const DIAS_SEMANA = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export const DIAS_SEMANA_ABREV = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
];

export const TIPO_LABEL: Record<TipoBloco, string> = {
  trabalho: "Trabalho",
  treino: "Treino",
  alimentacao: "Alimentação",
  pessoal: "Pessoal",
  evento: "Evento",
  livre: "Livre",
};

export const TIPO_COR: Record<TipoBloco, string> = {
  trabalho: "bg-sky-500/90 border-sky-600 text-white",
  treino: "bg-emerald-500/90 border-emerald-600 text-white",
  alimentacao: "bg-amber-500/90 border-amber-600 text-white",
  pessoal: "bg-violet-500/90 border-violet-600 text-white",
  evento: "bg-rose-500/90 border-rose-600 text-white",
  livre: "bg-neutral-200 border-neutral-300 text-neutral-500",
};

export function paraDataLocal(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function diaDaSemana(dataIso: string) {
  return new Date(`${dataIso}T00:00:00`).getDay();
}

export function somarDias(dataIso: string, dias: number) {
  const d = new Date(`${dataIso}T00:00:00`);
  d.setDate(d.getDate() + dias);
  return paraDataLocal(d);
}

export function formatarDataExtensa(dataIso: string) {
  const d = new Date(`${dataIso}T00:00:00`);
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function formatarDataCurta(dataIso: string) {
  const d = new Date(`${dataIso}T00:00:00`);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function formatarMesAno(dataIso: string) {
  const d = new Date(`${dataIso}T00:00:00`);
  const texto = d.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function inicioDaSemana(dataIso: string) {
  return somarDias(dataIso, -diaDaSemana(dataIso));
}

export function diasDaSemana(dataIso: string) {
  const inicio = inicioDaSemana(dataIso);
  return Array.from({ length: 7 }, (_, i) => somarDias(inicio, i));
}

export function somarMeses(dataIso: string, meses: number) {
  const d = new Date(`${dataIso}T00:00:00`);
  const dia = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + meses);
  const ultimoDiaDoMesAlvo = new Date(
    d.getFullYear(),
    d.getMonth() + 1,
    0,
  ).getDate();
  d.setDate(Math.min(dia, ultimoDiaDoMesAlvo));
  return paraDataLocal(d);
}

/** Grade de semanas completas (dom–sáb) cobrindo o mês da data informada. */
export function gradeMensal(dataIso: string): string[][] {
  const ref = new Date(`${dataIso}T00:00:00`);
  const primeiro = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const ultimo = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);

  const inicioGrade = new Date(primeiro);
  inicioGrade.setDate(inicioGrade.getDate() - primeiro.getDay());
  const fimGrade = new Date(ultimo);
  fimGrade.setDate(fimGrade.getDate() + (6 - ultimo.getDay()));

  const semanas: string[][] = [];
  const cursor = new Date(inicioGrade);
  while (cursor <= fimGrade) {
    const dias: string[] = [];
    for (let i = 0; i < 7; i++) {
      dias.push(paraDataLocal(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    semanas.push(dias);
  }
  return semanas;
}

export function paraMinutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

export function formatarHora(hora: string) {
  return hora.slice(0, 5);
}

export function formatarMinutos(min: number) {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export type VisaoPlanner = "dia" | "semana" | "mes";

export interface BlocoTempo {
  id: string;
  tipo: TipoBloco;
  titulo: string;
  inicioMin: number;
  fimMin: number;
  origem: "rotina" | "evento";
}

/** Junta a rotina fixa do dia da semana com os eventos pontuais de uma data. */
export function combinarBlocosDoDia(
  rotinaSemanal: RotinaSemanal[],
  eventosDoDia: Evento[],
  dataIso: string,
): BlocoTempo[] {
  const diaSemana = diaDaSemana(dataIso);

  const daRotina: BlocoTempo[] = rotinaSemanal
    .filter((r) => r.dia_semana === diaSemana)
    .map((r) => ({
      id: r.id,
      tipo: r.tipo,
      titulo: r.titulo,
      inicioMin: paraMinutos(r.hora_inicio),
      fimMin: paraMinutos(r.hora_fim),
      origem: "rotina" as const,
    }));

  const doDia: BlocoTempo[] = eventosDoDia
    .filter((e) => e.data === dataIso && !e.dia_todo && e.hora_inicio && e.hora_fim)
    .map((e) => ({
      id: e.id,
      tipo: e.tipo,
      titulo: e.titulo,
      inicioMin: paraMinutos(e.hora_inicio!),
      fimMin: paraMinutos(e.hora_fim!),
      origem: "evento" as const,
    }));

  return [...daRotina, ...doDia].sort((a, b) => a.inicioMin - b.inicioMin);
}

export function calcularSlotsLivres(
  blocos: BlocoTempo[],
  inicioJanela: number,
  fimJanela: number,
): { inicioMin: number; fimMin: number }[] {
  const ordenados = [...blocos].sort((a, b) => a.inicioMin - b.inicioMin);
  const livres: { inicioMin: number; fimMin: number }[] = [];
  let cursor = inicioJanela;

  for (const bloco of ordenados) {
    const inicio = Math.max(bloco.inicioMin, inicioJanela);
    const fim = Math.min(bloco.fimMin, fimJanela);
    if (inicio > cursor) {
      livres.push({ inicioMin: cursor, fimMin: inicio });
    }
    cursor = Math.max(cursor, fim);
  }

  if (cursor < fimJanela) {
    livres.push({ inicioMin: cursor, fimMin: fimJanela });
  }

  return livres.filter((slot) => slot.fimMin - slot.inicioMin >= 15);
}
