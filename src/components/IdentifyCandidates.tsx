import type { IdentificationCandidate } from "@/types/plant";

export function IdentifyCandidates({
  candidates,
  selectedScientificName,
  onSelect,
}: {
  candidates: IdentificationCandidate[];
  selectedScientificName: string;
  onSelect: (candidate: IdentificationCandidate) => void;
}) {
  if (candidates.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 flex flex-col gap-2">
      {candidates.map((candidate) => (
        <li key={candidate.scientificName}>
          <button
            type="button"
            onClick={() => onSelect(candidate)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
              selectedScientificName === candidate.scientificName
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
  );
}
