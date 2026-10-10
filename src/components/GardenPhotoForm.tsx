"use client";

import { useRef, useState, useTransition } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { uploadGardenPhoto } from "@/app/jardim/actions";

export function GardenPhotoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await uploadGardenPhoto({ status: "idle" }, formData);
      if (result.status === "error") {
        setError(result.message ?? "Erro ao enviar a foto.");
        return;
      }
      formRef.current?.reset();
      setPreview(null);
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Foto do jardim
        </label>
        <input
          ref={fileInputRef}
          type="file"
          name="photo"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-green-800 dark:text-neutral-400 dark:file:bg-green-600 dark:hover:file:bg-green-500"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Pré-visualização" className="mt-3 h-48 w-48 rounded-lg object-cover" />
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Legenda (opcional)
        </label>
        <input
          type="text"
          name="caption"
          placeholder="Ex: Depois da poda de outubro"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
      >
        {pending ? "Enviando..." : "Adicionar foto"}
      </button>
    </form>
  );
}
