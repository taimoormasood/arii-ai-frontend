import Image from "next/image";

import {
  propertyOwnerJourney,
  tenantJourney,
  vendorJourney,
} from "@/assets/images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function JourneySection() {
  return (
    <div className="w-full bg-gray-50 py-12 md:py-0 md:pt-12 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 ">
          <div className="flex justify-center items-center mb-4 gap-3">
            <div className="w-20 h-[1px] bg-gradient-to-l from-primary to-transparent"></div>
            <div className="text-primary text-sm font-medium  tracking-wide ">
              Journey
            </div>
            <div className="w-20 h-[1px] bg-gradient-to-r from-primary to-transparent"></div>
          </div>{" "}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Built for Everyone – Choose Your Journey
          </h1>
          <p className="text-gray-600 text-base sm:text-lg w-full font-normal  leading-relaxed">
            Explore trusted listings. Hire local pros. Manage everything from
            your universal dashboard.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Tenants Card */}
          <Card className=" group hover:shadow-xl border-none transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-96  lg:h-[567px] overflow-hidden">
                <Image
                  src={tenantJourney}
                  alt="Tenant journey Image"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fill
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-0 "></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 px-[42px] py-3 md:py-[30px] text-white text-center rounded-lg bg-black/50 backdrop-blur-sm z-10 m-3">
                  <h3 className="text-5 font-semibold mb-1">Tenants</h3>
                  <p className="text-sm  mb-4 leading-relaxed opacity-90">
                    Verified listings. Smart applications. Lease & rent tracking
                    made simple.
                  </p>
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg duration-200 transition-all duration-300 transform hover:scale-105 shadow-lg ">
                    Start Renting
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendors Card */}
          <Card className=" group hover:shadow-xl border-none transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-96  lg:h-[567px] overflow-hidden">
                <Image
                  src={vendorJourney}
                  alt="Vendor journey Image"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fill
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-0 "></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 px-[42px] py-3 md:py-[30px] text-white text-center rounded-lg bg-black/50 backdrop-blur-sm z-10 m-3">
                  <h3 className="text-5 font-semibold mb-1">Vendors</h3>
                  <p className="text-sm  mb-4 leading-relaxed opacity-90">
                    Local jobs. One dashboard. Secure payments every time
                  </p>
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg  duration-200 transition-all duration-300 transform hover:scale-105 shadow-lg ">
                    Join as Vendor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Owners Card */}
          <Card className=" group hover:shadow-xl border-none transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-96  lg:h-[567px] overflow-hidden">
                <Image
                  src={propertyOwnerJourney}
                  alt="Property Owner journey Image"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fill
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-0 "></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 px-[42px] py-3 md:py-[30px] text-white text-center rounded-lg bg-black/50 backdrop-blur-sm z-10 m-3">
                  <h3 className="text-5 font-semibold mb-1">Property Owners</h3>
                  <p className="text-sm  mb-4 leading-relaxed opacity-90">
                    List rentals. Assign vendors. Track everything in one place.
                  </p>
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg  duration-200 transition-all duration-300 transform hover:scale-105 shadow-lg ">
                    List Your Property
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
