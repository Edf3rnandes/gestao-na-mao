"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  Categoria,
  Prioridade,
  StatusDemanda,
} from "@/lib/supabase/types";

export interface DemandaInput {
  titulo: string;
  descricao: string | null;
  categoria: Categoria;
  prioridade: Prioridade;
  proxima_acao: string | null;
  data_vencimento: string | null;
}

export async function criarDemanda(input: DemandaInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { error } = await supabase.from("demandas").insert({
    ...input,
    user_id: user.id,
    status: "backlog",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/demandas");
  revalidatePath("/");
}

export async function atualizarDemanda(id: string, input: DemandaInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("demandas")
    .update(input)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/demandas");
  revalidatePath("/");
}

export async function moverDemanda(id: string, status: StatusDemanda) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("demandas")
    .update({
      status,
      concluido_em: status === "feito" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/demandas");
  revalidatePath("/");
}

export async function excluirDemanda(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("demandas").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/demandas");
  revalidatePath("/");
}
