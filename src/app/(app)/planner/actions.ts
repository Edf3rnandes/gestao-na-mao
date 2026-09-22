"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TipoBloco } from "@/lib/supabase/types";

export interface EventoInput {
  data: string;
  hora_inicio: string | null;
  hora_fim: string | null;
  dia_todo: boolean;
  tipo: Exclude<TipoBloco, "livre">;
  titulo: string;
  descricao: string | null;
  local: string | null;
}

export interface RotinaInput {
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  tipo: TipoBloco;
  titulo: string;
  descricao: string | null;
}

async function getUserOrThrow() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return { supabase, user };
}

export async function criarEvento(input: EventoInput) {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("eventos")
    .insert({ ...input, user_id: user.id });
  if (error) throw new Error(error.message);
  revalidatePath("/planner");
  revalidatePath("/");
}

export async function atualizarEvento(id: string, input: EventoInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("eventos").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/planner");
  revalidatePath("/");
}

export async function excluirEvento(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("eventos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/planner");
  revalidatePath("/");
}

export async function criarRotina(input: RotinaInput) {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("rotina_semanal")
    .insert({ ...input, user_id: user.id, ativo: true });
  if (error) throw new Error(error.message);
  revalidatePath("/planner");
  revalidatePath("/");
}

export async function atualizarRotina(id: string, input: RotinaInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("rotina_semanal")
    .update(input)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/planner");
  revalidatePath("/");
}

export async function excluirRotina(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("rotina_semanal")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/planner");
  revalidatePath("/");
}
