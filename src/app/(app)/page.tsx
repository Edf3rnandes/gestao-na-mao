import Link from "next/link";
import { AlertTriangle, CalendarClock, CircleDot, ListTodo } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Demanda, Evento, RotinaSemanal } from "@/lib/supabase/types";
import { CategoriaBadge, PrioridadeBadge } from "@/components/demandas/demanda-badges";
import {
  calcularSlotsLivres,
  diaDaSemana,
  formatarDataExtensa,
  formatarMinutos,
  paraDataLocal,
  paraMinutos,
  TIPO_LABEL,
  type BlocoTempo,
} from "@/lib/tempo";

export default async function DashboardPage() {
  const hoje = paraDataLocal(new Date());
  const diaSemanaHoje = diaDaSemana(hoje);
  const supabase = await createClient();

  const [{ data: demandas }, { data: rotinaHoje }, { data: eventosHoje }] =
    await Promise.all([
      supabase
        .from("demandas")
        .select("*")
        .neq("status", "feito")
        .order("data_vencimento", { ascending: true, nullsFirst: false }),
      supabase
        .from("rotina_semanal")
        .select("*")
        .eq("ativo", true)
        .eq("dia_semana", diaSemanaHoje)
        .order("hora_inicio", { ascending: true }),
      supabase
        .from("eventos")
        .select("*")
        .eq("data", hoje)
        .order("hora_inicio", { ascending: true, nullsFirst: true }),
    ]);

  const todasDemandas = (demandas ?? []) as unknown as Demanda[];
  const rotinaHojeTipada = (rotinaHoje ?? []) as unknown as RotinaSemanal[];
  const eventosHojeTipados = (eventosHoje ?? []) as unknown as Evento[];
  const vencidas = todasDemandas.filter(
    (d) => d.data_vencimento && d.data_vencimento < hoje,
  );
  const paraHoje = todasDemandas.filter((d) => d.data_vencimento === hoje);
  const emAndamento = todasDemandas
    .filter((d) => d.status === "fazendo")
    .slice(0, 6);

  const blocosHoje: BlocoTempo[] = [
    ...rotinaHojeTipada.map((r) => ({
      id: r.id,
      tipo: r.tipo,
      titulo: r.titulo,
      inicioMin: paraMinutos(r.hora_inicio),
      fimMin: paraMinutos(r.hora_fim),
      origem: "rotina" as const,
    })),
    ...eventosHojeTipados
      .filter((e) => !e.dia_todo && e.hora_inicio && e.hora_fim)
      .map((e) => ({
        id: e.id,
        tipo: e.tipo,
        titulo: e.titulo,
        inicioMin: paraMinutos(e.hora_inicio!),
        fimMin: paraMinutos(e.hora_fim!),
        origem: "evento" as const,
      })),
  ].sort((a, b) => a.inicioMin - b.inicioMin);

  const livresHoje = calcularSlotsLivres(blocosHoje, 5 * 60, 24 * 60);
  const minutosLivresHoje = livresHoje.reduce(
    (acc, s) => acc + (s.fimMin - s.inicioMin),
    0,
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold capitalize">
          {formatarDataExtensa(hoje)}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          O que está em aberto e como está sua agenda hoje.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Atrasadas
          </p>
          <p className="mt-1 text-2xl font-semibold text-red-600 dark:text-red-400">
            {vencidas.length}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Vencem hoje
          </p>
          <p className="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">
            {paraHoje.length}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Livre hoje (após 5h)
          </p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            {Math.floor(minutosLivresHoje / 60)}h{" "}
            {String(minutosLivresHoje % 60).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="font-semibold">Não esqueça</h2>
          </div>
          {vencidas.length === 0 && paraHoje.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Nada atrasado nem vencendo hoje. 🎉
            </p>
          ) : (
            <ul className="space-y-2">
              {[...vencidas, ...paraHoje].map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-neutral-100 px-3 py-2 text-sm dark:border-neutral-800"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{d.titulo}</p>
                    {d.proxima_acao && (
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {d.proxima_acao}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <CategoriaBadge categoria={d.categoria} />
                    <PrioridadeBadge prioridade={d.prioridade} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/demandas"
            className="mt-3 inline-block text-sm font-medium text-neutral-600 underline-offset-2 hover:underline dark:text-neutral-300"
          >
            Ver quadro de demandas →
          </Link>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={18} className="text-sky-500" />
            <h2 className="font-semibold">Em andamento</h2>
          </div>
          {emAndamento.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Nada em andamento agora. Puxe algo do backlog.
            </p>
          ) : (
            <ul className="space-y-2">
              {emAndamento.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-neutral-100 px-3 py-2 text-sm dark:border-neutral-800"
                >
                  <p className="truncate font-medium">{d.titulo}</p>
                  <CategoriaBadge categoria={d.categoria} />
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/demandas"
            className="mt-3 inline-block text-sm font-medium text-neutral-600 underline-offset-2 hover:underline dark:text-neutral-300"
          >
            Ver todas →
          </Link>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock size={18} className="text-violet-500" />
            <h2 className="font-semibold">Agenda de hoje</h2>
          </div>
          {blocosHoje.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Nenhum horário fixo ou evento marcado para hoje.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {blocosHoje.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center gap-3 rounded-lg border border-neutral-100 px-3 py-2 text-sm dark:border-neutral-800"
                >
                  <span className="w-24 shrink-0 font-medium text-neutral-500 dark:text-neutral-400">
                    {formatarMinutos(b.inicioMin)}–{formatarMinutos(b.fimMin)}
                  </span>
                  <span className="font-medium">{b.titulo}</span>
                  <span className="ml-auto text-xs text-neutral-400">
                    {TIPO_LABEL[b.tipo]}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/planner"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 underline-offset-2 hover:underline dark:text-neutral-300"
          >
            <ListTodo size={15} />
            Ver planner completo →
          </Link>
        </section>
      </div>
    </div>
  );
}
