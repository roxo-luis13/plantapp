"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { AskPlantAI } from "@/components/AskPlantAI";
import { IdentifyCandidates } from "@/components/IdentifyCandidates";
import { useIdentifyPlant } from "@/hooks/useIdentifyPlant";
import type { IdentificationCandidate } from "@/types/plant";

export function QuickIdentify() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<IdentificationCandidate | null>(null);
  const { candidates, identifying, error, identify } = useIdentifyPlant();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setSelected(null);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Foto da planta
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-green-800 dark:text-neutral-400 dark:file:bg-green-600 dark:hover:file:bg-green-500"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Pré-visualização" className="mt-3 h-48 w-48 rounded-lg object-cover" />
        )}
      </div>

      {file && (
        <div>
          <button
            type="button"
            onClick={() => identify(file)}
            disabled={identifying}
            className="rounded-lg border border-green-700 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-60 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950"
          >
            {identifying ? "Identificando..." : "🔎 Que planta é essa?"}
          </button>
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <IdentifyCandidates
            candidates={candidates}
            selectedScientificName={selected?.scientificName ?? ""}
            onSelect={setSelected}
          />
        </div>
      )}

      {file && (
        <section className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
          <h2 className="mb-3 text-lg font-semibold text-green-900 dark:text-green-400">
            Pergunte à IA sobre essa foto
          </h2>
          <AskPlantAI
            name={selected?.commonNames[0] ?? selected?.scientificName}
            scientificName={selected?.scientificName ?? null}
            photo={{ file }}
          />
        </section>
      )}
    </div>
  );
}
