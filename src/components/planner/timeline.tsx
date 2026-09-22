"use client";

import { TIPO_COR, TIPO_LABEL, formatarMinutos } from "@/lib/tempo";
import type { BlocoTempo } from "@/lib/tempo";

const INICIO_JANELA = 5 * 60; // 05:00
const FIM_JANELA = 24 * 60; // 24:00
const PX_POR_MIN = 1;

export function Timeline({
  blocos,
  livres,
  onBlocoClick,
}: {
  blocos: BlocoTempo[];
  livres: { inicioMin: number; fimMin: number }[];
  onBlocoClick: (bloco: BlocoTempo) => void;
}) {
  const alturaTotal = (FIM_JANELA - INICIO_JANELA) * PX_POR_MIN;
  const horas = Array.from(
    { length: (FIM_JANELA - INICIO_JANELA) / 60 + 1 },
    (_, i) => INICIO_JANELA / 60 + i,
  );

  return (
    <div className="flex rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative" style={{ height: alturaTotal }}>
        {horas.map((h) => (
          <div
            key={h}
            className="absolute -translate-y-2 pr-3 text-right text-xs text-neutral-400"
            style={{ top: (h * 60 - INICIO_JANELA) * PX_POR_MIN, width: 44 }}
          >
            {String(h % 24).padStart(2, "0")}:00
          </div>
        ))}
      </div>

      <div
        className="relative ml-2 flex-1 border-l border-neutral-200 dark:border-neutral-800"
        style={{ height: alturaTotal }}
      >
        {horas.map((h) => (
          <div
            key={h}
            className="absolute w-full border-t border-neutral-100 dark:border-neutral-800/60"
            style={{ top: (h * 60 - INICIO_JANELA) * PX_POR_MIN }}
          />
        ))}

        {livres.map((slot, i) => (
          <div
            key={`livre-${i}`}
            className="absolute left-1 right-1 flex items-center justify-center rounded-lg border border-dashed border-neutral-300 text-[11px] font-medium text-neutral-400 dark:border-neutral-700 dark:text-neutral-600"
            style={{
              top: (slot.inicioMin - INICIO_JANELA) * PX_POR_MIN,
              height: (slot.fimMin - slot.inicioMin) * PX_POR_MIN,
            }}
          >
            {slot.fimMin - slot.inicioMin >= 40
              ? `livre · ${formatarMinutos(slot.inicioMin)}–${formatarMinutos(slot.fimMin)}`
              : "livre"}
          </div>
        ))}

        {blocos.map((bloco) => (
          <button
            key={bloco.id}
            onClick={() => onBlocoClick(bloco)}
            className={`absolute left-1 right-1 overflow-hidden rounded-lg border px-2 py-1 text-left text-xs shadow-sm ${TIPO_COR[bloco.tipo]}`}
            style={{
              top: (bloco.inicioMin - INICIO_JANELA) * PX_POR_MIN,
              height: Math.max(
                (bloco.fimMin - bloco.inicioMin) * PX_POR_MIN,
                18,
              ),
            }}
          >
            <span className="font-semibold">{bloco.titulo}</span>
            <span className="ml-1 opacity-80">{TIPO_LABEL[bloco.tipo]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
