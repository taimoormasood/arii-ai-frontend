"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { BathIcon, BedIcon, PropertySizeIcon } from "@/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { formatText } from "@/helpers";
import { ListingPhoto, SinglePropertyView } from "@/services/properties/types";

interface PropertyListingProps {
  detail: SinglePropertyView["detail"] | undefined;
  listing_info: SinglePropertyView["listing_info"] | undefined;
  rental_details: SinglePropertyView["rental_details"] | undefined;
}

export default function PropertyListing({
  detail,
  listing_info,
  rental_details,
}: PropertyListingProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogImageIndex, setDialogImageIndex] = useState(0);

  const searchParams = useSearchParams();
  const propertyType = useMemo(
    () => searchParams.get("propertyType"),
    [searchParams]
  );

  const propertyListingData = {
    detail,
    listing_info,
    rental_details,
  };
  const propertyImages = propertyListingData?.listing_info?.photos || [];
  const thumbnailImages = propertyImages.slice(0, 4);

  const navigateImage = (direction: "next" | "prev", isDialog = false) => {
    const setter = isDialog ? setDialogImageIndex : setCurrentImageIndex;

    setter((prev) =>
      direction === "next"
        ? (prev + 1) % propertyImages.length
        : (prev - 1 + propertyImages.length) % propertyImages.length
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

  if (!propertyListingData) {
    return (
      <div className="w-full mx-auto p-8 text-center">
        <p className="text-gray-500">No property data available</p>
      </div>
    );
  }

  const PropertyHeader = () => (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="lg:text-3xl text-base font-bold capitalize">
            {propertyListingData?.detail?.name}
          </h1>
          {propertyType === "single_family_home" && (
            <Badge
              variant="secondary"
              className="bg-primary-100 text-primary-800"
            >
              {propertyListingData?.detail?.status}
            </Badge>
          )}
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
      <div className="text-right">
        {propertyListingData?.rental_details?.rent && (
          <div className="lg:text-xl text-md font-bold">
            ${propertyListingData?.rental_details.rent}{" "}
            <span className="font-normal text-sm">
              {propertyListingData?.rental_details?.rental_type === "short_term"
                ? "/ Day"
                : "/ Month"}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const PropertyFeatures = () => {
    if (!["apartment", "single_family_home"].includes(propertyType || "")) {
      return null;
    }

    const isSingleFamily = propertyType === "single_family_home";
    const bedrooms = propertyListingData?.listing_info?.total_bedrooms || 0;
    const bathrooms = propertyListingData?.listing_info?.total_bathrooms || 0;
    const squareFootage =
      propertyListingData?.listing_info?.square_footage || 0;

    return (
      <div className="grid grid-cols-3 gap-6">
        <div className="relative flex items-center gap-3">
          <BedIcon className="shrink-0" />
          <div>
            <div className="md::text-sm text-xs text-gray-600">Bedroom</div>
            <div className="font-semibold md:text-lg text-sm text-gray-700">
              {bedrooms}
            </div>
          </div>
          <div className="absolute -right-3 top-0 bottom-0 w-px bg-gray-200"></div>
        </div>
        <div className="flex items-center gap-3">
          <BathIcon className="shrink-0" />
          <div>
            <div className="md::text-sm text-xs text-gray-600">Bathroom</div>
            <div className="font-semibold md:text-lg text-sm text-gray-700">
              {bathrooms}
            </div>
          </div>
        </div>
        <div className="relative flex items-center gap-3">
          <div className="absolute -left-3 top-0 bottom-0 w-px bg-gray-200"></div>
          <PropertySizeIcon className="shrink-0" />
          <div>
            <div className="md:text-sm text-xs text-gray-600">
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

  const PropertyDetailsGrid = () => {
    const baseDetails = (
      <>
        <div>
          <div className="md:text-sm text-xs text-gray-600 mb-1">
            Property Type
          </div>
          <div className="font-semibold md:text-lg text-sm text-gray-700">
            {formatText(propertyListingData?.detail?.property_type || "")}
          </div>
        </div>
        {propertyType === "university_housing" && (
          <div>
            <div className="text-sm text-gray-600 mb-1">Number of Rooms</div>
            <div className="font-semibold text-gray-700">
              {propertyListingData?.listing_info?.number_of_units || 0}
            </div>
          </div>
        )}
        {propertyListingData?.detail?.published_at && (
          <div>
            <div className="text-sm text-gray-600 mb-1">Date Listed</div>
            <div className="font-semibold text-gray-700">
              {propertyListingData?.detail?.published_at
                ? format(
                    new Date(propertyListingData.detail.published_at),
                    "MM/dd/yyyy"
                  )
                : "Date Archived"}
            </div>
          </div>
        )}
        {propertyType === "university_housing" && (
          <div>
            <div className="text-sm text-gray-600 mb-1">Occupancy Type</div>
            <div className="font-semibold text-gray-700">
              {formatText(
                propertyListingData?.listing_info?.occupancy_type || ""
              )}
            </div>
          </div>
        )}
        {propertyType === "apartment_unit" ||
          (propertyType === "senior_living" && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Number of Units</div>
              <div className="font-semibold text-gray-700">
                {propertyListingData?.listing_info?.number_of_units || 0}
              </div>
            </div>
          ))}
      </>
    );

    if (
      propertyType === "multi_family" ||
      propertyType === "student_housing" ||
      propertyType === "apartment"
    ) {
      return (
        <div className="grid grid-cols-12 gap-6 py-6">
          <div className="col-span-4">
            <div className="md:text-sm text-xs text-gray-600 mb-1">
              Property Type
            </div>
            <div className="font-semibold md:text-lg text-xs text-gray-700">
              {formatText(propertyListingData?.detail?.property_type || "")}
            </div>
          </div>
          <div className="col-span-4">
            <div className="md:text-sm text-xs text-gray-600 mb-1">
              Number of Units
              <div className="font-semibold md:text-lg text-xs text-gray-700">
                {propertyListingData?.listing_info?.number_of_units || 0}
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="text-sm text-gray-600 mb-1">Date Listed</div>
            <div className="font-semibold text-gray-700">
              {propertyListingData?.detail?.published_at
                ? format(
                    new Date(propertyListingData.detail.published_at),
                    "MM/dd/yyyy"
                  )
                : "Date Archived"}
            </div>
          </div>
        </div>
      );
    }

    {
      propertyListingData?.rental_details?.promote_special_offer && (
        <div className="rounded-lg p-4 bg-yellow-50 border border-yellow-200">
          <div className="text-sm text-gray-600 mb-1">Special Offer</div>
          <div className="font-normal">
            Save{" "}
            {Math.round(
              Number(propertyListingData?.rental_details?.offer_percentage || 0)
            )}
            % if leased before{" "}
            {format(
              propertyListingData?.rental_details
                ?.offer_end_date as unknown as Date,
              "MM/dd/yyyy"
            )}
          </div>
        </div>
      );
    }

    return <div className="grid grid-cols-3 gap-6 py-6">{baseDetails}</div>;
  };

  const ThumbnailGrid = () => (
    <div className="space-y-2">
      {thumbnailImages.map((image: ListingPhoto, index: number) => (
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

  const MainImageCarousel = () => (
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

      {propertyImages.length > 1 && (
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

  const Description = ({ text }: { text: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text.length > 200;

    if (!shouldTruncate) return <>{text}</>;

    return (
      <>
        {isExpanded ? text : `${text.substring(0, 200)}...`}
        <span
          className="text-primary-500 cursor-pointer font-normal ml-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Read More"}
        </span>
      </>
    );
  };

  if (propertyImages?.length === 0) {
    return (
      <div className="w-full mx-auto">
        <div className="space-y-6">
          <div className="space-y-6">
            <PropertyHeader />
            <PropertyDetailsGrid />
            <div>
              <h3 className="md:text-sm text-xs font-normal mb-3 text-gray-500">
                Description
              </h3>
              <Description
                text={propertyListingData?.listing_info?.description || ""}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">
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

        <div className="space-y-6 lg:col-span-7">
          <PropertyHeader />
          <PropertyFeatures />
          <PropertyDetailsGrid />

          {propertyListingData?.rental_details?.promote_special_offer && (
            <div className="rounded-lg p-4 bg-yellow-50 border border-yellow-200">
              <div className="text-sm text-gray-600 mb-1">Special Offer</div>
              <div className="font-normal">
                Save{" "}
                {Math.round(
                  Number(
                    propertyListingData?.rental_details?.offer_percentage || 0
                  )
                )}
                % if leased before{" "}
                {format(
                  propertyListingData?.rental_details
                    ?.offer_end_date as unknown as Date,
                  "MM/dd/yyyy"
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="md:text-sm text-xs font-normal mb-3 text-gray-500">
              Description
            </h3>
            <Description
              text={propertyListingData?.listing_info?.description || ""}
            />
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
          {/* Custom close button with red color */}
          <DialogClose className="cursor-pointer absolute top-4 right-4 z-50 rounded-sm opacity-70  transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground border-none">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <div className="relative w-full h-[90vh] rounded-2xl">
            {propertyImages[dialogImageIndex] && (
              <Image
                src={propertyImages[dialogImageIndex].photo}
                alt={`Property image ${dialogImageIndex + 1}`}
                fill
                className="object-contain rounded-2xl"
                priority
              />
            )}

            {/* Image index positioned directly on the image */}
            <div className="absolute top-4 right-1/5 -translate-x-1/2 bg-[#00000066] text-white px-3 py-1 rounded-full text-sm z-40">
              {dialogImageIndex + 1} of {propertyImages.length}
            </div>

            {propertyImages?.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white z-40"
                  onClick={prevDialogImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white z-40"
                  onClick={nextDialogImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
