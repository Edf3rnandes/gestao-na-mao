import { createClient } from "@/lib/supabase/server";
import type { Demanda, Evento, RotinaSemanal } from "@/lib/supabase/types";
import { diasDaSemana, gradeMensal, paraDataLocal } from "@/lib/tempo";
import type { VisaoPlanner } from "@/lib/tempo";
import { PlannerView } from "@/components/planner/planner-view";

function intervaloDaVisao(visao: VisaoPlanner, dataSelecionada: string) {
  if (visao === "semana") {
    const dias = diasDaSemana(dataSelecionada);
    return { inicio: dias[0], fim: dias[6] };
  }
  if (visao === "mes") {
    const semanas = gradeMensal(dataSelecionada);
    return {
      inicio: semanas[0][0],
      fim: semanas[semanas.length - 1][6],
    };
  }
  return { inicio: dataSelecionada, fim: dataSelecionada };
}

export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string; visao?: string }>;
}) {
  const params = await searchParams;
  const dataSelecionada = params.data ?? paraDataLocal(new Date());
  const visao: VisaoPlanner =
    params.visao === "semana" || params.visao === "mes"
      ? params.visao
      : "dia";

  const { inicio, fim } = intervaloDaVisao(visao, dataSelecionada);

  const supabase = await createClient();
  const [{ data: rotina }, { data: eventos }, { data: demandas }] =
    await Promise.all([
      supabase
        .from("rotina_semanal")
        .select("*")
        .eq("ativo", true)
        .order("hora_inicio", { ascending: true }),
      supabase
        .from("eventos")
        .select("*")
        .gte("data", inicio)
        .lte("data", fim)
        .order("hora_inicio", { ascending: true, nullsFirst: true }),
      visao === "dia"
        ? Promise.resolve({ data: [] })
        : supabase
            .from("demandas")
            .select("*")
            .gte("data_vencimento", inicio)
            .lte("data_vencimento", fim),
    ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Planner</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Rotina semanal, agenda e os horários livres — por dia, semana ou
          mês.
        </p>
      </div>
      <PlannerView
        dataSelecionada={dataSelecionada}
        visao={visao}
        rotinaSemanal={(rotina ?? []) as unknown as RotinaSemanal[]}
        eventos={(eventos ?? []) as unknown as Evento[]}
        demandas={(demandas ?? []) as unknown as Demanda[]}
      />
    </div>
  );
}
