import { Skeleton } from "@/components/ui/skeleton";

export function TaskCardSkeleton() {
  return (
    <div className="bg-card flex flex-col h-full p-5 shadow-lg rounded-2xl border border-border/50 animate-pulse">
      {/* Header Section with Status Badge */}
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>

      {/* Description */}
      <Skeleton className="h-3 w-full mb-4 rounded-md" />
      <Skeleton className="h-3 w-5/6 mb-4 rounded-md" />

      {/* Progress Section */}
      <div className="mt-4 mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Deadline */}
      <Skeleton className="h-3 w-20 mb-3 rounded-md" />

      {/* Assignee & Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-auto">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-2.5 w-16 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}