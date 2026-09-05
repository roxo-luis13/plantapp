"use client";

import { useActionState, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { createPlant, type CreatePlantState } from "@/app/actions";
import type { IdentificationCandidate } from "@/types/plant";

const initialState: CreatePlantState = { status: "idle" };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function NewPlantForm() {
  const [state, formAction, pending] = useActionState(createPlant, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<IdentificationCandidate[]>([]);
  const [identifying, setIdentifying] = useState(false);
  const [identifyError, setIdentifyError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setCandidates([]);
    setIdentifyError(null);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleIdentify() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setIdentifyError("Selecione uma foto primeiro.");
      return;
    }

    setIdentifying(true);
    setIdentifyError(null);
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
        setIdentifyError("Nenhuma espécie reconhecida. Tente outra foto ou digite o nome manualmente.");
      }
    } catch (error) {
      setIdentifyError(error instanceof Error ? error.message : "Erro ao identificar a planta.");
    } finally {
      setIdentifying(false);
    }
  }

  function selectCandidate(candidate: IdentificationCandidate) {
    setScientificName(candidate.scientificName);
    setName(candidate.commonNames[0] ?? candidate.scientificName);
    setConfidence(candidate.score);
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Foto da planta (no dia da compra)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          name="photo"
          accept="image/*"
          capture="environment"
          required
          onChange={handleFileChange}
          className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-green-800 dark:text-neutral-400 dark:file:bg-green-600 dark:hover:file:bg-green-500"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Pré-visualização" className="mt-3 h-48 w-48 rounded-lg object-cover" />
        )}
      </div>

      {preview && (
        <div>
          <button
            type="button"
            onClick={handleIdentify}
            disabled={identifying}
            className="rounded-lg border border-green-700 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-60 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950"
          >
            {identifying ? "Identificando..." : "🔎 Identificar planta com IA"}
          </button>
          {identifyError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{identifyError}</p>
          )}
          {candidates.length > 0 && (
            <ul className="mt-3 flex flex-col gap-2">
              {candidates.map((candidate) => (
                <li key={candidate.scientificName}>
                  <button
                    type="button"
                    onClick={() => selectCandidate(candidate)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                      scientificName === candidate.scientificName
                        ? "border-green-700 bg-green-50 dark:border-green-500 dark:bg-green-950"
                        : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span className="font-medium italic">{candidate.scientificName}</span>
                    {candidate.commonNames.length > 0 && (
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {" "}
                        — {candidate.commonNames.join(", ")}
                      </span>
                    )}
                    <span className="ml-1 text-xs text-neutral-400 dark:text-neutral-500">
                      ({Math.round(candidate.score * 100)}% de confiança)
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nome da planta</label>
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex: Costela-de-adão"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
      </div>

      <input type="hidden" name="scientificName" value={scientificName} />
      <input type="hidden" name="confidence" value={confidence ?? ""} />

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Data de compra</label>
        <input
          type="date"
          name="purchaseDate"
          required
          defaultValue={todayISO()}
          max={todayISO()}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Notas (opcional)</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Onde comprou, vaso usado, etc."
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
      >
        {pending ? "Salvando..." : "Salvar planta"}
      </button>
    </form>
  );
}
