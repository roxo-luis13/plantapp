import { PageHeader } from "@/components/PageHeader";
import { QuickIdentify } from "@/components/QuickIdentify";
import { TextPlantSearch } from "@/components/TextPlantSearch";

export default function IdentifyPage() {
  return (
    <div className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
      <PageHeader backHref="/" title="Que planta é essa?" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">
        <QuickIdentify />

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          <span className="text-xs text-neutral-400 dark:text-neutral-500">ou pesquise só com palavras</span>
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <TextPlantSearch />
      </main>
    </div>
  );
}
