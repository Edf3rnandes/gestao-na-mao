"use client";

import { useDraggable } from "@dnd-kit/core";
import { CalendarDays, MessageSquareText } from "lucide-react";
import type { Demanda } from "@/lib/supabase/types";
import { CategoriaBadge, PrioridadeBadge } from "./demanda-badges";

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function estaVencida(data: string) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc = new Date(`${data}T00:00:00`);
  return venc < hoje;
}

export function DemandaCard({
  demanda,
  onClick,
}: {
  demanda: Demanda;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: demanda.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  const vencida =
    demanda.data_vencimento &&
    demanda.status !== "feito" &&
    estaVencida(demanda.data_vencimento);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`cursor-grab rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-neutral-800 dark:bg-neutral-900 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <CategoriaBadge categoria={demanda.categoria} />
        <PrioridadeBadge prioridade={demanda.prioridade} />
      </div>
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
        {demanda.titulo}
      </p>
      {demanda.proxima_acao && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <MessageSquareText size={13} className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">{demanda.proxima_acao}</span>
        </p>
      )}
      {demanda.data_vencimento && (
        <p
          className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
            vencida
              ? "text-red-600 dark:text-red-400"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          <CalendarDays size={13} />
          {formatarData(demanda.data_vencimento)}
          {vencida ? " · atrasada" : ""}
        </p>
      )}
    </div>
  );
}
