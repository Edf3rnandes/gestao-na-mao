"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { TreinoSessaoComTreino } from "@/lib/supabase/types";
import { formatarDataCurta } from "@/lib/tempo";

export function SessoesList({
  sessoes,
  onExcluir,
}: {
  sessoes: TreinoSessaoComTreino[];
  onExcluir: (id: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  if (sessoes.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Nenhum treino registrado ainda.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {sessoes.map((s) => (
        <li
          key={s.id}
          className="flex items-center justify-between gap-2 rounded-lg border border-neutral-100 px-3 py-2 text-sm dark:border-neutral-800"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">
              {s.treino?.nome ?? "Treino livre"}
              <span className="ml-2 font-normal text-neutral-400">
                {formatarDataCurta(s.data)}
              </span>
            </p>
            {s.notas && (
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {s.notas}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {s.duracao_minutos && (
              <span className="text-xs text-neutral-400">
                {s.duracao_minutos} min
              </span>
            )}
            <button
              disabled={pending}
              onClick={() => startTransition(() => onExcluir(s.id))}
              className="text-neutral-300 hover:text-red-600 dark:text-neutral-700 dark:hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
