import type { CategoriaTreino } from "@/lib/supabase/types";

export const CATEGORIA_TREINO_LABEL: Record<CategoriaTreino, string> = {
  musculacao: "Musculação",
  volei: "Vôlei",
  cardio: "Cardio",
  mobilidade: "Mobilidade",
  geral: "Geral",
};

const CATEGORIA_TREINO_STYLES: Record<CategoriaTreino, string> = {
  musculacao:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  volei: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  cardio: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  mobilidade:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  geral:
    "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
};

export function CategoriaTreinoBadge({
  categoria,
}: {
  categoria: CategoriaTreino;
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${CATEGORIA_TREINO_STYLES[categoria]}`}
    >
      {CATEGORIA_TREINO_LABEL[categoria]}
    </span>
  );
}
