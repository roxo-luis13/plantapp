import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  backHref,
  title,
  actions,
}: {
  backHref?: string;
  title?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white/85 px-4 py-3 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/85 sm:px-8">
      <div className="flex min-w-0 items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Voltar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            ←
          </Link>
        )}
        {title && (
          <h1 className="truncate text-lg font-semibold text-green-900 dark:text-green-400">{title}</h1>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
