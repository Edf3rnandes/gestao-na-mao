"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCog, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { Evento, RotinaSemanal } from "@/lib/supabase/types";
import {
  atualizarEvento,
  criarEvento,
  excluirEvento,
  type EventoInput,
} from "@/app/(app)/planner/actions";
import {
  calcularSlotsLivres,
  diaDaSemana,
  formatarDataExtensa,
  paraDataLocal,
  paraMinutos,
  somarDias,
  type BlocoTempo,
} from "@/lib/tempo";
import { Timeline } from "./timeline";
import { EventoDialog } from "./evento-dialog";
import { RotinaManager } from "./rotina-manager";

export function PlannerView({
  dataSelecionada,
  rotinaSemanal,
  eventosDoDia,
}: {
  dataSelecionada: string;
  rotinaSemanal: RotinaSemanal[];
  eventosDoDia: Evento[];
}) {
  const router = useRouter();
  const [eventoDialogAberto, setEventoDialogAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(
    null,
  );
  const [rotinaAberta, setRotinaAberta] = useState(false);

  const hoje = paraDataLocal(new Date());
  const diaSemana = diaDaSemana(dataSelecionada);

  function irPara(data: string) {
    router.push(`/planner?data=${data}`);
  }

  const blocos: BlocoTempo[] = useMemo(() => {
    const daRotina: BlocoTempo[] = rotinaSemanal
      .filter((r) => r.dia_semana === diaSemana)
      .map((r) => ({
        id: r.id,
        tipo: r.tipo,
        titulo: r.titulo,
        inicioMin: paraMinutos(r.hora_inicio),
        fimMin: paraMinutos(r.hora_fim),
        origem: "rotina" as const,
      }));

    const doDia: BlocoTempo[] = eventosDoDia
      .filter((e) => !e.dia_todo && e.hora_inicio && e.hora_fim)
      .map((e) => ({
        id: e.id,
        tipo: e.tipo,
        titulo: e.titulo,
        inicioMin: paraMinutos(e.hora_inicio!),
        fimMin: paraMinutos(e.hora_fim!),
        origem: "evento" as const,
      }));

    return [...daRotina, ...doDia];
  }, [rotinaSemanal, eventosDoDia, diaSemana]);

  const eventosDiaTodo = eventosDoDia.filter((e) => e.dia_todo);

  const livres = useMemo(
    () => calcularSlotsLivres(blocos, 5 * 60, 24 * 60),
    [blocos],
  );

  function handleBlocoClick(bloco: BlocoTempo) {
    if (bloco.origem !== "evento") return;
    const evento = eventosDoDia.find((e) => e.id === bloco.id);
    if (evento) {
      setEventoSelecionado(evento);
      setEventoDialogAberto(true);
    }
  }

  async function handleSalvarEvento(input: EventoInput) {
    if (eventoSelecionado) {
      await atualizarEvento(eventoSelecionado.id, input);
    } else {
      await criarEvento(input);
    }
    setEventoSelecionado(null);
    router.refresh();
  }

  async function handleExcluirEvento(id: string) {
    await excluirEvento(id);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => irPara(somarDias(dataSelecionada, -1))}
            className="rounded-lg border border-neutral-200 p-2 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-[220px] text-center">
            <p className="text-sm font-semibold capitalize">
              {formatarDataExtensa(dataSelecionada)}
            </p>
            {dataSelecionada === hoje && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                hoje
              </p>
            )}
          </div>
          <button
            onClick={() => irPara(somarDias(dataSelecionada, 1))}
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

        <div className="flex gap-2">
          <button
            onClick={() => setRotinaAberta(true)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            <CalendarCog size={16} />
            Rotina semanal
          </button>
          <button
            onClick={() => {
              setEventoSelecionado(null);
              setEventoDialogAberto(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-neutral-50 dark:text-neutral-900"
          >
            <Plus size={16} />
            Evento
          </button>
        </div>
      </div>

      {eventosDiaTodo.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {eventosDiaTodo.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                setEventoSelecionado(e);
                setEventoDialogAberto(true);
              }}
              className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
            >
              {e.titulo} · dia todo
            </button>
          ))}
        </div>
      )}

      <Timeline blocos={blocos} livres={livres} onBlocoClick={handleBlocoClick} />

      {eventoDialogAberto && (
        <EventoDialog
          data={dataSelecionada}
          evento={eventoSelecionado}
          onClose={() => setEventoDialogAberto(false)}
          onSave={handleSalvarEvento}
          onDelete={eventoSelecionado ? handleExcluirEvento : undefined}
        />
      )}

      {rotinaAberta && (
        <RotinaManager
          rotinaSemanal={rotinaSemanal}
          onClose={() => {
            setRotinaAberta(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
