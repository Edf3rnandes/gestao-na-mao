import type { Categoria, Prioridade } from "@/lib/supabase/types";

const CATEGORIA_STYLES: Record<Categoria, string> = {
  pessoal:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  empresarial:
    "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
};

const CATEGORIA_LABEL: Record<Categoria, string> = {
  pessoal: "Pessoal",
  empresarial: "Empresarial",
};

export function CategoriaBadge({ categoria }: { categoria: Categoria }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${CATEGORIA_STYLES[categoria]}`}
    >
      {CATEGORIA_LABEL[categoria]}
    </span>
  );
}

const PRIORIDADE_STYLES: Record<Prioridade, string> = {
  baixa:
    "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  media:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  alta: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  urgente: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

export function PrioridadeBadge({ prioridade }: { prioridade: Prioridade }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORIDADE_STYLES[prioridade]}`}
    >
      {PRIORIDADE_LABEL[prioridade]}
    </span>
  );
}
