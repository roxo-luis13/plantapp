"use client";

import { deleteGrowthPhoto } from "@/app/actions";

export function DeleteGrowthPhotoButton({
  plantId,
  photoId,
  photoPath,
}: {
  plantId: string;
  photoId: string;
  photoPath: string;
}) {
  return (
    <form
      action={deleteGrowthPhoto.bind(null, plantId, photoId, photoPath)}
      onSubmit={(event) => {
        if (!window.confirm("Remover esta foto de crescimento?")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/80"
      >
        Remover
      </button>
    </form>
  );
}
