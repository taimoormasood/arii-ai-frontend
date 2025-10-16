"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <Sidebar className="border-[#E6D6FF] bg-white">
      <SidebarHeader className="p-4">
        <div className="hidden md:flex md:items-center md:gap-2">
          {/* Avatar skeleton */}
          <Skeleton className="h-8 w-8 rounded-full" />
          {/* Title skeleton */}
          <Skeleton className="h-6 w-16" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarMenu>
          {/* Generate 5-7 navigation item skeletons */}
          {Array.from({ length: 6 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <div className="flex items-center justify-between gap-3 px-3 py-2 mx-1 my-1">
                <div className="flex items-center gap-x-3 flex-1">
                  {/* Icon skeleton */}
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  {/* Label skeleton with varying widths */}
                  <Skeleton
                    className={`h-4 ${
                      index % 3 === 0
                        ? "w-20"
                        : index % 3 === 1
                          ? "w-24"
                          : "w-16"
                    }`}
                  />
                </div>
                {/* Occasional lock icon skeleton */}
                {(index === 3 || index === 4) && (
                  <Skeleton className="h-4 w-4 rounded-sm" />
                )}
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      {/* Bottom logo skeleton */}
      <div className="mt-auto p-4">
        <Skeleton className="h-14 w-14 rounded-lg" />
      </div>
    </Sidebar>
  );
}

export default SidebarSkeleton;
