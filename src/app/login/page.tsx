"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "./actions";

const initialState: AuthState = {};

export default function LoginPage() {
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState,
  );

  const action = mode === "entrar" ? signInAction : signUpAction;
  const state = mode === "entrar" ? signInState : signUpState;
  const pending = mode === "entrar" ? signInPending : signUpPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Gestão na Mão
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {mode === "entrar"
            ? "Entre para ver suas demandas e sua agenda."
            : "Crie sua conta de acesso."}
        </p>

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Senha
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete={
                mode === "entrar" ? "current-password" : "new-password"
              }
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:focus:border-neutral-400"
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {state.error}
            </p>
          )}
          {mode === "criar" && !state.error && signUpState !== initialState && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Conta criada. Verifique seu e-mail se a confirmação estiver
              ativa, ou entre diretamente.
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {pending
              ? "Aguarde..."
              : mode === "entrar"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "entrar" ? "criar" : "entrar")}
          className="mt-4 w-full text-center text-sm text-neutral-500 underline-offset-2 hover:underline dark:text-neutral-400"
        >
          {mode === "entrar"
            ? "Ainda não tenho conta"
            : "Já tenho conta, quero entrar"}
        </button>
      </div>
    </div>
  );
}
