"use client";

import type { Demanda, Evento } from "@/lib/supabase/types";
import { DIAS_SEMANA_ABREV, gradeMensal, paraDataLocal } from "@/lib/tempo";

export function MonthView({
  dataSelecionada,
  eventos,
  demandas,
  onDiaClick,
  onEventoClick,
}: {
  dataSelecionada: string;
  eventos: Evento[];
  demandas: Demanda[];
  onDiaClick: (data: string) => void;
  onEventoClick: (evento: Evento) => void;
}) {
  const semanas = gradeMensal(dataSelecionada);
  const mesRef = new Date(`${dataSelecionada}T00:00:00`).getMonth();
  const hoje = paraDataLocal(new Date());

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50 text-center text-xs font-semibold uppercase text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950">
        {DIAS_SEMANA_ABREV.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {semanas.flat().map((dia) => {
          const foraDoMes = new Date(`${dia}T00:00:00`).getMonth() !== mesRef;
          const ehHoje = dia === hoje;
          const eventosDoDia = eventos.filter((e) => e.data === dia);
          const vencimentos = demandas.filter(
            (d) => d.data_vencimento === dia,
          );

          const itensVencimento = vencimentos.map((d) => ({
            key: `d-${d.id}`,
            texto: d.titulo,
            cor:
              d.status === "feito"
                ? "bg-neutral-100 text-neutral-400 line-through dark:bg-neutral-800"
                : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
            evento: null as Evento | null,
          }));
          const itensEvento = eventosDoDia.map((e) => ({
            key: `e-${e.id}`,
            texto: e.titulo,
            cor: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
            evento: e,
          }));
          const itens = [...itensVencimento, ...itensEvento];
          const visiveis = itens.slice(0, 3);
          const restantes = itens.length - visiveis.length;

          return (
            <div
              key={dia}
              onClick={() => onDiaClick(dia)}
              className={`flex min-h-[92px] cursor-pointer flex-col gap-1 border-b border-r border-neutral-100 p-1.5 last:border-r-0 hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900/60 ${
                foraDoMes ? "bg-neutral-50/60 dark:bg-neutral-950/40" : ""
              }`}
            >
              <span
                className={`self-start rounded-full px-1.5 text-xs font-medium ${
                  ehHoje
                    ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900"
                    : foraDoMes
                      ? "text-neutral-300 dark:text-neutral-700"
                      : "text-neutral-600 dark:text-neutral-300"
                }`}
              >
                {dia.slice(8, 10)}
              </span>
              <div className="flex flex-col gap-0.5">
                {visiveis.map((item) =>
                  item.evento ? (
                    <button
                      key={item.key}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventoClick(item.evento!);
                      }}
                      className={`truncate rounded px-1 text-left text-[10px] font-medium ${item.cor}`}
                    >
                      {item.texto}
                    </button>
                  ) : (
                    <span
                      key={item.key}
                      className={`truncate rounded px-1 text-[10px] font-medium ${item.cor}`}
                    >
                      {item.texto}
                    </span>
                  ),
                )}
                {restantes > 0 && (
                  <span className="text-[10px] text-neutral-400">
                    +{restantes} mais
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
