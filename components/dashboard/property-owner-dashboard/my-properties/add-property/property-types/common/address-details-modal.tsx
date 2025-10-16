import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Info } from "lucide-react";
import React, { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatText } from "@/helpers";
import { usePropertyStore } from "@/lib/stores/use-property-store";
interface AddressDetailsProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
  mapLocation: { lat: number; lng: number } | null;
  formattedAddress: string;
  propertyType?: string;
}
// Map container style
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};
const AddressDetailsModal = ({
  isOpen,
  onConfirm,
  onClose,
  isLoading,
  mapLocation,
  formattedAddress,
  propertyType = "Single Family Home",
}: AddressDetailsProps) => {
  const [zoom, setZoom] = useState(15);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"] as any,
  });
  const addressParts = formattedAddress?.split(",").map((part) => part.trim());
  const streetAddress = addressParts?.[0] || "";
  const cityStateZip =
    addressParts && addressParts.length > 1
      ? addressParts.slice(1).join(", ")
      : "Los Angeles, CA";
  const handleConfirm = () => {
    onConfirm();
  };
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 20));
  };
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 1));
  };
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="rounded-2xl w-full max-w-[1132px] h-[570px] ">
        <div className="bg-gray-50 xl:p-6">
          {/* Header */}
          <h2 className="text-xl font-semibold text-start mb-6">
            Address Details
          </h2>
          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Section - Address Information */}
            <div className="space-y-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
                Is this information complete and correct?
              </h2>
              {/* Address Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 xl:p-6">
                <div className="space-y-6">
                  {/* Street Address */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Street Address
                    </h3>
                    <p className="text-sm lg:text-lg text-gray-900 leading-relaxed">
                      {streetAddress || ""}
                    </p>
                  </div>
                  {/* Property Type */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Property Type
                    </h3>
                    <p className="text-sm lg:text-lg text-gray-900 font-medium">
                      {formatText(propertyType)}
                    </p>
                  </div>
                </div>
              </div>
              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 leading-relaxed">
                    The address should exactly match the validated address for
                    the property. Once you confirm, you can't edit the address.
                  </p>
                </div>
              </div>
            </div>
            {/* Right Section - Map */}
            <div className="h-64 sm:h-80 xl:h-84">
              <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden relative">
                {isLoaded && mapLocation ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapLocation}
                    zoom={zoom}
                    options={mapOptions}
                  >
                    <Marker
                      position={mapLocation}
                      animation={window.google?.maps?.Animation?.DROP}
                    />
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {!isLoaded
                          ? "Loading map..."
                          : "No location data available"}
                        <br />
                        <span className="text-xs">{cityStateZip}</span>
                      </p>
                    </div>
                  </div>
                )}
                {/* Map Controls */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white rounded shadow-lg border border-gray-200">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-b border-gray-200"
                      onClick={handleZoomIn}
                    >
                      <span className="text-lg font-semibold">+</span>
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      onClick={handleZoomOut}
                    >
                      <span className="text-lg font-semibold">−</span>
                    </button>
                  </div>
                </div>
                {/* Google Logo */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white px-2 py-1 rounded text-xs text-gray-600 shadow-sm">
                    Google
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="mt-8 lg:mt-12">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                className="rounded-lg border-gray-200"
                variant="outline"
                onClick={onClose}
              >
                Edit Property Information
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 cursor-pointer"
              >
                {isLoading ? "Submitting..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddressDetailsModal;
