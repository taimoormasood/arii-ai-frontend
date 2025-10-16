import { Check } from "lucide-react";
import Image from "next/image";

import { Feature1, Feature2, Feature3 } from "@/assets/images";
import { Button } from "@/components/ui/button";

export function UserSpecificFeatures() {
  return (
    <section className="md:px-20 px-4 md:space-y-16 space-y-10 pb-16">
      {featuresData.map((feature, index) => (
        <div
          key={feature.id}
          className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${
            feature.imageOnLeft && "md:grid-cols-2 md:grid-flow-row-dense"
          }`}
        >
          {/* Image */}
          <div
            className={`rounded-lg overflow-hidden ${
              feature.imageOnLeft && "md:order-2"
            }`}
          >
            <Image
              src={feature.image}
              height={450}
              width={500}
              alt={`Person using Rental Guru app - ${feature.id}`}
              className="w-full h-auto"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className=" text-gray-900 font-semibold md:text-4xl text-2xl">
              {feature.title}
            </h2>
            <h3 className="md:text-lg text-base text-gray-700 mt-1">
              {feature.subtitle}
            </h3>
            <p className="text-gray-700 md:text-lg text-base mt-2">
              {feature.description}
            </p>

            <div className="mt-3">
              <h4 className="font-semibold md:text-2xl text-lg text-gray-700">
                What You Get:
              </h4>
              <ul className="space-y-1 mt-1 text-gray-700 md:text-lg text-sm">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start">
                    <Check className="h-4 w-4 text-primary-500 mr-2 mt-1" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="bg-primary-500 hover:bg-primary-700 text-white px-6 mt-4 text-base">
              {feature.buttonText}
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}

const featuresData = [
  {
    id: "tenants",
    title: "For Tenants",
    image: Feature1,
    subtitle: "Find Verified Homes. Apply with Confidence.",
    description:
      "Tired of rental scams and shady listings? Rental Guru connects you to verified properties managed by trusted landlords. Browse listings, apply directly, and track your lease and service requests—all from one easy dashboard.",
    benefits: [
      "Access to only verified rental listings",
      "Easy online applications",
      "Track rent payments, leases, and maintenance",
      "Rate your experience and share feedback",
    ],
    buttonText: "Start Renting",
  },
  {
    id: "vendors",
    title: "For Vendors",
    image: Feature2,
    subtitle: "Grow Your Business with Verified Property Jobs.",
    description:
      "Join Rental Guru as a vendor and connect with property owners who need your expertise. From plumbing and electrical to renovations and repairs—get discovered, bid on tasks, and build lasting partnerships.",
    benefits: [
      "Job opportunities from verified property owners",
      "Profile with certifications, services, and portfolio",
      "Submit proposals and track project milestones",
      "Transparent payments and ratings",
    ],
    buttonText: "Join as a Vendor",
    imageOnLeft: true,
  },
  {
    id: "owners",
    title: "For Owners",
    image: Feature3,
    subtitle: "List. Manage. Earn—All in One Place.",
    description:
      "Whether you own a single unit or a growing portfolio, Rental Guru helps you manage properties with ease. Post listings, screen tenants, collect rent, assign vendors, and track every task—backed by KYC-verified profiles and smart automation.",
    benefits: [
      "Verified vendor and tenant management",
      "Rent collection and reporting tools",
      "Property and task dashboards",
      "Secure profile with ownership transfer options",
    ],
    buttonText: "List Your Property",
  },
];
