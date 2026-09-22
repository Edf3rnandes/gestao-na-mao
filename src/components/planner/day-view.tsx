"use client";

import { useMemo } from "react";
import type { Evento, RotinaSemanal } from "@/lib/supabase/types";
import {
  calcularSlotsLivres,
  combinarBlocosDoDia,
  type BlocoTempo,
} from "@/lib/tempo";
import { Timeline } from "./timeline";

export function DayView({
  dataSelecionada,
  rotinaSemanal,
  eventosDoDia,
  onBlocoClick,
  onEventoDiaTodoClick,
}: {
  dataSelecionada: string;
  rotinaSemanal: RotinaSemanal[];
  eventosDoDia: Evento[];
  onBlocoClick: (bloco: BlocoTempo) => void;
  onEventoDiaTodoClick: (evento: Evento) => void;
}) {
  const blocos = useMemo(
    () => combinarBlocosDoDia(rotinaSemanal, eventosDoDia, dataSelecionada),
    [rotinaSemanal, eventosDoDia, dataSelecionada],
  );

  const eventosDiaTodo = eventosDoDia.filter((e) => e.dia_todo);

  const livres = useMemo(
    () => calcularSlotsLivres(blocos, 5 * 60, 24 * 60),
    [blocos],
  );

  return (
    <div>
      {eventosDiaTodo.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {eventosDiaTodo.map((e) => (
            <button
              key={e.id}
              onClick={() => onEventoDiaTodoClick(e)}
              className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
            >
              {e.titulo} · dia todo
            </button>
          ))}
        </div>
      )}

      <Timeline blocos={blocos} livres={livres} onBlocoClick={onBlocoClick} />
    </div>
  );
}
