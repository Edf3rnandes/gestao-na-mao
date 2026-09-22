"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Demanda, Evento, RotinaSemanal } from "@/lib/supabase/types";
import {
  atualizarEvento,
  criarEvento,
  excluirEvento,
  type EventoInput,
} from "@/app/(app)/planner/actions";
import type { BlocoTempo, VisaoPlanner } from "@/lib/tempo";
import { PlannerToolbar } from "./planner-toolbar";
import { DayView } from "./day-view";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";
import { EventoDialog } from "./evento-dialog";
import { RotinaManager } from "./rotina-manager";

export function PlannerView({
  dataSelecionada,
  visao,
  rotinaSemanal,
  eventos,
  demandas,
}: {
  dataSelecionada: string;
  visao: VisaoPlanner;
  rotinaSemanal: RotinaSemanal[];
  eventos: Evento[];
  demandas: Demanda[];
}) {
  const router = useRouter();
  const [eventoDialogAberto, setEventoDialogAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(
    null,
  );
  const [dataParaNovoEvento, setDataParaNovoEvento] =
    useState(dataSelecionada);
  const [rotinaAberta, setRotinaAberta] = useState(false);

  function handleDiaClick(data: string) {
    router.push(`/planner?data=${data}&visao=dia`);
  }

  function handleNovoEvento(data: string = dataSelecionada) {
    setEventoSelecionado(null);
    setDataParaNovoEvento(data);
    setEventoDialogAberto(true);
  }

  function handleEventoClick(evento: Evento) {
    setEventoSelecionado(evento);
    setEventoDialogAberto(true);
  }

  function handleBlocoClickDia(bloco: BlocoTempo) {
    if (bloco.origem !== "evento") return;
    const evento = eventos.find((e) => e.id === bloco.id);
    if (evento) handleEventoClick(evento);
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
      <PlannerToolbar
        dataSelecionada={dataSelecionada}
        visao={visao}
        onAbrirRotina={() => setRotinaAberta(true)}
        onNovoEvento={() => handleNovoEvento(dataSelecionada)}
      />

      {visao === "dia" && (
        <DayView
          dataSelecionada={dataSelecionada}
          rotinaSemanal={rotinaSemanal}
          eventosDoDia={eventos}
          onBlocoClick={handleBlocoClickDia}
          onEventoDiaTodoClick={handleEventoClick}
        />
      )}

      {visao === "semana" && (
        <WeekView
          dataSelecionada={dataSelecionada}
          rotinaSemanal={rotinaSemanal}
          eventos={eventos}
          demandas={demandas}
          onDiaClick={handleDiaClick}
          onEventoClick={handleEventoClick}
          onNovoEvento={handleNovoEvento}
        />
      )}

      {visao === "mes" && (
        <MonthView
          dataSelecionada={dataSelecionada}
          eventos={eventos}
          demandas={demandas}
          onDiaClick={handleDiaClick}
          onEventoClick={handleEventoClick}
        />
      )}

      {eventoDialogAberto && (
        <EventoDialog
          data={eventoSelecionado?.data ?? dataParaNovoEvento}
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
