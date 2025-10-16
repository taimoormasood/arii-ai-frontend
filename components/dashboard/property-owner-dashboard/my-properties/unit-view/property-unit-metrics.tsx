"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  AvgLeaseTermIcon,
  AvgTenantIcon,
  OccupancyRateIcon,
  RentalIncomeIcon,
} from "@/assets/icons";
import CustomInput from "@/components/ui/custom-input";
import { useGetPropertyMetrics } from "@/hooks/api/use-properties";

import { UnitPropertyType } from "../config/unit-steps";

const propertyMetricsSchema = z.object({
  timeRange: z.enum(["last_30_days", "last_12_months"]),
});

type PropertyMetricsFormValues = z.infer<typeof propertyMetricsSchema>;

interface isUnitInterface {
  isUnit?: boolean;
}

export default function PropertyUnitMetrics(isUnit: isUnitInterface) {
  const [timeRange, setTimeRange] = useState<"last_30_days" | "last_12_months">(
    "last_30_days"
  );

  const searchParams = useSearchParams();
  const params = useParams();

  const PropertyId = Number(
    isUnit
      ? useMemo(() => searchParams.get("propertyId"), [searchParams])
      : Number(params.id)
  );

  const { data, isLoading, error } = useGetPropertyMetrics(PropertyId);

  const methods = useForm<PropertyMetricsFormValues>({
    resolver: zodResolver(propertyMetricsSchema),
    defaultValues: {
      timeRange: "last_30_days",
    },
  });

  const onSubmit = (formData: PropertyMetricsFormValues) => {
    setTimeRange(formData.timeRange);
  };

  const timeRangeOptions = [
    { value: "last_30_days", label: "Last 30 Days" },
    { value: "last_12_months", label: "Last 12 Months" },
  ];

  const getSafeValue = (value: string | undefined, suffix = "") =>
    value && value !== "-" ? `${value}${suffix}` : 0;

  const rentalIncome = getSafeValue(
    data?.data?.rental_income,
    timeRange === "last_30_days" ? "/Month" : "/Year"
  );
  const occupancyRate = getSafeValue(data?.data?.occupancy_rate, "%");
  const avgLeaseTerm = getSafeValue(data?.data?.avg_lease_term, " Months");
  const avgTenantRating = getSafeValue(data?.data?.avg_tenant_rating, "/5");

  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading property metrics...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center py-10 text-red-500">Failed to load metrics.</p>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onChange={methods.handleSubmit(onSubmit)}
        className="py-6 bg-gray-50"
      >
        <div className="w-full  mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="md:text-xl text-lg font-bold text-gray-900">
              {isUnit.isUnit ? "Room Metrics" : "Unit Metrics"}
            </h1>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Rental Income */}
            <div className="bg-white rounded-xl lg:p-6 p-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4 w-full">
                <div className="p-3 rounded-lg bg-gradient-to-r from-primary-200 to-primary-100 border border-primary-500 w-12">
                  <RentalIncomeIcon />
                </div>
                <CustomInput
                  name="timeRange"
                  select
                  options={timeRangeOptions}
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  Rental Income
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    ${rentalIncome}
                  </span>
                </div>
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-white rounded-xl lg:p-6 p-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-4 p-3 rounded-lg bg-gradient-to-r from-primary-200 to-primary-100 border border-primary-500 w-12">
                <OccupancyRateIcon />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  Occupancy Rate
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {occupancyRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Average Lease Term */}
            <div className="bg-white rounded-xl lg:p-6 p-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-4 p-3 rounded-lg bg-gradient-to-r from-primary-200 to-primary-100 border border-primary-500 w-12">
                <AvgLeaseTermIcon />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  Avg. Lease Term
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {avgLeaseTerm}
                  </span>
                </div>
              </div>
            </div>

            {/* Average Tenant Rating */}
            <div className="bg-white rounded-xl lg:p-6 p-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-4 p-3 rounded-lg bg-gradient-to-r from-primary-200 to-primary-100 border border-primary-500 w-12">
                <AvgTenantIcon />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  Avg. Tenant Rating
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {avgTenantRating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
