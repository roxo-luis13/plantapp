"use client";

import { useActionState, useState } from "react";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { signIn, signUp, initialAuthState } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialAuthState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialAuthState);

  const state = mode === "signin" ? signInState : signUpState;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-green-900 dark:text-green-400">🌱 Meu Jardim</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {mode === "signin" ? "Entre para acessar seu catálogo." : "Crie sua conta para começar."}
        </p>
      </div>

      <GoogleSignInButton />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        <span className="text-xs text-neutral-400 dark:text-neutral-500">ou com e-mail</span>
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {mode === "signin" ? (
        <form key="signin" action={signInAction} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            required
            placeholder="voce@email.com"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Senha"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
          <button
            type="submit"
            disabled={signInPending}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
          >
            {signInPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      ) : (
        <form key="signup" action={signUpAction} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            required
            placeholder="voce@email.com"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="Senha (mínimo 6 caracteres)"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
          <button
            type="submit"
            disabled={signUpPending}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
          >
            {signUpPending ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
      )}

      {state.message && (
        <p
          className={`text-center text-sm ${
            state.status === "error" ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="text-center text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        {mode === "signin" ? "Ainda não tem conta? Criar conta" : "Já tem conta? Entrar"}
      </button>
    </main>
  );
}
