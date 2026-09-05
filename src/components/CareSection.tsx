"use client";

import { useState } from "react";
import { CareInfoView } from "@/components/CareInfoView";
import { RefreshCareInfoButton } from "@/components/RefreshCareInfoButton";
import type { CareInfo } from "@/types/plant";

export function CareSection({
  plantId,
  name,
  scientificName,
  careInfo,
}: {
  plantId: string;
  name: string;
  scientificName: string | null;
  careInfo: CareInfo | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex items-center gap-2 text-lg font-semibold text-green-900 dark:text-green-400"
        >
          <span className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}>▶</span>
          Cuidados
        </button>
        {open && (
          <RefreshCareInfoButton plantId={plantId} name={name} scientificName={scientificName} />
        )}
      </div>

      {open &&
        (careInfo ? (
          <CareInfoView careInfo={careInfo} />
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Ainda não há dicas de cuidado geradas. Clique no botão acima para buscar com IA.
          </p>
        ))}
    </section>
  );
}
