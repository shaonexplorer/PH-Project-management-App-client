import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 animate-pulse">
      {/* Title & Actions Row */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Member Info */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-end">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center pt-4 border-t border-border/50">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}