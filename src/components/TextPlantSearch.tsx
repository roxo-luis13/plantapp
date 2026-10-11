"use client";

import Image from "next/image";
import { useState } from "react";
import type { FormEvent } from "react";
import type { PlantSearchResult } from "@/lib/gemini";

type SearchResult = PlantSearchResult & { photoUrl: string | null; photoPageUrl: string | null };

export function TextPlantSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/search-plant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível pesquisar.");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao pesquisar a planta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex: jiboia, ou uma descrição da planta..."
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="shrink-0 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
        >
          {loading ? "Buscando..." : "Pesquisar"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {result && (
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          {result.photoUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <Image
                src={result.photoUrl}
                alt={result.commonName}
                fill
                sizes="(min-width: 768px) 32rem, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{result.commonName}</h3>
            <p className="text-sm italic text-neutral-500 dark:text-neutral-400">{result.scientificName}</p>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{result.description}</p>
          {result.photoUrl && result.photoPageUrl ? (
            <a
              href={result.photoPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:underline dark:text-neutral-500"
            >
              Foto: Wikipedia
            </a>
          ) : (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Nenhuma foto de referência encontrada pra essa planta.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
