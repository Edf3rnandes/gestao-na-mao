"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import type { Categoria, Demanda, StatusDemanda } from "@/lib/supabase/types";
import {
  atualizarDemanda,
  criarDemanda,
  excluirDemanda,
  moverDemanda,
  type DemandaInput,
} from "@/app/(app)/demandas/actions";
import { KanbanColumn } from "./kanban-column";
import { DemandaDialog } from "./demanda-dialog";

const COLUNAS: { status: StatusDemanda; titulo: string }[] = [
  { status: "backlog", titulo: "Backlog" },
  { status: "fazendo", titulo: "Fazendo" },
  { status: "feito", titulo: "Feito" },
];

const FILTROS: { valor: Categoria | "todas"; label: string }[] = [
  { valor: "todas", label: "Todas" },
  { valor: "pessoal", label: "Pessoal" },
  { valor: "empresarial", label: "Empresarial" },
];

export function KanbanBoard({
  demandasIniciais,
}: {
  demandasIniciais: Demanda[];
}) {
  const [demandas, setDemandas] = useState(demandasIniciais);
  const [filtro, setFiltro] = useState<Categoria | "todas">("todas");
  const [dialogAberto, setDialogAberto] = useState(false);
  const [demandaSelecionada, setDemandaSelecionada] =
    useState<Demanda | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const demandasFiltradas = useMemo(
    () =>
      filtro === "todas"
        ? demandas
        : demandas.filter((d) => d.categoria === filtro),
    [demandas, filtro],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const novoStatus = over.id as StatusDemanda;
    const demanda = demandas.find((d) => d.id === active.id);
    if (!demanda || demanda.status === novoStatus) return;

    setDemandas((prev) =>
      prev.map((d) =>
        d.id === demanda.id ? { ...d, status: novoStatus } : d,
      ),
    );
    moverDemanda(demanda.id, novoStatus).catch(() => {
      setDemandas((prev) =>
        prev.map((d) =>
          d.id === demanda.id ? { ...d, status: demanda.status } : d,
        ),
      );
    });
  }

  async function handleSalvar(input: DemandaInput) {
    if (demandaSelecionada) {
      await atualizarDemanda(demandaSelecionada.id, input);
      setDemandas((prev) =>
        prev.map((d) =>
          d.id === demandaSelecionada.id ? { ...d, ...input } : d,
        ),
      );
    } else {
      await criarDemanda(input);
      // A revalidação do server component vai trazer o registro real;
      // aqui só fechamos o modal e deixamos o Next atualizar a lista.
    }
    setDemandaSelecionada(null);
  }

  async function handleExcluir(id: string) {
    await excluirDemanda(id);
    setDemandas((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-900">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              onClick={() => setFiltro(f.valor)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filtro === f.valor
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-50"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setDemandaSelecionada(null);
            setDialogAberto(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-neutral-50 dark:text-neutral-900"
        >
          <Plus size={16} />
          Nova demanda
        </button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-4 md:flex-row md:overflow-x-auto md:pb-2">
          {COLUNAS.map((coluna) => (
            <KanbanColumn
              key={coluna.status}
              status={coluna.status}
              titulo={coluna.titulo}
              demandas={demandasFiltradas.filter(
                (d) => d.status === coluna.status,
              )}
              onCardClick={(demanda) => {
                setDemandaSelecionada(demanda);
                setDialogAberto(true);
              }}
            />
          ))}
        </div>
      </DndContext>

      {dialogAberto && (
        <DemandaDialog
          demanda={demandaSelecionada}
          onClose={() => setDialogAberto(false)}
          onSave={handleSalvar}
          onDelete={demandaSelecionada ? handleExcluir : undefined}
        />
      )}
    </div>
  );
}
