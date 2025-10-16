"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { BathIcon, BedIcon, PropertySizeIcon } from "@/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatText } from "@/helpers";
import { ListingPhoto } from "@/services/properties/types";

export default function PropertyUnitListing({ data }: any) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogImageIndex, setDialogImageIndex] = useState(0);

  const params = useParams();
  const searchParams = useSearchParams();
  const propertyType = useMemo(
    () => searchParams.get("propertyType"),
    [searchParams]
  );

  const unitId = useMemo(() => Number(params?.id), [params]);
  const propertyListingData = data?.data;
  const unit = data?.data?.units?.find(
    (unit: any) => unit?.detail?.id === unitId
  );

  const propertyImages = unit?.detail?.photos || [];
  const thumbnailImages = propertyImages?.slice(0, 4);

  // Navigation handlers
  const navigateImage = (direction: "next" | "prev", isDialog = false) => {
    const setter = isDialog ? setDialogImageIndex : setCurrentImageIndex;
    const currentIndex = isDialog ? dialogImageIndex : currentImageIndex;

    setter((prev) =>
      direction === "next"
        ? (prev + 1) % propertyImages?.length
        : (prev - 1 + propertyImages?.length) % propertyImages?.length
    );
  };

  const nextImage = () => navigateImage("next");
  const prevImage = () => navigateImage("prev");
  const nextDialogImage = () => navigateImage("next", true);
  const prevDialogImage = () => navigateImage("prev", true);

  const openImageDialog = (index: number) => {
    setDialogImageIndex(index);
    setIsDialogOpen(true);
  };

  // Description component with read more/less functionality
  const Description = ({ text }: { text: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text?.length > 200;

    if (!shouldTruncate) return <>{text}</>;

    return (
      <>
        {isExpanded ? text : `${text?.substring(0, 200)}...`}
        <span
          className="text-primary-500 cursor-pointer font-normal ml-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Read More"}
        </span>
      </>
    );
  };

  // Property features component
  const PropertyFeatures = () => {
    if (
      ![
        "senior_living",
        "student_housing",
        "single_family_home",
        "multi_family",
        "apartment_unit",
      ].includes(propertyType || "")
    ) {
      return null;
    }

    const isSingleFamily = propertyType === "single_family_home";
    const bedrooms = unit?.detail?.bedrooms || 0;
    const bathrooms = unit?.detail?.bathrooms || 0;
    const squareFootage = unit?.detail?.size || 0;

    return (
      <div className="grid grid-cols-3 gap-6">
        <div className="relative flex items-center gap-3">
          <BedIcon className="shrink-0" />
          <div>
            <div className="text-sm text-gray-600">Bedroom</div>
            <div className="font-semibold md:text-lg text-sm text-gray-700">
              {bedrooms}
            </div>
          </div>
          <div className="absolute -right-3 top-0 bottom-0 w-px bg-gray-200"></div>
        </div>
        <div className="flex items-center gap-3">
          <BathIcon className="shrink-0" />
          <div>
            <div className="text-sm text-gray-600">Bathroom</div>
            <div className="font-semibold md:text-lg text-sm text-gray-700">
              {bathrooms}
            </div>
          </div>
        </div>
        <div className="relative flex items-center gap-3">
          <div className="absolute -left-3 top-0 bottom-0 w-px bg-gray-200"></div>
          <PropertySizeIcon className="shrink-0" />
          <div>
            <div className="text-sm text-gray-600">
              {isSingleFamily ? "Property Size" : "Unit Size"}
            </div>
            <div className="font-semibold md:text-lg text-sm text-gray-700">
              {squareFootage} sqft
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Property details grid component
  const PropertyDetailsGrid = () => {
    if (!propertyListingData) return null;

    const commonDetails = (
      <>
        <div>
          <div className="text-sm text-gray-600 mb-1">Property Type</div>
          <div className="font-semibold text-gray-700">
            {formatText(propertyListingData?.detail?.property_type)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Rental Type</div>
          <div className="font-semibold text-gray-700">
            {formatText(unit?.rental_details?.rental_type)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Date Listed</div>
          <div className="font-semibold text-gray-700">
            {format(
              propertyListingData?.detail?.published_at as unknown as Date,
              "MM/dd/yyyy"
            )}
          </div>
        </div>
      </>
    );

    switch (propertyType) {
      case "senior_living":
      case "multi_family":
      case "apartment_unit":
        return (
          <>
            <div className="grid grid-cols-3 gap-6 ">
              <div>
                <div className="text-sm text-gray-600 mb-1">Unit Type</div>
                <div className="font-semibold text-gray-700">
                  {formatText(unit?.detail?.type)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Floor Number</div>
                <div className="font-semibold text-gray-700">
                  {unit?.detail?.floor_number || "1"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Rental Type</div>
                <div className="font-semibold text-gray-700">
                  {formatText(unit?.rental_details?.rental_type)}
                </div>
              </div>
            </div>
            <div>
              {unit?.rental_details?.promote_special_offer && (
                <div className="rounded-lg p-4 bg-yellow-50 border border-yellow-200">
                  <div className="text-sm text-gray-600 mb-1">
                    Special Offer
                  </div>
                  <div className="font-normal">
                    Save{" "}
                    {Math.round(unit?.rental_details?.offer_percentage || 0)}%
                    if leased before{" "}
                    {format(
                      unit?.rental_details?.offer_end_date as unknown as Date,
                      "MM/dd/yyyy"
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        );

      case "student_housing":
        return (
          <div className="grid grid-cols-12 gap-6 py-6">
            <div className="col-span-4">
              <div className="text-sm text-gray-600 mb-1">Unit Type</div>
              <div className="font-semibold text-gray-700">
                {formatText(unit?.detail?.type)}
              </div>
            </div>
            <div className="col-span-4">
              <div className="text-sm text-gray-600 mb-1">Number of Floor</div>
              <div className="font-semibold text-gray-700">
                {unit?.detail?.floor_number || 0}
              </div>
            </div>
            <div className="col-span-4">
              <div className="text-sm text-gray-600 mb-1">Rental Type</div>
              <div className="font-semibold text-gray-700">
                {formatText(unit?.rental_details?.rental_type)}
              </div>
              {unit?.rental_details?.promote_special_offer && (
                <div className="rounded-lg p-4 bg-yellow-50 border border-yellow-200">
                  <div className="text-sm text-gray-600 mb-1">
                    Special Offer
                  </div>
                  <div className="font-normal">
                    Save {unit?.rental_details?.offer_percentage}% if leased
                    before {unit?.rental_details?.offer_end_date}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "single_family_home":
        return (
          <div className="grid grid-cols-3 gap-6 py-6">
            {commonDetails}
            {unit?.rental_details?.promote_special_offer && (
              <div className="rounded-lg p-4 bg-yellow-50 border border-yellow-200">
                <div className="text-sm text-gray-600 mb-1">Special Offer</div>
                <div className="font-normal">
                  Save {unit?.rental_details?.offer_percentage}% if leased
                  before {unit?.rental_details?.offer_end_date}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Property header component
  const PropertyHeader = () => {
    if (!propertyListingData) return null;

    return (
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="lg:text-3xl text-base  font-bold">
              {unit?.detail?.number}
            </h1>
            <Badge variant="secondary" className="bg-primary-200 text-primary-800">
              {/* {propertyListingData?.detail?.status} */}
              {unit?.detail?.status}
            </Badge>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-1 text-primary-500 shrink-0" />
            <span className="lg:text-sm text-xs">
              {propertyListingData?.detail?.street_address},{" "}
              {propertyListingData?.detail?.city},{" "}
              {propertyListingData?.detail?.state}{" "}
              {propertyListingData?.detail?.zip_code}
            </span>
          </div>
        </div>
        {unit?.rental_details?.rent && (
          <div className="lg:text-xl text-md font-bold">
            ${unit?.rental_details?.rent}{" "}
            <span className="font-normal text-sm">
              {unit?.rental_details?.rental_type === "short_term"
                ? "/ Day"
                : unit?.rental_details?.rental_type === "semester_billing"
                  ? "/ Semester"
                  : "/ Month"}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Main image carousel component
  const MainImageCarousel = () => {
    if (propertyImages?.length === 0) return null;

    return (
      <div className="relative group w-full h-full">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={propertyImages[currentImageIndex]?.photo || "/placeholder.svg"}
            alt={`Property image ${currentImageIndex + 1}`}
            fill
            className="object-cover cursor-pointer transition-transform rounded-xl"
            onClick={() => openImageDialog(currentImageIndex)}
          />
        </div>

        {propertyImages?.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} of {propertyImages?.length}
        </div>
      </div>
    );
  };

  // Thumbnail grid component
  const ThumbnailGrid = () => {
    if (propertyImages?.length === 0) return null;

    return (
      <div className="space-y-2">
        {thumbnailImages?.map((image: ListingPhoto, index: number) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group h-24 w-24"
            onClick={() => {
              setCurrentImageIndex(index);
              openImageDialog(index);
            }}
          >
            <Image
              src={image.photo || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-110 h-24 w-24"
            />
            {index === 3 && propertyImages?.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{propertyImages?.length - 4} Images
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Don't render anything if no property data
  if (!propertyListingData) {
    return (
      <div className="w-full mx-auto p-8 text-center">
        <p className="text-gray-500">No property data available</p>
      </div>
    );
  }

  // Don't render image section if no images
  if (propertyImages?.length === 0) {
    return (
      <div className="w-full mx-auto">
        <div className="space-y-6">
          <div className="space-y-6">
            <PropertyHeader />
            <div>
              <h3 className="md:text-sm text-xs font-normal mb-3 text-gray-500">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {propertyListingData?.listing_info?.description && (
                  <Description
                    text={propertyListingData?.listing_info?.description}
                  />
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Image Gallery Section */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-[96px_1fr] gap-4">
            <div className="shrink-0">
              <ThumbnailGrid />
            </div>
            <div className="grow">
              <MainImageCarousel />
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="space-y-6 lg:col-span-7">
          <PropertyHeader />
          <PropertyFeatures />
          <PropertyDetailsGrid />

          {propertyListingData?.rental_details?.promote_special_offer && (
            <div className="rounded-lg p-4 bg-yellow-50 border border-yellow-200">
              <div className="text-sm text-gray-600 mb-1">Special Offer</div>
              <div className="font-normal">
                Save {propertyListingData?.rental_details?.offer_percentage}% if
                leased before{" "}
                {propertyListingData?.rental_details?.offer_end_date}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-normal mb-3 text-gray-500">
              Description
            </h3>
            {propertyListingData?.listing_info?.description ? (
              <div className="text-gray-700 leading-relaxed">
                <Description
                  text={propertyListingData.listing_info.description}
                />
              </div>
            ) : (
              <p className="text-gray-500 italic">No description available</p>
            )}
          </div>
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
          <div className="relative w-full h-[90vh] rounded-2xl">
            <Image
              src={
                propertyImages[dialogImageIndex]?.photo || "/placeholder.svg"
              }
              alt={`Property image ${dialogImageIndex + 1}`}
              fill
              className="object-contain rounded-2xl"
            />

            {propertyImages?.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevDialogImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextDialogImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            <div className="absolute top-4 right-16 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {dialogImageIndex + 1} of {propertyImages?.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
