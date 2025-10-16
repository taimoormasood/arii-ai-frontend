"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
  Sliders,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { property1 } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CitySelect from "@/components/ui/city-select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";
import { FiltersSidebar } from "./filters-sidebar";

// Property type definition
interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  sqft: number;
  bedrooms: number;
  type: "apartment" | "villa" | "house";
  rating: number;
  image: string;
}

// Sample property data
const properties: Property[] = [
  {
    id: "1",
    title: "3 Bed Apartment in Washington",
    address: "1234 Pennsylvania Avenue NW",
    city: "Washington",
    state: "DC",
    zip: "20500",
    price: 25000,
    sqft: 2345,
    bedrooms: 3,
    type: "apartment",
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "2",
    title: "Luxury Villa in New York",
    address: "350 5th Avenue",
    city: "New York",
    state: "NY",
    zip: "10118",
    price: 25000,
    sqft: 2345,
    bedrooms: 5,
    type: "villa",
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "3",
    title: "5 Bed Apartment in Chicago",
    address: "233 S Wacker Drive",
    city: "Chicago",
    state: "IL",
    zip: "60606",
    price: 25000,
    sqft: 2345,
    bedrooms: 5,
    type: "apartment",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "4",
    title: "3 Bed Apartment in Washington",
    address: "1600 Pennsylvania Avenue NW",
    city: "Washington",
    state: "DC",
    zip: "20500",
    price: 25000,
    sqft: 2345,
    bedrooms: 3,
    type: "apartment",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "5",
    title: "Luxury Villa in New York",
    address: "350 5th Avenue",
    city: "New York",
    state: "NY",
    zip: "10118",
    price: 25000,
    sqft: 2345,
    bedrooms: 4,
    type: "villa",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "6",
    title: "5 Bed Apartment in Chicago",
    address: "233 S Wacker Drive",
    city: "Chicago",
    state: "IL",
    zip: "60606",
    price: 25000,
    sqft: 2345,
    bedrooms: 5,
    type: "apartment",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "6",
    title: "5 Bed Apartment in Chicago",
    address: "233 S Wacker Drive",
    city: "Chicago",
    state: "IL",
    zip: "60606",
    price: 25000,
    sqft: 2345,
    bedrooms: 5,
    type: "apartment",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "6",
    title: "5 Bed Apartment in Chicago",
    address: "233 S Wacker Drive",
    city: "Chicago",
    state: "IL",
    zip: "60606",
    price: 25000,
    sqft: 2345,
    bedrooms: 5,
    type: "apartment",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "6",
    title: "5 Bed Apartment in Chicago",
    address: "233 S Wacker Drive",
    city: "Chicago",
    state: "IL",
    zip: "60606",
    price: 25000,
    sqft: 2345,
    bedrooms: 5,
    type: "apartment",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "6",
    title: "5 Bed Apartment in Chicago",
    address: "233 S Wacker Drive",
    city: "Chicago",
    state: "IL",
    zip: "60606",
    price: 25000,
    sqft: 2345,
    bedrooms: 5,
    type: "apartment",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
  },
];

