type MediaDetailsErrorStateProps = {
  description: string;
  onRetry?: () => void;
  title?: string;
};

export default function MediaDetailsErrorState({
  description,
  onRetry,
  title = "We couldn't load this title",
}: MediaDetailsErrorStateProps) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-10 text-[#e5e5e5]">
      <div className="w-full max-w-lg rounded-xl border border-red-500/15 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/35">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-lg font-semibold text-red-300">
          !
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
}
