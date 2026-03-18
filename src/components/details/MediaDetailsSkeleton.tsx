import DetailSkeletonBlock from "@/components/details/DetailSkeletonBlock";

export default function MediaDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] pb-16 md:pb-8">
      <header className="relative mx-auto flex w-full max-w-[1400px] items-center px-4 py-5 md:px-8">
        <DetailSkeletonBlock className="h-6 w-20 rounded-full" />
      </header>

      <div className="mx-auto max-w-[1400px] px-2 md:px-8">
        <div className="mb-8 overflow-hidden rounded-xl border border-white/6 bg-white/[0.03]">
          {/* <DetailSkeletonBlock className="aspect-[16/7] w-full rounded-none" /> */}

          <div className="px-4 py-5 md:px-6 md:py-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <DetailSkeletonBlock className="h-56 w-40" />

              <div className="flex-1 w-full max-w-4xl flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
                <DetailSkeletonBlock className="h-10 w-3/4 rounded-xl" />
                <DetailSkeletonBlock className="h-5 w-1/3 rounded-lg bg-white/5" />

                <div className="flex flex-wrap justify-center md:justify-start gap-2 w-full">
                  <DetailSkeletonBlock className="h-8 w-20 rounded-full bg-white/5" />
                  <DetailSkeletonBlock className="h-8 w-24 rounded-full bg-white/5" />
                  <DetailSkeletonBlock className="h-8 w-16 rounded-full bg-white/5" />
                </div>

                <div className="space-y-2 w-full max-w-3xl">
                  <DetailSkeletonBlock className="h-4 w-full rounded bg-white/5" />
                  <DetailSkeletonBlock className="h-4 w-[92%] rounded bg-white/5 md:mx-0 mx-auto" />
                  <DetailSkeletonBlock className="h-4 w-[84%] rounded bg-white/5 md:mx-0 mx-auto" />
                  <DetailSkeletonBlock className="h-4 w-[56%] rounded bg-white/5 md:mx-0 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <DetailSkeletonBlock className="aspect-video w-full rounded-3xl bg-white/5" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {[...Array(5)].map((_, index) => (
              <DetailSkeletonBlock
                key={index}
                className="aspect-[2/3] rounded-2xl bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
