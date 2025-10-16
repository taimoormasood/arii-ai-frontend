// components/GameChangersSection.tsx
import Image from "next/image";

import { aiRecommandationLogo, smallGuruLogo } from "@/assets/images";

const features = [
  {
    title: "One Platform, All Roles",
    description:
      "One login, multiple roles: owner, tenant, vendor — all managed via smart dashboards.",
  },
  {
    title: "Verified by KYC",
    description: "Trust is built-in. All users go through our identity checks.",
  },

  {
    title: "Built-In Task Management",
    description:
      "Manage jobs, repairs, and property tasks in real time. Whether you’re assigning a repair or bidding for a cleaning gig — everything is trackable with due dates and updates.",
  },
  {
    title: "AI-Powered Recommendations",
    description:
      "Get smart suggestions for vendors, listings, and even lease terms. Our AI engine helps match the right tenant, service provider, or rent range — tailored to your needs.",
    guruImage: "/guru.png", // Place your guru image in public folder
  },
  {
    title: "Vendor-Integrated Communitie",
    description:
      "Your rental isn’t just listed. It’s connected to cleaners, handymen, and maintenance teams.",
  },
  {
    title: "Universal Dashboard",
    description:
      'One central "workplace" for messaging, payments, profile switching, and tracking everything.',
  },
];

export default function GuruDifferentSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-20 bg-gradient-to-r from-[rgba(119,184,0,0.10)] to-[rgba(78,205,196,0.10)]">
      <div className="w-full max-w-container mx-auto text-center">
        <div className="flex justify-center items-center mb-4 gap-3">
          <div className="w-20 h-[1px] bg-gradient-to-l from-primary to-transparent"></div>
          <div className="text-primary text-sm font-medium  tracking-wide ">
            Game Changers
          </div>
          <div className="w-20 h-[1px] bg-gradient-to-r from-primary to-transparent"></div>
        </div>{" "}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          What Makes Rental Guru Different?
        </h2>
        <p className="text-gray-800 w-full text-lg">
          We’re not just another rental site. We’re a connected ecosystem — with
          verified users, local jobs, and flexible rentals for modern living.
        </p>
      </div>

      {/* new grid */}

      <div className="mt-12 space-y-6 w-full max-w-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {/* Left side with 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* First 2 cards */}
            {features.slice(0, 2).map((feature, index) => (
              <div
                key={index}
                className="col-span-12 md:col-span-6 bg-white rounded-xl p-6 shadow-sm flex flex-col  relative"
              >
                <div className="mb-4 bg-[#F1F8E6] w-[60px] h-[60px] flex items-center justify-center rounded-lg">
                  <Image
                    src={smallGuruLogo}
                    alt="Small Guru Logo"
                    className="object-contain h-7 w-7"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}

            {/* Third card full width below */}
            <div className="col-span-12 bg-white rounded-xl p-6  shadow-sm flex flex-col justify-between  relative">
              <div className="mb-4 bg-[#F1F8E6] w-[60px] h-[60px] flex items-center justify-center rounded-lg">
                <Image
                  src={smallGuruLogo}
                  alt="Small Guru Logo"
                  className="object-contain h-7 w-7"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  {features[2].title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {features[2].description}
                </p>
              </div>
            </div>
          </div>

          {/* Right side with AI card */}
          <div className="bg-white rounded-xl p-6 pb-0 shadow-sm flex flex-col justify-between  relative ">
            <div className="space-y-3">
              <div className="mb-4 bg-[#F1F8E6] w-[60px] h-[60px] flex items-center justify-center rounded-lg">
                <Image
                  src={smallGuruLogo}
                  alt="Small Guru Logo"
                  className="object-contain h-7 w-7"
                />
              </div>

              <div>
                <h3 className="font-semibold text-[20px] mb-1 text-gray-900">
                  {features[3].title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {features[3].description}
                </p>
              </div>
            </div>

            <div className="self-center">
              <Image
                src={aiRecommandationLogo}
                alt="AI Recommendation"
                width={186}
                height={186}
              />
            </div>
          </div>
        </div>

        {/* Bottom row with 4th and 5th cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 ">
          <div className="col-span-12 md:col-span-4 bg-white rounded-xl p-6 shadow-sm flex flex-col  ">
            <div className="mb-4 bg-[#F1F8E6] w-[60px] h-[60px] flex items-center justify-center rounded-lg">
              <Image
                src={smallGuruLogo}
                alt="Small Guru Logo"
                className="object-contain h-7 w-7"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                {features[4].title}
              </h3>
              <p className="text-gray-600 text-sm">{features[4].description}</p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 bg-white rounded-xl p-6 shadow-sm flex flex-col ">
            <div className="mb-4 bg-[#F1F8E6] w-[60px] h-[60px] flex items-center justify-center rounded-lg">
              <Image
                src={smallGuruLogo}
                alt="Small Guru Logo"
                className="object-contain h-7 w-7"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                {features[5].title}
              </h3>
              <p className="text-gray-600 text-sm">{features[5].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
