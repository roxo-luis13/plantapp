"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle", message: undefined };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(sendMagicLink, initialState);

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-green-900">🌱 Meu Jardim</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Entre com seu e-mail para acessar seu catálogo de plantas.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="voce@email.com"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-green-600"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800 disabled:opacity-60"
        >
          {pending ? "Enviando..." : "Enviar link de acesso"}
        </button>
      </form>

      {state.message && (
        <p
          className={`text-center text-sm ${
            state.status === "error" ? "text-red-600" : "text-green-700"
          }`}
        >
          {state.message}
        </p>
      )}
    </main>
  );
}
