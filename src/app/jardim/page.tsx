import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { DeleteGardenPhotoButton } from "@/components/DeleteGardenPhotoButton";
import { GardenPhotoForm } from "@/components/GardenPhotoForm";
import { PageHeader } from "@/components/PageHeader";
import type { GardenPhoto } from "@/types/plant";

export default async function GardenPage() {
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("garden_photos")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<GardenPhoto[]>();

  return (
    <div className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
      <PageHeader backHref="/" title="Fotos do jardim" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          Fotos gerais do jardim, sem identificação nem IA — só pra guardar como está evoluindo.
        </p>

        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <GardenPhotoForm />
        </div>

        {!photos || photos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-neutral-600 dark:text-neutral-400">Nenhuma foto do jardim ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((photo) => {
              const { data } = supabase.storage.from("garden-photos").getPublicUrl(photo.photo_path);
              const date = new Date(photo.created_at).toLocaleDateString("pt-BR");
              return (
                <div
                  key={photo.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={data.publicUrl}
                      alt={photo.caption ?? "Foto do jardim"}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute right-2 top-2">
                      <DeleteGardenPhotoButton photoId={photo.id} photoPath={photo.photo_path} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5 p-2">
                    {photo.caption && (
                      <p className="line-clamp-2 text-sm text-neutral-700 dark:text-neutral-300">
                        {photo.caption}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">{date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
