"use client";

import { useState } from "react";

const SUGGESTED_QUESTIONS = [
  "De onde essa planta é originária?",
  "Para que ela serve? Tem algum benefício ou uso conhecido?",
  "Ela é comestível ou tem uso medicinal?",
  "É tóxica para cães, gatos ou crianças?",
  "Como ela se reproduz ou pode ser propagada?",
  "Quanto tempo em média ela vive?",
  "Ela floresce? Em que época do ano?",
  "Essa planta na foto parece saudável?",
  "Tem algum sinal de doença ou praga visível na foto?",
];

type QA = { question: string; answer: string };

export function AskPlantAI({
  name,
  scientificName,
  photoUrl,
}: {
  name: string;
  scientificName: string | null;
  photoUrl: string;
}) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<QA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(rawQuestion: string) {
    const trimmed = rawQuestion.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, scientificName, question: trimmed, photoUrl }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível responder agora.");
      }
      setHistory((prev) => [{ question: trimmed, answer: data.answer }, ...prev]);
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao perguntar sobre a planta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        A IA também enxerga a foto que você cadastrou, então pode perguntar sobre o que aparece nela.
      </p>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((suggested) => (
          <button
            key={suggested}
            type="button"
            onClick={() => ask(suggested)}
            disabled={loading}
            className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {suggested}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(question);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Pergunte qualquer coisa sobre essa planta..."
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="shrink-0 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
        >
          {loading ? "Pensando..." : "Perguntar"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {history.length > 0 && (
        <div className="flex flex-col gap-3">
          {history.map((qa, index) => (
            <div
              key={index}
              className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{qa.question}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-600 dark:text-neutral-400">
                {qa.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
