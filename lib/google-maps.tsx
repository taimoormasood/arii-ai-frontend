"use client";
import { useLoadScript } from "@react-google-maps/api";
import { ReactNode } from "react";
interface GoogleMapsScriptProps {
  children: (props: {
    isLoaded: boolean;
    loadError: Error | undefined;
  }) => ReactNode;
}
// Libraries we want to load from Google Maps
const libraries = ["places"];
export function GoogleMapsScript({ children }: GoogleMapsScriptProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  return <>{children({ isLoaded, loadError })}</>;
}
