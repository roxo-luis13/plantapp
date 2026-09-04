"use client";

import { useTransition } from "react";
import { refreshCareInfo } from "@/app/actions";

export function RefreshCareInfoButton({
  plantId,
  name,
  scientificName,
}: {
  plantId: string;
  name: string;
  scientificName: string | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => refreshCareInfo(plantId, name, scientificName))}
      className="rounded-lg border border-green-700 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-60"
    >
      {pending ? "Buscando cuidados..." : "🔎 Buscar dicas de cuidado com IA"}
    </button>
  );
}
