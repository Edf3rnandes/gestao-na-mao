"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import type { Treino } from "@/lib/supabase/types";
import type { SessaoInput } from "@/app/(app)/treino/actions";
import { paraDataLocal } from "@/lib/tempo";

export function SessaoDialog({
  treinos,
  onClose,
  onSave,
}: {
  treinos: Treino[];
  onClose: () => void;
  onSave: (input: SessaoInput) => Promise<void>;
}) {
  const [treinoId, setTreinoId] = useState<string>(treinos[0]?.id ?? "");
  const [data, setData] = useState(paraDataLocal(new Date()));
  const [duracao, setDuracao] = useState("");
  const [notas, setNotas] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await onSave({
        treino_id: treinoId || null,
        data,
        duracao_minutos: duracao ? Number(duracao) : null,
        notas: notas.trim() || null,
      });
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Registrar treino</h2>
          <button onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Qual treino
            </label>
            <select
              value={treinoId}
              onChange={(e) => setTreinoId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
            >
              <option value="">Sem plano específico</option>
              {treinos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Data
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Duração (min)
              </label>
              <input
                type="number"
                min={0}
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Notas
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              placeholder="Como foi, cargas usadas, etc."
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-neutral-50 dark:text-neutral-900"
            >
              {pending ? "Salvando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
