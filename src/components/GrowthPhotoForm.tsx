"use client";

import { useRef, useState, useTransition } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { addGrowthPhoto } from "@/app/actions";
import { compressImage } from "@/lib/compressImage";

export function GrowthPhotoForm({ plantId }: { plantId: string }) {
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
      try {
        const photo = formData.get("photo");
        if (photo instanceof File && photo.size > 0) {
          formData.set("photo", await compressImage(photo));
        }
        const result = await addGrowthPhoto(plantId, { status: "idle" }, formData);
        if (result.status === "error") {
          setError(result.message ?? "Erro ao enviar a foto.");
          return;
        }
        formRef.current?.reset();
        setPreview(null);
      } catch {
        setError("Falha ao enviar a foto. Tente uma foto menor ou verifique sua conexão.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          name="photo"
          accept="image/*"
          multiple
          required
          onChange={handleFileChange}
          className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-green-800 dark:text-neutral-400 dark:file:bg-green-600 dark:hover:file:bg-green-500"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Pré-visualização" className="mt-3 h-32 w-32 rounded-lg object-cover" />
        )}
      </div>

      <input
        type="text"
        name="caption"
        placeholder="Legenda (opcional)"
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      />

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
      >
        {pending ? "Enviando..." : "+ Registrar crescimento"}
      </button>
    </form>
  );
}
