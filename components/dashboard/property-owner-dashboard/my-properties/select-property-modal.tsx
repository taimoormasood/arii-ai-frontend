import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  ApartmentBuildingIcon,
  MultiFamilyIcon,
  SeniorLivingIcon,
  SingleFamilyHomeIcon,
  StudentHouseIcon,
  UniversityHousingIcon,
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { usePropertyStore } from "@/lib/stores/use-property-store";

import { PropertyType } from "./config/property-steps";

type PropertyTypeData = {
  label: string;
  slug: string;
  icon: (props: { active: boolean }) => React.JSX.Element;
};

type SelectPropertyTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SelectPropertyTypeModal = ({
  isOpen,
  onClose,
}: SelectPropertyTypeModalProps) => {
  const [selectedType, setSelectedType] = useState<string>("");

  const route = useRouter();

  const { setSelectedPropertyType, resetStore } = usePropertyStore();

  const handleStepClick = () => {
    resetStore;
    if (selectedType?.length > 0) {
      resetStore();
      setSelectedPropertyType(selectedType as PropertyType);
      route.push(`/my-properties/add-property/${selectedType}`);
    }
  };

  const propertyTypes: PropertyTypeData[] = [
    {
      label: "Single Family Home",
      slug: "single_family_home",
      icon: ({ active }) => <SingleFamilyHomeIcon active={active} />,
    },
    {
      label: "Multi-Family",
      slug: "multi_family",
      icon: ({ active }) => <MultiFamilyIcon active={active} />,
    },
    {
      label: "Student Housing",
      slug: "student_housing",
      icon: ({ active }) => <StudentHouseIcon active={active} />,
    },
    {
      label: "Apartment Building",
      slug: "apartment_unit",
      icon: ({ active }) => <ApartmentBuildingIcon active={active} />,
    },
    {
      label: "Senior Living",
      slug: "senior_living",
      icon: ({ active }) => <SeniorLivingIcon active={active} />,
    },
    {
      label: "University Housing",
      slug: "university_housing",
      icon: ({ active }) => <UniversityHousingIcon active={active} />,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className="bg-primary-600 hover:bg-primary-700 text-white mt-4">
          <Plus size={18} className="mr-2" /> Add New Property
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl w-full max-w-[706px]">
        <h2 className="text-xl font-semibold text-center mb-6">
          Select Property Type to Continue
        </h2>

        {/* First row - 3 items */}
        <div className="grid md:grid-cols-3 grid-cols-2 gap-4 justify-center">
          {propertyTypes.map((type) => {
            const isActive = selectedType === type.slug;

            return (
              <button
                key={type.slug}
                onClick={() => setSelectedType(type.slug)}
                className={` w-full border rounded-xl cursor-pointer px-4 py-6 text-sm font-medium flex flex-col items-center space-y-2 transition-all duration-150 ${
                  isActive
                    ? "bg-white text-primary-600 border-primary-500"
                    : "text-muted-foreground border-gray-200"
                }`}
              >
                {type.icon({ active: selectedType === type.slug })}

                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleStepClick}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPropertyTypeModal;
