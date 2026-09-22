"use client";

import { useState, useTransition } from "react";
import { X, Trash2 } from "lucide-react";
import type { Evento, TipoBloco } from "@/lib/supabase/types";
import type { EventoInput } from "@/app/(app)/planner/actions";

const TIPOS: Exclude<TipoBloco, "livre">[] = [
  "trabalho",
  "treino",
  "alimentacao",
  "pessoal",
  "evento",
];

const TIPO_LABEL: Record<string, string> = {
  trabalho: "Trabalho",
  treino: "Treino",
  alimentacao: "Alimentação",
  pessoal: "Pessoal",
  evento: "Evento",
};

export function EventoDialog({
  data,
  evento,
  onClose,
  onSave,
  onDelete,
}: {
  data: string;
  evento: Evento | null;
  onClose: () => void;
  onSave: (input: EventoInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [titulo, setTitulo] = useState(evento?.titulo ?? "");
  const [tipo, setTipo] = useState<Exclude<TipoBloco, "livre">>(
    evento?.tipo ?? "evento",
  );
  const [horaInicio, setHoraInicio] = useState(
    evento?.hora_inicio?.slice(0, 5) ?? "09:00",
  );
  const [horaFim, setHoraFim] = useState(evento?.hora_fim?.slice(0, 5) ?? "10:00");
  const [diaTodo, setDiaTodo] = useState(evento?.dia_todo ?? false);
  const [local, setLocal] = useState(evento?.local ?? "");
  const [descricao, setDescricao] = useState(evento?.descricao ?? "");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    startTransition(async () => {
      await onSave({
        data,
        titulo: titulo.trim(),
        tipo,
        dia_todo: diaTodo,
        hora_inicio: diaTodo ? null : horaInicio,
        hora_fim: diaTodo ? null : horaFim,
        local: local.trim() || null,
        descricao: descricao.trim() || null,
      });
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {evento ? "Editar evento" : "Novo evento"}
          </h2>
          <button onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Título
            </label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              autoFocus
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Tipo
            </label>
            <select
              value={tipo}
              onChange={(e) =>
                setTipo(e.target.value as Exclude<TipoBloco, "livre">)
              }
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {TIPO_LABEL[t]}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <input
              type="checkbox"
              checked={diaTodo}
              onChange={(e) => setDiaTodo(e.target.checked)}
            />
            Dia todo
          </label>

          {!diaTodo && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Início
                </label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required={!diaTodo}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Fim
                </label>
                <input
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  required={!diaTodo}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Local
            </label>
            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Notas
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {evento && onDelete ? (
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await onDelete(evento.id);
                    onClose();
                  })
                }
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-neutral-50 dark:text-neutral-900"
            >
              {pending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
