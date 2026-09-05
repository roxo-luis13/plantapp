import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PlantCard } from "@/components/PlantCard";
import type { Plant } from "@/types/plant";

export default async function Home() {
  const supabase = await createClient();

  const { data: plants } = await supabase
    .from("plants")
    .select("*")
    .order("purchase_date", { ascending: false })
    .returns<Plant[]>();

  return (
    <div className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <h1 className="text-lg font-semibold text-green-900 dark:text-green-400">🌱 Meu Jardim</h1>
        <Link
          href="/plants/new"
          className="rounded-lg bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
        >
          + Nova planta
        </Link>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-8">
        {!plants || plants.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-neutral-600 dark:text-neutral-400">Seu catálogo ainda está vazio.</p>
            <Link
              href="/plants/new"
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
            >
              Cadastrar a primeira planta
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {plants.map((plant) => {
              const { data } = supabase.storage.from("plant-photos").getPublicUrl(plant.photo_path);
              return <PlantCard key={plant.id} plant={plant} photoUrl={data.publicUrl} />;
            })}
          </div>
        )}
      </main>
    </div>
  );
}
