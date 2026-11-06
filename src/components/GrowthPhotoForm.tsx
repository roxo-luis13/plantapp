"use client";

import { useRef, useState, useTransition } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { addGrowthPhoto } from "@/app/actions";
import { compressImage } from "@/lib/compressImage";

export function GrowthPhotoForm({ plantId }: { plantId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        const photos = formData.getAll("photo").filter((p): p is File => p instanceof File && p.size > 0);
        formData.delete("photo");
        for (const photo of photos) {
          formData.append("photo", await compressImage(photo));
        }
        const result = await addGrowthPhoto(plantId, { status: "idle" }, formData);
        if (result.status === "error") {
          setError(result.message ?? "Erro ao enviar a foto.");
          return;
        }
        formRef.current?.reset();
        setPreviews([]);
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
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          Pode escolher mais de uma foto de uma vez, para registrar várias fases.
        </p>
        {previews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {previews.map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={index} src={src} alt="Pré-visualização" className="h-24 w-24 rounded-lg object-cover" />
            ))}
          </div>
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
