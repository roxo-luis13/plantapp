"use client";

import { useState, useTransition } from "react";
import { updatePlantName } from "@/app/actions";

export function EditablePlantName({
  plantId,
  name,
  scientificName,
}: {
  plantId: string;
  name: string;
  scientificName: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updatePlantName(plantId, { status: "idle" }, formData);
      if (result.status === "error") {
        setError(result.message ?? "Erro ao salvar.");
      } else {
        setEditing(false);
      }
    });
  }

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{name}</h1>
          {scientificName && (
            <p className="italic text-neutral-500 dark:text-neutral-400">{scientificName}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          ✏️ Editar
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        name="name"
        required
        defaultValue={name}
        placeholder="Nome da planta"
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      />
      <input
        type="text"
        name="scientificName"
        defaultValue={scientificName ?? ""}
        placeholder="Nome científico (opcional)"
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base italic text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
        >
          {pending ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setError(null);
          }}
          disabled={pending}
          className="rounded-lg px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
