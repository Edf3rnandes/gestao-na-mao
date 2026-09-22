"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { RotinaSemanal, TipoBloco } from "@/lib/supabase/types";
import {
  criarRotina,
  excluirRotina,
  type RotinaInput,
} from "@/app/(app)/planner/actions";
import { DIAS_SEMANA, TIPO_LABEL } from "@/lib/tempo";

const TIPOS: TipoBloco[] = [
  "trabalho",
  "treino",
  "alimentacao",
  "pessoal",
  "evento",
];

export function RotinaManager({
  rotinaSemanal,
  onClose,
}: {
  rotinaSemanal: RotinaSemanal[];
  onClose: () => void;
}) {
  const [itens, setItens] = useState(rotinaSemanal);
  const [pending, startTransition] = useTransition();
  const [novo, setNovo] = useState<RotinaInput>({
    dia_semana: 1,
    hora_inicio: "09:00",
    hora_fim: "18:00",
    tipo: "trabalho",
    titulo: "",
    descricao: null,
  });

  function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!novo.titulo.trim()) return;
    startTransition(async () => {
      await criarRotina(novo);
      setItens((prev) => [
        ...prev,
        {
          ...novo,
          id: crypto.randomUUID(),
          user_id: "",
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      setNovo((n) => ({ ...n, titulo: "" }));
    });
  }

  function remover(id: string) {
    startTransition(async () => {
      await excluirRotina(id);
      setItens((prev) => prev.filter((i) => i.id !== id));
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Rotina semanal</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Horários fixos: trabalho, treino, alimentação e afins.
            </p>
          </div>
          <button onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {DIAS_SEMANA.map((dia, idx) => {
            const doDia = itens
              .filter((i) => i.dia_semana === idx)
              .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
            return (
              <div key={dia}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {dia}
                </p>
                {doDia.length === 0 ? (
                  <p className="text-sm text-neutral-400">Sem horários fixos</p>
                ) : (
                  <ul className="space-y-1.5">
                    {doDia.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
                      >
                        <span>
                          <span className="font-medium">
                            {item.hora_inicio.slice(0, 5)}–
                            {item.hora_fim.slice(0, 5)}
                          </span>{" "}
                          {item.titulo}{" "}
                          <span className="text-neutral-400">
                            ({TIPO_LABEL[item.tipo]})
                          </span>
                        </span>
                        <button
                          disabled={pending}
                          onClick={() => remover(item.id)}
                          className="text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <form
          onSubmit={adicionar}
          className="mt-6 space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800"
        >
          <p className="text-sm font-medium">Adicionar horário fixo</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <select
              value={novo.dia_semana}
              onChange={(e) =>
                setNovo((n) => ({ ...n, dia_semana: Number(e.target.value) }))
              }
              className="col-span-2 rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 sm:col-span-1"
            >
              {DIAS_SEMANA.map((dia, idx) => (
                <option key={dia} value={idx}>
                  {dia}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={novo.hora_inicio}
              onChange={(e) =>
                setNovo((n) => ({ ...n, hora_inicio: e.target.value }))
              }
              className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
            <input
              type="time"
              value={novo.hora_fim}
              onChange={(e) =>
                setNovo((n) => ({ ...n, hora_fim: e.target.value }))
              }
              className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
            <select
              value={novo.tipo}
              onChange={(e) =>
                setNovo((n) => ({ ...n, tipo: e.target.value as TipoBloco }))
              }
              className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {TIPO_LABEL[t]}
                </option>
              ))}
            </select>
            <input
              value={novo.titulo}
              onChange={(e) =>
                setNovo((n) => ({ ...n, titulo: e.target.value }))
              }
              placeholder="Título (ex: Expediente loja)"
              className="col-span-2 rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 sm:col-span-5"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-neutral-50 dark:text-neutral-900"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
}
