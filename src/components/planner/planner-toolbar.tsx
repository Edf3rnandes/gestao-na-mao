"use client";

import { useRouter } from "next/navigation";
import { CalendarCog, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  formatarDataCurta,
  formatarDataExtensa,
  formatarMesAno,
  inicioDaSemana,
  paraDataLocal,
  somarDias,
  somarMeses,
  type VisaoPlanner,
} from "@/lib/tempo";

const VISOES: { valor: VisaoPlanner; label: string }[] = [
  { valor: "dia", label: "Dia" },
  { valor: "semana", label: "Semana" },
  { valor: "mes", label: "Mês" },
];

export function PlannerToolbar({
  dataSelecionada,
  visao,
  onAbrirRotina,
  onNovoEvento,
}: {
  dataSelecionada: string;
  visao: VisaoPlanner;
  onAbrirRotina: () => void;
  onNovoEvento: () => void;
}) {
  const router = useRouter();
  const hoje = paraDataLocal(new Date());

  function irPara(data: string, novaVisao: VisaoPlanner = visao) {
    router.push(`/planner?data=${data}&visao=${novaVisao}`);
  }

  function navegar(delta: number) {
    if (visao === "dia") irPara(somarDias(dataSelecionada, delta));
    else if (visao === "semana") irPara(somarDias(dataSelecionada, delta * 7));
    else irPara(somarMeses(dataSelecionada, delta));
  }

  const rotulo =
    visao === "dia"
      ? formatarDataExtensa(dataSelecionada)
      : visao === "semana"
        ? `${formatarDataCurta(inicioDaSemana(dataSelecionada))} – ${formatarDataCurta(somarDias(inicioDaSemana(dataSelecionada), 6))}`
        : formatarMesAno(dataSelecionada);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navegar(-1)}
          className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="min-w-[200px] text-center">
          <p className="text-sm font-semibold capitalize">{rotulo}</p>
        </div>
        <button
          onClick={() => navegar(1)}
          className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          <ChevronRight size={18} />
        </button>
        {dataSelecionada !== hoje && (
          <button
            onClick={() => irPara(hoje)}
            className="text-xs font-medium text-neutral-500 underline-offset-2 hover:underline dark:text-neutral-400"
          >
            ir para hoje
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-900">
          {VISOES.map((v) => (
            <button
              key={v.valor}
              onClick={() => irPara(dataSelecionada, v.valor)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                visao === v.valor
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-50"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button
          onClick={onAbrirRotina}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          <CalendarCog size={16} />
          Rotina semanal
        </button>
        <button
          onClick={onNovoEvento}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-neutral-50 dark:text-neutral-900"
        >
          <Plus size={16} />
          Evento
        </button>
      </div>
    </div>
  );
}