export function BrowseListingComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    "350 5th Avenue New York, NY 10118"
  );

  const { user, userLoading } = useAuth();

  const router = useRouter();

  // Properties per page
  const propertiesPerPage = 6;

  // Calculate total pages
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  // Get current properties
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // if (userLoading) return;

  // if (user && !user?.role?.includes("tenant")) {
  //   router.push("/dashboard");
  //   return null;
  // }

  return (
    <div className="md:py-10 py-6 md:px-20 px-4">
      {user && user?.kyc_request && user?.kyc_request?.status === "pending" && (
        <Alert variant={"error"} className="mb-4">
          <AlertTitle variant={"error"}>KYC Pending</AlertTitle>
          <AlertDescription>
            Your KYC verification is pending. We’ll notify you once reviewed.
          </AlertDescription>
        </Alert>
      )}

      {user &&
        user?.kyc_request &&
        user?.kyc_request?.status === "rejected" && (
          <Alert
            variant={"error"}
            className="mb-4 flex justify-between items-center gap-3"
          >
            <div className="flex flex-col space-y-2">
              <AlertTitle variant={"error"}>KYC Rejected</AlertTitle>
              <AlertDescription>
                Your KYC verification is rejected. Click below to view details.
              </AlertDescription>
            </div>
            <AlertAction>
              <Button
                className="bg-red-700 hover:bg-red-800 text-xs px-2 py-1"
                onClick={() => router.push(`/kyc?action=resubmit`)}
              >
                Resubmit KYC
              </Button>
            </AlertAction>
          </Alert>
        )}

      {user &&
        user?.kyc_request &&
        user?.kyc_request?.status === "approved" &&
        user?.property_owner_profile === null && (
          <Alert
            variant={"error"}
            className="mb-4 flex justify-between items-center gap-3"
          >
            <div className="flex flex-col space-y-2">
              <AlertTitle>KYC Accepted</AlertTitle>
              <AlertDescription>
                Your KYC verification is approved. Please setup your profile to
                continue.
              </AlertDescription>
            </div>
            <AlertAction>
              <Button
                className="bg-green-700 hover:bg-green-800 text-xs px-2 py-1"
                onClick={() => router.push(`/setup-account`)}
              >
                Setup Account
              </Button>
            </AlertAction>
          </Alert>
        )}

      {/* Header with location and filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
          <div className="relative flex-1 w-full">
            <CitySelect
              value={selectedCity}
              onValueChange={setSelectedCity}
              placeholder="Select City"
              searchPlaceholder="Search cities..."
              className="[&>label]:hidden"
            />
          </div>

          <div className="relative flex-1 w-full">
            <Input
              type="text"
              placeholder="Enter address, city, or ZIP"
              className="pr-10"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            />
            {/* search button */}
            <div className="flex items-center gap-3 absolute right-2 top-2 ">
              <button className="cursor-pointer">
                <X className="h-4 w-4 text-gray-700" />
              </button>
              <button className="flex items-center justify-center rounded bg-black w-6 h-6 cursor-pointer">
                <SearchIcon className="h-4 w-4" color="white" />
              </button>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="px-3 h-10 border-primary-500 text-primary-500 font-semibold hover:border-gray-100"
          onClick={() => setIsFiltersOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-1" />
          Filters
        </Button>
      </div>

      {/* Property grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevPage}
          disabled={currentPage === 1}
          className="text-gray-700 font-semibold border-gray-300 rounded-lg"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Previous
        </Button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show current page and nearby pages
            const pageNum = i + 1;
            if (currentPage > 3 && totalPages > 5) {
              if (i === 0) return currentPage - 2;
              if (i === 1) return currentPage - 1;
              if (i === 2) return currentPage;
              if (i === 3) return currentPage + 1;
              if (i === 4) return currentPage + 2;
            }

            return pageNum;
          }).map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? "default" : "outline"}
              className={cn(
                "h-8 w-8 p-0 border-none",
                currentPage === number && "bg-primary-500 hover:bg-primary-600"
              )}
              onClick={() => paginate(number)}
            >
              {number}
            </Button>
          ))}

          {totalPages > 5 && (
            <>
              <span className="text-gray-500">...</span>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => paginate(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="default"
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-primary-500 hover:bg-primary-600 rounded-lg"
        >
          Next <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      {/* Filters Sidebar */}
      <FiltersSidebar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden border border-gray-200 rounded-2xl bg-white property-card p-4">
      <div className="relative">
        <Image
          src={property1}
          alt={property.title}
          width={381}
          height={280}
          className="h-auto w-full"
        />

        <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-xs font-medium">{property.rating}</span>
        </div>
      </div>

      <CardContent className="p-4 min-h-36 h-auto">
        <h3 className="font-semibold text-lg text-gray-800">
          {property.title}
        </h3>
        <p className="text-gray-700 text-sm mb-3">
          {property.address}, {property.city}, {property.state} {property.zip}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-primary-500 font-bold text-xl">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-gray-700 text-xs"> / month</span>
          </div>
          <div className="text-gray-700 text-sm bg-primary-50 rounded-2xl py-1 px-2">
            {property.sqft.toLocaleString()} sqft
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-0">
        <Button className="bg-primary-500 hover:bg-primary-700 text-white w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
