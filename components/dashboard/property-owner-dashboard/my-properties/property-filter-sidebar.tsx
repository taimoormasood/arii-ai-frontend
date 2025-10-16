"use client";

import { format } from "date-fns";
import { Calendar, CalendarIcon, X } from "lucide-react";
import { memo, useEffect, useState } from "react";

import {
  ApartmentBuildingIcon,
  MultiFamilyIcon,
  SeniorLivingIcon,
  SingleFamilyHomeIcon,
  StudentHouseIcon,
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import CitySelect from "@/components/ui/city-select";
import CustomSelect from "@/components/ui/custom-select";
import { DualSlider } from "@/components/ui/dual-slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PropertyFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export interface FilterState {
  status?: "vacant" | "occupied";
  property_type?: string;
  rental_type?: string;
  city?: string;
  availability_date?: string;
  unit_count_min?: number;
  unit_count_max?: number;
}

const statusOptions = [
  { value: "vacant", label: "Vacant" },
  { value: "occupied", label: "Occupied" },
];

const propertyTypeOptions = [
  {
    value: "single_family_home",
    label: "Single Family Home",
    icon: SingleFamilyHomeIcon,
  },
  {
    value: "apartment_unit",
    label: "Apartment Unit",
    icon: ApartmentBuildingIcon,
  },
  {
    value: "multi_family",
    label: "Multi-Family",
    icon: MultiFamilyIcon,
  },
  {
    value: "senior_living",
    label: "Senior Living",
    icon: SeniorLivingIcon,
  },
  {
    value: "student_housing",
    label: "Student Housing",
    icon: StudentHouseIcon,
  },
  {
    value: "university_housing",
    label: "University Housing",
    icon: StudentHouseIcon, // Using same icon for now
  },
];

const rentalTypeOptions = [
  { value: "short_term", label: "Short Term" },
  { value: "long_term", label: "Long Term" },
  { value: "both", label: "Both" },
];

// Custom hook for managing scroll lock
function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      // Store the current scroll position
      const scrollY = window.scrollY;

      // Apply styles to prevent scrolling
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restore scroll position and remove styles
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
}

const PropertyFilterSidebarComponent = memo(function PropertyFilterSidebar({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: PropertyFilterSidebarProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Lock scroll when sidebar is open
  useScrollLock(isOpen);

  // Early return for performance - don't render expensive components when closed
  if (!isOpen) return null;

  const handleStatusChange = (status: "vacant" | "occupied") => {
    const newStatus = filters.status === status ? undefined : status;
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handlePropertyTypeChange = (propertyType: string) => {
    const newPropertyType =
      filters.property_type === propertyType ? undefined : propertyType;
    onFiltersChange({ ...filters, property_type: newPropertyType });
  };

  const handleUnitCountChange = (values: [number, number]) => {
    onFiltersChange({
      ...filters,
      unit_count_min: values[0],
      unit_count_max: values[1],
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={handleBackdropClick}
      />

      {/* Sidebar */}
      <div className="relative text-left w-full max-w-md bg-white h-full overflow-y-auto animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-lg text-gray-900 font-bold">Filters</h2>
          <Button
            variant="ghost"
            className="bg-gray-200 rounded-full w-6 h-6"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Status:</h3>
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.status === option.value ? "default" : "outline"
                  }
                  size="sm"
                  className={cn(
                    "flex-1 font-medium",
                    filters.status === option.value
                      ? "bg-primary-500 text-white border-primary-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() =>
                    handleStatusChange(option.value as "vacant" | "occupied")
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Property Type Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              Property Type:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {propertyTypeOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = filters.property_type === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handlePropertyTypeChange(option.value)}
                    className={cn(
                      "flex flex-col items-center cursor-pointer gap-2 p-3 rounded-lg border-2 transition-all hover:border-primary-300",
                      isSelected
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <IconComponent active={isSelected} />
                    <span className="text-xs font-medium text-center text-gray-700">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rental Type Filter */}
          <div className="space-y-3">
            <CustomSelect
              label="Rental Type"
              value={filters.rental_type || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  rental_type: value || undefined,
                })
              }
              placeholder="Select rental type"
              options={rentalTypeOptions}
            />
          </div>

          {/* City Filter */}
          <div className="space-y-3">
            <CitySelect
              label="City"
              value={filters.city || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  city: value || undefined,
                })
              }
              placeholder="Select city"
              searchPlaceholder="Search cities..."
            />
          </div>

          {/* Availability Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">
              Availability:
            </label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-50 border-gray-300 hover:bg-gray-100",
                    !filters.availability_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {filters.availability_date
                    ? format(new Date(filters.availability_date), "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white border border-gray-200"
                align="start"
              >
                <CalendarComponent
                  mode="single"
                  selected={
                    filters.availability_date
                      ? new Date(filters.availability_date)
                      : undefined
                  }
                  onSelect={(date) => {
                    onFiltersChange({
                      ...filters,
                      availability_date: date
                        ? date.toISOString().split("T")[0]
                        : undefined,
                    });
                    setIsDatePickerOpen(false);
                  }}
                  disabled={(date) => date <= new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Unit Count Filter */}
          <div className="">
            <label className="text-sm font-medium text-gray-900">
              Unit Count:
            </label>
            <div className="px-3 !mt-3">
              <DualSlider
                value={[
                  filters.unit_count_min || 0,
                  filters.unit_count_max || 4,
                ]}
                onValueChange={handleUnitCountChange}
                min={0}
                max={10}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{filters.unit_count_min || 0}</span>
                <span>{filters.unit_count_max || 4}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 font-semibold border-primary-500 shadow text-primary-500 hover:bg-primary-500 hover:text-white"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
          <Button
            className="flex-1 bg-primary-500 hover:bg-primary-700 text-white"
            onClick={onApplyFilters}
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
});

export const PropertyFilterSidebar = PropertyFilterSidebarComponent;
