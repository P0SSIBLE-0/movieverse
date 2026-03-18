"use client";

import MediaDetailsErrorState from "@/components/details/MediaDetailsErrorState";

type MediaDetailsRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: MediaDetailsRouteErrorProps) {
  return (
    <MediaDetailsErrorState
      title="Something went wrong"
      description={
        error.message || "An unexpected error occurred while loading this page."
      }
      onRetry={reset}
    />
  );
}
