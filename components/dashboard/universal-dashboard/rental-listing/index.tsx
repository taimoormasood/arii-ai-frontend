"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { useGetPopularProperties } from "@/hooks/api/use-properties";

import PopularPropertyCard from "../popular-property-card";
import ApplyRentModal from "./apply-rent-modal";

const RentalListing: React.FC = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const isApplying = searchParams.get("action") === "apply";

  const { data } = useGetPopularProperties();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Top Popular Properties</h2>
        <Button
          onClick={() => router.push("/universal-dashboard/rental-listing")}
          variant="outline"
          className="text-primary-600 hover:text-primary-600"
        >
          Explore All Properties
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.map((property: any) => (
          <PopularPropertyCard key={property.id} propertyData={property} />
        ))}
      </div>
      {isApplying && (
        <ApplyRentModal
          open={isApplying}
          onOpenChange={() => router.push("/universal-dashboard/rental-listing")}
        />
      )}
    </div>
  );
};

export default RentalListing;
