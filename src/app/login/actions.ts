"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { status: "idle" | "error"; message?: string };

export const initialAuthState: AuthState = { status: "idle" };

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { status: "error", message: "Preencha e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: "E-mail ou senha incorretos." };
  }

  redirect("/");
}

export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { status: "error", message: "Preencha e-mail e senha." };
  }
  if (password.length < 6) {
    return { status: "error", message: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { status: "error", message: error.message };
  }

  if (!data.session) {
    return {
      status: "error",
      message:
        "Conta criada, mas a confirmação por e-mail ainda está ativa no Supabase. Desative em Authentication → Providers → Email → \"Confirm email\" e tente entrar de novo.",
    };
  }

  redirect("/");
}
