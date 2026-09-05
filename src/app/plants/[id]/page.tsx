import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AskPlantAI } from "@/components/AskPlantAI";
import { CareInfoView } from "@/components/CareInfoView";
import { DeletePlantButton } from "@/components/DeletePlantButton";
import { EditablePlantName } from "@/components/EditablePlantName";
import { RefreshCareInfoButton } from "@/components/RefreshCareInfoButton";
import type { Plant } from "@/types/plant";

export default async function PlantDetailPage({ params }: PageProps<"/plants/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: plant } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .maybeSingle<Plant>();

  if (!plant) {
    notFound();
  }

  const { data: photo } = supabase.storage.from("plant-photos").getPublicUrl(plant.photo_path);
  const purchaseDate = new Date(`${plant.purchase_date}T00:00:00`).toLocaleDateString("pt-BR");

  return (
    <div className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          ← Voltar
        </Link>
        <DeletePlantButton plantId={plant.id} photoPath={plant.photo_path} />
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <Image src={photo.publicUrl} alt={plant.name} fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
        </div>

        <EditablePlantName
          plantId={plant.id}
          name={plant.name}
          scientificName={plant.scientific_name}
        />
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Comprada em {purchaseDate}</p>
        {plant.identification_confidence != null && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Identificada por IA com {Math.round(plant.identification_confidence * 100)}% de confiança
          </p>
        )}
        {plant.notes && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
            {plant.notes}
          </p>
        )}

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-400">Cuidados</h2>
            <RefreshCareInfoButton
              plantId={plant.id}
              name={plant.name}
              scientificName={plant.scientific_name}
            />
          </div>
          {plant.care_info ? (
            <CareInfoView careInfo={plant.care_info} />
          ) : (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Ainda não há dicas de cuidado geradas. Clique no botão acima para buscar com IA.
            </p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-green-900 dark:text-green-400">
            Pergunte à IA
          </h2>
          <AskPlantAI name={plant.name} scientificName={plant.scientific_name} />
        </section>
      </main>
    </div>
  );
}
