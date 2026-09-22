"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CategoriaTreino } from "@/lib/supabase/types";

export interface ExercicioInput {
  nome: string;
  series: number | null;
  repeticoes: string | null;
  carga: string | null;
  descanso_segundos: number | null;
  notas: string | null;
}

export interface TreinoInput {
  nome: string;
  categoria: CategoriaTreino;
  descricao: string | null;
  exercicios: ExercicioInput[];
}

async function getUserOrThrow() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return { supabase, user };
}

export async function salvarTreino(id: string | null, input: TreinoInput) {
  const { supabase, user } = await getUserOrThrow();

  let treinoId = id;

  if (treinoId) {
    const { error } = await supabase
      .from("treinos")
      .update({
        nome: input.nome,
        categoria: input.categoria,
        descricao: input.descricao,
      })
      .eq("id", treinoId);
    if (error) throw new Error(error.message);

    const { error: erroExclusao } = await supabase
      .from("treino_exercicios")
      .delete()
      .eq("treino_id", treinoId);
    if (erroExclusao) throw new Error(erroExclusao.message);
  } else {
    const { data, error } = await supabase
      .from("treinos")
      .insert({
        nome: input.nome,
        categoria: input.categoria,
        descricao: input.descricao,
        user_id: user.id,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    treinoId = data.id;
  }

  if (input.exercicios.length > 0) {
    const { error: erroExercicios } = await supabase
      .from("treino_exercicios")
      .insert(
        input.exercicios.map((ex, index) => ({
          ...ex,
          treino_id: treinoId!,
          ordem: index,
          user_id: user.id,
        })),
      );
    if (erroExercicios) throw new Error(erroExercicios.message);
  }

  revalidatePath("/treino");
  revalidatePath("/");
}

export async function excluirTreino(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("treinos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/treino");
  revalidatePath("/");
}

export interface SessaoInput {
  treino_id: string | null;
  data: string;
  duracao_minutos: number | null;
  notas: string | null;
}

export async function registrarSessao(input: SessaoInput) {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("treino_sessoes")
    .insert({ ...input, user_id: user.id });
  if (error) throw new Error(error.message);
  revalidatePath("/treino");
  revalidatePath("/");
}

export async function excluirSessao(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("treino_sessoes")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/treino");
  revalidatePath("/");
}
