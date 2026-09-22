import { createClient } from "@/lib/supabase/server";
import type { Demanda } from "@/lib/supabase/types";
import { KanbanBoard } from "@/components/demandas/kanban-board";

export default async function DemandasPage() {
  const supabase = await createClient();
  const { data: demandas } = await supabase
    .from("demandas")
    .select("*")
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: true });
  const demandasTipadas = (demandas ?? []) as unknown as Demanda[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Demandas</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Suas tarefas pessoais e empresariais, num quadro só.
        </p>
      </div>
      <KanbanBoard demandasIniciais={demandasTipadas} />
    </div>
  );
}
