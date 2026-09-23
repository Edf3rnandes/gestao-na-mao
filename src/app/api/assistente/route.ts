import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Demanda, Evento, RotinaSemanal } from "@/lib/supabase/types";
import {
  combinarBlocosDoDia,
  diaDaSemana,
  formatarDataExtensa,
  formatarMinutos,
  paraDataLocal,
  TIPO_LABEL,
} from "@/lib/tempo";

const client = new Anthropic();

interface MensagemEntrada {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const mensagens: MensagemEntrada[] = body?.mensagens;

  if (!Array.isArray(mensagens) || mensagens.length === 0) {
    return NextResponse.json({ error: "Mensagens inválidas." }, { status: 400 });
  }

  const hoje = paraDataLocal(new Date());
  const diaSemanaHoje = diaDaSemana(hoje);

  const [{ data: demandas }, { data: rotinaHoje }, { data: eventosHoje }] =
    await Promise.all([
      supabase
        .from("demandas")
        .select("*")
        .neq("status", "feito")
        .order("data_vencimento", { ascending: true, nullsFirst: false })
        .limit(30),
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
  const blocosHoje = combinarBlocosDoDia(
    (rotinaHoje ?? []) as unknown as RotinaSemanal[],
    (eventosHoje ?? []) as unknown as Evento[],
    hoje,
  );

  const resumoDemandas =
    todasDemandas.length === 0
      ? "Nenhuma demanda em aberto."
      : todasDemandas
          .map((d) => {
            const vencimento = d.data_vencimento
              ? ` (vence ${d.data_vencimento})`
              : "";
            const acao = d.proxima_acao
              ? ` — próxima ação: ${d.proxima_acao}`
              : "";
            return `- [${d.categoria}/${d.prioridade}/${d.status}] ${d.titulo}${vencimento}${acao}`;
          })
          .join("\n");

  const resumoAgenda =
    blocosHoje.length === 0
      ? "Nenhum compromisso fixo hoje."
      : blocosHoje
          .map(
            (b) =>
              `- ${formatarMinutos(b.inicioMin)}–${formatarMinutos(b.fimMin)} ${b.titulo} (${TIPO_LABEL[b.tipo]})`,
          )
          .join("\n");

  const systemPrompt = `Você é a secretária/assistente pessoal de ${user.email} dentro do app "Gestão na Mão", que reúne demandas, planner e treino num só lugar.

Hoje é ${formatarDataExtensa(hoje)}.

Demandas em aberto:
${resumoDemandas}

Agenda de hoje:
${resumoAgenda}

Ajude a priorizar tarefas, sugerir horários livres, redigir mensagens (WhatsApp, e-mail) e organizar o dia a dia — pessoal e do trabalho. Seja direta, prática e breve. Responda sempre em português do Brasil.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 4096,
      system: systemPrompt,
      output_config: { effort: "low" },
      messages: mensagens.map((m) => ({ role: m.role, content: m.content })),
    });

    const texto = response.content
      .filter((bloco): bloco is Anthropic.TextBlock => bloco.type === "text")
      .map((bloco) => bloco.text)
      .join("\n")
      .trim();

    return NextResponse.json({
      resposta: texto || "Não consegui gerar uma resposta.",
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        {
          error:
            "A chave da API da Anthropic não está configurada (ou é inválida) neste servidor.",
        },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Muitas mensagens agora — tenta de novo em instantes." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Erro na API da Anthropic: ${error.message}` },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { error: "Erro inesperado ao falar com a assistente." },
      { status: 500 },
    );
  }
}
