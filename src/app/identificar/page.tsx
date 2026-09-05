import { PageHeader } from "@/components/PageHeader";
import { QuickIdentify } from "@/components/QuickIdentify";

export default function IdentifyPage() {
  return (
    <div className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
      <PageHeader backHref="/" title="Que planta é essa?" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">
        <QuickIdentify />
      </main>
    </div>
  );
}
