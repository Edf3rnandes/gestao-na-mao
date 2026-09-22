"use client";

import { useState, useTransition } from "react";
import { X, Trash2 } from "lucide-react";
import type { Demanda } from "@/lib/supabase/types";
import type { DemandaInput } from "@/app/(app)/demandas/actions";

export function DemandaDialog({
  demanda,
  onClose,
  onSave,
  onDelete,
}: {
  demanda: Demanda | null;
  onClose: () => void;
  onSave: (input: DemandaInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [titulo, setTitulo] = useState(demanda?.titulo ?? "");
  const [descricao, setDescricao] = useState(demanda?.descricao ?? "");
  const [categoria, setCategoria] = useState<DemandaInput["categoria"]>(
    demanda?.categoria ?? "pessoal",
  );
  const [prioridade, setPrioridade] = useState<DemandaInput["prioridade"]>(
    demanda?.prioridade ?? "media",
  );
  const [proximaAcao, setProximaAcao] = useState(
    demanda?.proxima_acao ?? "",
  );
  const [dataVencimento, setDataVencimento] = useState(
    demanda?.data_vencimento ?? "",
  );
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    startTransition(async () => {
      await onSave({
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        categoria,
        prioridade,
        proxima_acao: proximaAcao.trim() || null,
        data_vencimento: dataVencimento || null,
      });
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {demanda ? "Editar demanda" : "Nova demanda"}
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
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Próxima ação / o que enviar
            </label>
            <textarea
              value={proximaAcao}
              onChange={(e) => setProximaAcao(e.target.value)}
              rows={2}
              placeholder="Ex: Mandar mensagem pro fornecedor confirmando o pedido"
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) =>
                  setCategoria(e.target.value as DemandaInput["categoria"])
                }
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
              >
                <option value="pessoal">Pessoal</option>
                <option value="empresarial">Empresarial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Prioridade
              </label>
              <select
                value={prioridade}
                onChange={(e) =>
                  setPrioridade(e.target.value as DemandaInput["prioridade"])
                }
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Vencimento
            </label>
            <input
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {demanda && onDelete ? (
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await onDelete(demanda.id);
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
