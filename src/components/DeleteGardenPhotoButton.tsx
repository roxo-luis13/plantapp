"use client";

import { deleteGardenPhoto } from "@/app/jardim/actions";

export function DeleteGardenPhotoButton({ photoId, photoPath }: { photoId: string; photoPath: string }) {
  return (
    <form
      action={deleteGardenPhoto.bind(null, photoId, photoPath)}
      onSubmit={(event) => {
        if (!window.confirm("Remover esta foto do jardim?")) {
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
