"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type {
  TreinoComExercicios,
  TreinoSessaoComTreino,
} from "@/lib/supabase/types";
import {
  excluirSessao,
  excluirTreino,
  registrarSessao,
  salvarTreino,
  type SessaoInput,
  type TreinoInput,
} from "@/app/(app)/treino/actions";
import { TreinoCard } from "./treino-card";
import { TreinoDialog } from "./treino-dialog";
import { SessaoDialog } from "./sessao-dialog";
import { SessoesList } from "./sessoes-list";

export function TreinoBoard({
  treinosIniciais,
  sessoesIniciais,
}: {
  treinosIniciais: TreinoComExercicios[];
  sessoesIniciais: TreinoSessaoComTreino[];
}) {
  const router = useRouter();
  const [treinoDialogAberto, setTreinoDialogAberto] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] =
    useState<TreinoComExercicios | null>(null);
  const [sessaoDialogAberto, setSessaoDialogAberto] = useState(false);

  async function handleSalvarTreino(input: TreinoInput) {
    await salvarTreino(treinoSelecionado?.id ?? null, input);
    setTreinoSelecionado(null);
    router.refresh();
  }

  async function handleExcluirTreino(id: string) {
    await excluirTreino(id);
    router.refresh();
  }

  async function handleRegistrarSessao(input: SessaoInput) {
    await registrarSessao(input);
    router.refresh();
  }

  async function handleExcluirSessao(id: string) {
    await excluirSessao(id);
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Seus treinos</h2>
          <button
            onClick={() => {
              setTreinoSelecionado(null);
              setTreinoDialogAberto(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-neutral-50 dark:text-neutral-900"
          >
            <Plus size={16} />
            Novo treino
          </button>
        </div>

        {treinosIniciais.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400 dark:border-neutral-700">
            Nenhum treino montado ainda. Crie o primeiro.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {treinosIniciais.map((t) => (
              <TreinoCard
                key={t.id}
                treino={t}
                onClick={() => {
                  setTreinoSelecionado(t);
                  setTreinoDialogAberto(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Histórico</h2>
          <button
            onClick={() => setSessaoDialogAberto(true)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            <Plus size={14} />
            Registrar
          </button>
        </div>
        <SessoesList sessoes={sessoesIniciais} onExcluir={handleExcluirSessao} />
      </div>

      {treinoDialogAberto && (
        <TreinoDialog
          treino={treinoSelecionado}
          onClose={() => setTreinoDialogAberto(false)}
          onSave={handleSalvarTreino}
          onDelete={treinoSelecionado ? handleExcluirTreino : undefined}
        />
      )}

      {sessaoDialogAberto && (
        <SessaoDialog
          treinos={treinosIniciais}
          onClose={() => setSessaoDialogAberto(false)}
          onSave={handleRegistrarSessao}
        />
      )}
    </div>
  );
}
