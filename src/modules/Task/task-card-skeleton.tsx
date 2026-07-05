import { Skeleton } from "@/components/ui/skeleton";

export function TaskCardSkeleton() {
  return (
    <div className="bg-card flex flex-col h-full p-4 shadow-lg rounded-xl border border-border/50 animate-pulse">
      {/* Header Section with Status Badge */}
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </div>

      {/* Description */}
      <Skeleton className="h-3 w-full mb-4 rounded-md" />
      <Skeleton className="h-3 w-5/6 mb-4 rounded-md" />

      {/* Meta Information Row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>

      {/* Assignee & Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-auto">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-2.5 w-16 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}