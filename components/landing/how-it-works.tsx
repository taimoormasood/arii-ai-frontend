import Image from "next/image";

import GreenArrowIcon from "@/assets/icons/green-arrow-icon";
import VerticalGreenLines from "@/assets/icons/vertical-green-lines";
import { howItWorksImg } from "@/assets/images";

export default function HowItWorks() {
  const steps = [
    {
      title: "Find your role (Tenant / Owner / Vendor)",
      desc: "Verified homes. Easy applications. Instant lease access.",
    },
    {
      title: "Complete Identity Verification",
      desc: "Unlock trusted player status via KYC",
    },
    {
      title: "Access Your Command Center",
      desc: "Use your dashboard to manage listings, jobs, rent, or tasks",
    },
  ];

  return (
    <section className="py-12 px-4 md:px-12 bg-white w-full max-w-container mx-auto">
      <div className="flex justify-start items-center mb-1 gap-3">
        <div className="w-16 h-[1px] bg-gradient-to-l from-primary to-transparent"></div>
        <div className="text-primary text-sm font-medium  tracking-wide ">
          3 Steps Speed Run
        </div>
        <div className="w-16 h-[1px] bg-gradient-to-r from-primary to-transparent"></div>
      </div>{" "}
      <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-3">
        How It Works
      </h2>
      <p className="text-gray-600 max-w-xl">
        Explore trusted listings. Hire local pros. Manage everything from your
        universal dashboard.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Image – 8 columns on lg+ */}
        <div className="lg:col-span-8">
          <Image
            src={howItWorksImg}
            alt="How It Works"
            className="w-full rounded-xl object-cover h-full max-h-[476px]"
            placeholder="blur"
          />
        </div>

        {/* Steps – 4 columns on lg+ */}
        <div className="relative pl-6 lg:col-span-4">
          {steps.map((step, idx) => (
            <div className="flex flex-col" key={idx}>
              <div className="relative flex items-start">
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0 self-center p-2 md:p-4 bg-primary-50 text-white rounded-full flex items-center justify-center">
                  <GreenArrowIcon />
                </div>

                {/* Text */}
                <div className="ml-6">
                  <p className="text-primary-600 font-medium mb-1">
                    Step {idx + 1}
                  </p>
                  <h3 className="text-gray-900 font-semibold text-lg mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              </div>

              {/* Vertical line */}
              {idx < steps.length - 1 && (
                <div className="ml-8">
                  <VerticalGreenLines />
                </div>
              )}
            </div>
          ))}

          <button className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-5 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg ">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}
