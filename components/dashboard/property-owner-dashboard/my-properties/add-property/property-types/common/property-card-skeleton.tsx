export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-3 flex flex-col relative">
      {/* Header Image Skeleton */}
      <div className="relative w-full h-44 overflow-hidden">
        <div className="rounded-xl rounded-b-none w-full h-full bg-gray-200 animate-pulse" />
      </div>

      <div className="flex-1 flex flex-col gap-1 px-1 pt-3 pb-2">
        {/* Property Name and Dropdown Skeleton */}
        <div className="flex items-center justify-between mb-1">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Address Skeleton */}
        <div className="flex text-gray-500 text-xs mb-1 gap-1">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-40" />
        </div>

        {/* Number of Units/Status Skeleton */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
          <div className="h-5 bg-gray-200 rounded-full animate-pulse w-12" />
        </div>

        {/* Property Type Skeleton */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
          </div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
        </div>

        {/* Price and Action Skeleton */}
        <div className="flex items-center justify-between mt-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        </div>
      </div>
    </div>
  );
}
