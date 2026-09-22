"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Demanda, StatusDemanda } from "@/lib/supabase/types";
import { DemandaCard } from "./demanda-card";

export function KanbanColumn({
  status,
  titulo,
  demandas,
  onCardClick,
}: {
  status: StatusDemanda;
  titulo: string;
  demandas: Demanda[];
  onCardClick: (demanda: Demanda) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[200px] w-full flex-col rounded-2xl border p-3 transition md:w-80 md:shrink-0 ${
        isOver
          ? "border-neutral-400 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-900"
          : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          {titulo}
        </h3>
        <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {demandas.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {demandas.map((demanda) => (
          <DemandaCard
            key={demanda.id}
            demanda={demanda}
            onClick={() => onCardClick(demanda)}
          />
        ))}
        {demandas.length === 0 && (
          <p className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-xs text-neutral-400 dark:border-neutral-700 dark:text-neutral-600">
            Nada por aqui
          </p>
        )}
      </div>
    </div>
  );
}
