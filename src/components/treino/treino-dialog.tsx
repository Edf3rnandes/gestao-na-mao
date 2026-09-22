"use client";

import { useState, useTransition } from "react";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import type { CategoriaTreino, TreinoComExercicios } from "@/lib/supabase/types";
import type {
  ExercicioInput,
  TreinoInput,
} from "@/app/(app)/treino/actions";
import { CATEGORIA_TREINO_LABEL } from "./treino-badges";

const CATEGORIAS: CategoriaTreino[] = [
  "musculacao",
  "volei",
  "cardio",
  "mobilidade",
  "geral",
];

function exercicioVazio(): ExercicioInput {
  return {
    nome: "",
    series: null,
    repeticoes: null,
    carga: null,
    descanso_segundos: null,
    notas: null,
  };
}

export function TreinoDialog({
  treino,
  onClose,
  onSave,
  onDelete,
}: {
  treino: TreinoComExercicios | null;
  onClose: () => void;
  onSave: (input: TreinoInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [nome, setNome] = useState(treino?.nome ?? "");
  const [categoria, setCategoria] = useState<CategoriaTreino>(
    treino?.categoria ?? "geral",
  );
  const [descricao, setDescricao] = useState(treino?.descricao ?? "");
  const [exercicios, setExercicios] = useState<ExercicioInput[]>(
    treino?.exercicios.map((e) => ({
      nome: e.nome,
      series: e.series,
      repeticoes: e.repeticoes,
      carga: e.carga,
      descanso_segundos: e.descanso_segundos,
      notas: e.notas,
    })) ?? [exercicioVazio()],
  );
  const [pending, startTransition] = useTransition();

  function atualizarExercicio(
    index: number,
    campo: keyof ExercicioInput,
    valor: string,
  ) {
    setExercicios((prev) =>
      prev.map((ex, i) => {
        if (i !== index) return ex;
        if (campo === "series" || campo === "descanso_segundos") {
          return { ...ex, [campo]: valor === "" ? null : Number(valor) };
        }
        return { ...ex, [campo]: valor === "" ? null : valor };
      }),
    );
  }

  function removerExercicio(index: number) {
    setExercicios((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    const exerciciosValidos = exercicios.filter((ex) => ex.nome.trim());
    startTransition(async () => {
      await onSave({
        nome: nome.trim(),
        categoria,
        descricao: descricao.trim() || null,
        exercicios: exerciciosValidos,
      });
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {treino ? "Editar treino" : "Novo treino"}
          </h2>
          <button onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Nome
              </label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                autoFocus
                placeholder="Ex: Treino A - Peito e tríceps"
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) =>
                  setCategoria(e.target.value as CategoriaTreino)
                }
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORIA_TREINO_LABEL[c]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Exercícios
              </label>
              <button
                type="button"
                onClick={() =>
                  setExercicios((prev) => [...prev, exercicioVazio()])
                }
                className="flex items-center gap-1 text-xs font-medium text-neutral-600 hover:underline dark:text-neutral-300"
              >
                <Plus size={14} />
                Adicionar exercício
              </button>
            </div>

            <div className="space-y-2">
              {exercicios.map((ex, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-neutral-200 p-2 dark:border-neutral-800"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical
                      size={16}
                      className="mt-2.5 shrink-0 text-neutral-300 dark:text-neutral-700"
                    />
                    <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-6">
                      <input
                        value={ex.nome}
                        onChange={(e) =>
                          atualizarExercicio(index, "nome", e.target.value)
                        }
                        placeholder="Exercício"
                        className="col-span-2 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 sm:col-span-2"
                      />
                      <input
                        value={ex.series ?? ""}
                        onChange={(e) =>
                          atualizarExercicio(index, "series", e.target.value)
                        }
                        type="number"
                        min={0}
                        placeholder="Séries"
                        className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                      />
                      <input
                        value={ex.repeticoes ?? ""}
                        onChange={(e) =>
                          atualizarExercicio(
                            index,
                            "repeticoes",
                            e.target.value,
                          )
                        }
                        placeholder="Reps (ex: 8-12)"
                        className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                      />
                      <input
                        value={ex.carga ?? ""}
                        onChange={(e) =>
                          atualizarExercicio(index, "carga", e.target.value)
                        }
                        placeholder="Carga"
                        className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                      />
                      <input
                        value={ex.descanso_segundos ?? ""}
                        onChange={(e) =>
                          atualizarExercicio(
                            index,
                            "descanso_segundos",
                            e.target.value,
                          )
                        }
                        type="number"
                        min={0}
                        placeholder="Descanso (s)"
                        className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removerExercicio(index)}
                      className="mt-1 shrink-0 text-neutral-300 hover:text-red-600 dark:text-neutral-700 dark:hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {exercicios.length === 0 && (
                <p className="text-sm text-neutral-400">
                  Nenhum exercício ainda.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {treino && onDelete ? (
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await onDelete(treino.id);
                    onClose();
                  })
                }
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <Trash2 size={16} />
                Excluir treino
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
