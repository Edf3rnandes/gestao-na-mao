import { createClient } from "@/lib/supabase/server";
import type {
  TreinoComExercicios,
  TreinoExercicio,
  TreinoSessaoComTreino,
} from "@/lib/supabase/types";
import { TreinoBoard } from "@/components/treino/treino-board";

export default async function TreinoPage() {
  const supabase = await createClient();

  const [{ data: treinos }, { data: sessoes }] = await Promise.all([
    supabase
      .from("treinos")
      .select("*, treino_exercicios(*)")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("treino_sessoes")
      .select("*, treinos(id, nome)")
      .order("data", { ascending: false })
      .limit(15),
  ]);

  const treinosTipados = ((treinos ?? []) as unknown as (TreinoComExercicios & {
    treino_exercicios: TreinoExercicio[];
  })[]).map((t) => ({
    ...t,
    exercicios: [...t.treino_exercicios].sort((a, b) => a.ordem - b.ordem),
  }));

  const sessoesTipadas = (sessoes ?? []) as unknown as TreinoSessaoComTreino[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Treino</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Monte seus treinos e registre o que fez.
        </p>
      </div>
      <TreinoBoard treinosIniciais={treinosTipados} sessoesIniciais={sessoesTipadas} />
    </div>
  );
}
