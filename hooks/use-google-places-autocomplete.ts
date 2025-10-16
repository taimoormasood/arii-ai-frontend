"use client";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
interface UseGooglePlacesAutocompleteProps {
  form: UseFormReturn<any>;
  isLoaded: boolean;
}
interface AddressComponents {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}
interface PlaceResult {
  formattedAddress: string;
  mapLocation: { lat: number; lng: number } | null;
  addressComponents: AddressComponents;
}
export function useGooglePlacesAutocomplete({
  form,
  isLoaded,
}: UseGooglePlacesAutocompleteProps) {
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [mapLocation, setMapLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  useEffect(() => {
    if (!isLoaded || !autocompleteRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      {
        componentRestrictions: { country: "us" },
        fields: ["address_components", "formatted_address", "geometry"],
        types: ["address"],
      }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place || !place.address_components) return;
      // Set formatted address for display in modal
      if (place.formatted_address) {
        setFormattedAddress(place.formatted_address);
      }
      // Set map location for the modal
      if (place.geometry?.location) {
        setMapLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
      // Extract address components
      let streetNumber = "";
      let route = "";
      let city = "";
      let state = "";
      let zipCode = "";
      place.address_components?.forEach((component) => {
        const types = component.types;
        if (types.includes("street_number")) {
          streetNumber = component.long_name;
        } else if (types.includes("route")) {
          route = component.long_name;
        } else if (
          types.includes("locality") ||
          types.includes("sublocality") ||
          types.includes("neighborhood")
        ) {
          // Some addresses might use different component types for city
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      });
      // If city is still empty, try to extract it from other components
      if (!city) {
        // Try to find city in other component types
        const cityComponent = place.address_components?.find(
          (comp) =>
            comp.types.includes("locality") ||
            comp.types.includes("sublocality") ||
            comp.types.includes("administrative_area_level_2") ||
            comp.types.includes("postal_town")
        );
        if (cityComponent) {
          city = cityComponent.long_name;
        }
      }
      // Update form values
      const streetAddress = `${streetNumber} ${route}`.trim();
      form.setValue("streetAddress", streetAddress, { shouldValidate: true });
      form.setValue("city", city, { shouldValidate: true });
      form.setValue("state", state, { shouldValidate: true });
      form.setValue("zipCode", zipCode, { shouldValidate: true });
    });

    return () => {
      // Clean up listener when component unmounts
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, form]);

  return {
    autocompleteRef,
    formattedAddress,
    mapLocation,
  };
}
