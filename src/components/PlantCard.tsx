import Image from "next/image";
import Link from "next/link";
import type { Plant } from "@/types/plant";

export function PlantCard({ plant, photoUrl }: { plant: Plant; photoUrl: string }) {
  const purchaseDate = new Date(`${plant.purchase_date}T00:00:00`).toLocaleDateString("pt-BR");

  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:border-neutral-700"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={photoUrl}
          alt={plant.name}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="line-clamp-1 font-medium text-neutral-900 dark:text-neutral-100">{plant.name}</h2>
        {plant.scientific_name && (
          <p className="line-clamp-1 text-xs italic text-neutral-500 dark:text-neutral-400">
            {plant.scientific_name}
          </p>
        )}
        <p className="mt-auto text-xs text-neutral-500 dark:text-neutral-400">Comprada em {purchaseDate}</p>
      </div>
    </Link>
  );
}
