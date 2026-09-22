import type { TipoBloco } from "@/lib/supabase/types";

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

export interface BlocoTempo {
  id: string;
  tipo: TipoBloco;
  titulo: string;
  inicioMin: number;
  fimMin: number;
  origem: "rotina" | "evento";
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
