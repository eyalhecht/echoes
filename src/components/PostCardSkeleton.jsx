import { Skeleton } from "@/components/ui/skeleton"

export function PostCardSkeleton() {
    return (
        <div className="bg-card rounded-lg border p-4 space-y-4 max-w-[500px]">
            {/* Header with avatar and user info */}
            <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>


            {/* Image placeholder */}
            <Skeleton className="h-64 w-full rounded-md" />

            {/* Post content */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-4 pt-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
            </div>
        </div>
    )
}