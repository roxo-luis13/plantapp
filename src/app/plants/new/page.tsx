import { NewPlantForm } from "@/components/NewPlantForm";
import { PageHeader } from "@/components/PageHeader";

export default function NewPlantPage() {
  return (
    <div className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
      <PageHeader backHref="/" title="Nova planta" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">
        <NewPlantForm />
      </main>
    </div>
  );
}
