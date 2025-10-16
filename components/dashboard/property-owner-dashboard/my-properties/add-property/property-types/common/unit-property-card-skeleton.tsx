import { Card, CardContent } from "@/components/ui/card";

export default function UnitPropertyCardSkeleton() {
  return (
    <div className="w-full mx-auto">
      <Card className="overflow-hidden bg-white shadow-lg border border-gray-200 rounded-2xl p-3.5">
        {/* Header Image Skeleton */}
        <div className="relative">
          <div className="rounded-xl rounded-b-none w-full h-36 xl:h-44 bg-gray-200 animate-pulse mb-0" />
        </div>

        <CardContent className="p-0 py-4 space-y-4">
          {/* Unit Title and Type Skeleton */}
          <div className="space-y-1">
            <div className="w-full flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
              {/* More menu skeleton */}
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          </div>

          {/* Tenant and Status Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              </div>
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
            </div>
          </div>

          {/* Price and Action Skeleton */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
