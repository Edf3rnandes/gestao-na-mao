"use client";

import { Dumbbell } from "lucide-react";
import type { TreinoComExercicios } from "@/lib/supabase/types";
import { CategoriaTreinoBadge } from "./treino-badges";

export function TreinoCard({
  treino,
  onClick,
}: {
  treino: TreinoComExercicios;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="mb-2 flex items-center gap-2">
        <Dumbbell size={16} className="text-neutral-400" />
        <CategoriaTreinoBadge categoria={treino.categoria} />
      </div>
      <p className="font-medium text-neutral-900 dark:text-neutral-50">
        {treino.nome}
      </p>
      {treino.descricao && (
        <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
          {treino.descricao}
        </p>
      )}
      <p className="mt-2 text-xs font-medium text-neutral-400">
        {treino.exercicios.length}{" "}
        {treino.exercicios.length === 1 ? "exercício" : "exercícios"}
      </p>
    </button>
  );
}
