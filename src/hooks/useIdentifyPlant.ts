"use client";

import { useState } from "react";
import type { IdentificationCandidate } from "@/types/plant";

export function useIdentifyPlant() {
  const [candidates, setCandidates] = useState<IdentificationCandidate[]>([]);
  const [identifying, setIdentifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function identify(file: File) {
    setIdentifying(true);
    setError(null);
    setCandidates([]);
    try {
      const body = new FormData();
      body.append("image", file);
      const response = await fetch("/api/identify", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível identificar a planta.");
      }
      setCandidates(data.candidates ?? []);
      if (!data.candidates?.length) {
        setError("Nenhuma espécie reconhecida. Tente outra foto.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao identificar a planta.");
    } finally {
      setIdentifying(false);
    }
  }

  return { candidates, identifying, error, identify };
}
