"use client";

import { deletePlant } from "@/app/actions";

export function DeletePlantButton({ plantId, photoPath }: { plantId: string; photoPath: string }) {
  return (
    <form
      action={deletePlant.bind(null, plantId, photoPath)}
      onSubmit={(event) => {
        if (!window.confirm("Remover esta planta do catálogo?")) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm text-red-600 hover:text-red-800">
        Remover
      </button>
    </form>
  );
}
