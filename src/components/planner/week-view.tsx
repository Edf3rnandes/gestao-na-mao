"use client";

import { Plus } from "lucide-react";
import type { Demanda, Evento, RotinaSemanal } from "@/lib/supabase/types";
import {
  combinarBlocosDoDia,
  DIAS_SEMANA_ABREV,
  diasDaSemana,
  formatarMinutos,
  paraDataLocal,
} from "@/lib/tempo";

export function WeekView({
  dataSelecionada,
  rotinaSemanal,
  eventos,
  demandas,
  onDiaClick,
  onEventoClick,
  onNovoEvento,
}: {
  dataSelecionada: string;
  rotinaSemanal: RotinaSemanal[];
  eventos: Evento[];
  demandas: Demanda[];
  onDiaClick: (data: string) => void;
  onEventoClick: (evento: Evento) => void;
  onNovoEvento: (data: string) => void;
}) {
  const dias = diasDaSemana(dataSelecionada);
  const hoje = paraDataLocal(new Date());

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {dias.map((dia, idx) => {
        const blocos = combinarBlocosDoDia(rotinaSemanal, eventos, dia);
        const eventosDiaTodo = eventos.filter(
          (e) => e.data === dia && e.dia_todo,
        );
        const vencimentos = demandas.filter((d) => d.data_vencimento === dia);
        const ehHoje = dia === hoje;

        return (
          <div
            key={dia}
            className={`flex min-h-[220px] flex-col rounded-2xl border p-3 ${
              ehHoje
                ? "border-neutral-900 dark:border-neutral-100"
                : "border-neutral-200 dark:border-neutral-800"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                onClick={() => onDiaClick(dia)}
                className="text-left hover:underline"
              >
                <span className="block text-xs uppercase text-neutral-400">
                  {DIAS_SEMANA_ABREV[idx]}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    ehHoje ? "text-neutral-900 dark:text-neutral-50" : ""
                  }`}
                >
                  {dia.slice(8, 10)}
                </span>
              </button>
              <button
                onClick={() => onNovoEvento(dia)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-900"
                aria-label="Novo evento"
              >
                <Plus size={14} />
              </button>
            </div>

            {vencimentos.length > 0 && (
              <div className="mb-1.5 flex flex-wrap gap-1">
                {vencimentos.map((d) => (
                  <span
                    key={d.id}
                    className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      d.status === "feito"
                        ? "bg-neutral-100 text-neutral-400 line-through dark:bg-neutral-800"
                        : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                    }`}
                  >
                    {d.titulo}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-1 flex-col gap-1">
              {eventosDiaTodo.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onEventoClick(e)}
                  className="truncate rounded bg-rose-100 px-1.5 py-1 text-left text-[11px] font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                >
                  {e.titulo}
                </button>
              ))}
              {blocos.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    if (b.origem !== "evento") return;
                    const evento = eventos.find((e) => e.id === b.id);
                    if (evento) onEventoClick(evento);
                  }}
                  className={`truncate rounded border-l-2 px-1.5 py-1 text-left text-[11px] ${
                    b.origem === "evento"
                      ? "border-neutral-400 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900"
                      : "border-neutral-200 bg-neutral-50/60 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400"
                  }`}
                >
                  <span className="font-medium text-neutral-500 dark:text-neutral-400">
                    {formatarMinutos(b.inicioMin)}
                  </span>{" "}
                  {b.titulo}
                </button>
              ))}
              {blocos.length === 0 && eventosDiaTodo.length === 0 && (
                <p className="text-[11px] text-neutral-300 dark:text-neutral-700">
                  —
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
