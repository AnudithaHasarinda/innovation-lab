import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-24" role="status" aria-label="Loading">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-16 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <div className="grid gap-5 pt-8 sm:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <span className="sr-only">Loading content</span>
    </div>
  );
}
