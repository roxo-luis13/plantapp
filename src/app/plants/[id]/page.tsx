import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CareInfoView } from "@/components/CareInfoView";
import { DeletePlantButton } from "@/components/DeletePlantButton";
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
    <div className="flex flex-1 flex-col bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 sm:px-8">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Voltar
        </Link>
        <DeletePlantButton plantId={plant.id} photoPath={plant.photo_path} />
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
          <Image src={photo.publicUrl} alt={plant.name} fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
        </div>

        <h1 className="text-2xl font-semibold text-neutral-900">{plant.name}</h1>
        {plant.scientific_name && <p className="italic text-neutral-500">{plant.scientific_name}</p>}
        <p className="mt-1 text-sm text-neutral-500">Comprada em {purchaseDate}</p>
        {plant.identification_confidence != null && (
          <p className="text-xs text-neutral-400">
            Identificada por IA com {Math.round(plant.identification_confidence * 100)}% de confiança
          </p>
        )}
        {plant.notes && <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-700">{plant.notes}</p>}

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-900">Cuidados</h2>
            <RefreshCareInfoButton
              plantId={plant.id}
              name={plant.name}
              scientificName={plant.scientific_name}
            />
          </div>
          {plant.care_info ? (
            <CareInfoView careInfo={plant.care_info} />
          ) : (
            <p className="text-sm text-neutral-500">
              Ainda não há dicas de cuidado geradas. Clique no botão acima para buscar com IA.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
