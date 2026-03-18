import Link from "next/link";

export default function OfflinePage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 text-center text-white shadow-2xl shadow-black/40">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-yellow text-2xl font-black text-black">
          MV
        </div>
        <h1 className="text-3xl font-bold tracking-tight">You&apos;re offline</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          MovieVerse can still show pages and assets you&apos;ve already visited.
          Reconnect to refresh the latest movies, shows, and cast details.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Go Home
          </Link>
          <Link
            href="/watchlist"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
          >
            Open Watchlist
          </Link>
        </div>
      </div>
    </section>
  );
}
