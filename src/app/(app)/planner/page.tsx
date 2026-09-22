import { createClient } from "@/lib/supabase/server";
import type { Evento, RotinaSemanal } from "@/lib/supabase/types";
import { paraDataLocal } from "@/lib/tempo";
import { PlannerView } from "@/components/planner/planner-view";

export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const params = await searchParams;
  const dataSelecionada = params.data ?? paraDataLocal(new Date());

  const supabase = await createClient();
  const [{ data: rotina }, { data: eventos }] = await Promise.all([
    supabase
      .from("rotina_semanal")
      .select("*")
      .eq("ativo", true)
      .order("hora_inicio", { ascending: true }),
    supabase
      .from("eventos")
      .select("*")
      .eq("data", dataSelecionada)
      .order("hora_inicio", { ascending: true, nullsFirst: true }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Planner</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Rotina semanal, agenda do dia e os horários livres.
        </p>
      </div>
      <PlannerView
        dataSelecionada={dataSelecionada}
        rotinaSemanal={(rotina ?? []) as unknown as RotinaSemanal[]}
        eventosDoDia={(eventos ?? []) as unknown as Evento[]}
      />
    </div>
  );
}
