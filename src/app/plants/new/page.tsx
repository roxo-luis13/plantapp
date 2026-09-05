import Link from "next/link";
import { NewPlantForm } from "@/components/NewPlantForm";

export default function NewPlantPage() {
  return (
    <div className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          ← Voltar
        </Link>
        <h1 className="text-lg font-semibold text-green-900 dark:text-green-400">Nova planta</h1>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">
        <NewPlantForm />
      </main>
    </div>
  );
}
