"use client";

import { useState, useTransition } from "react";
import { updatePlantNotes } from "@/app/actions";

export function EditablePlantNotes({ plantId, notes }: { plantId: string; notes: string | null }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updatePlantNotes(plantId, { status: "idle" }, formData);
      if (result.status === "error") {
        setError(result.message ?? "Erro ao salvar.");
      } else {
        setEditing(false);
      }
    });
  }

  if (!editing) {
    return (
      <div className="mt-4 flex items-start justify-between gap-3">
        {notes ? (
          <p className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">{notes}</p>
        ) : (
          <p className="text-sm text-neutral-400 dark:text-neutral-500">Nenhuma observação ainda.</p>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          ✏️ {notes ? "Editar" : "Adicionar"}
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="mt-4 flex flex-col gap-2">
      <textarea
        name="notes"
        rows={4}
        defaultValue={notes ?? ""}
        placeholder="Observações sobre essa planta..."
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
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
