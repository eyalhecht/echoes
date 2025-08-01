import { Skeleton } from "@/components/ui/skeleton"

export function SuggestedUsersSkeleton() {
    const renderUserSkeleton = (index) => (
        <div key={`user-skeleton-${index}`} className="flex items-center justify-between py-2">
            {/* User Info */}
            <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>

            {/* Follow Button */}
            <Skeleton className="h-8 w-16 rounded" />
        </div>
    )

    return (
        <div className="fixed top-[68px] right-5 w-[280px] max-h-[500px] rounded-xl p-4 bg-card border shadow-lg overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-5 w-32" />
            </div>

            {/* User List Skeletons */}
            <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, index) => renderUserSkeleton(index))}
            </div>
        </div>
    )
}