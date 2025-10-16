"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import ArrowUpRight from "@/assets/icons/arrow-up-right";
import {
  animationImg,
  buyHomeWebsite,
  communitiesImg,
  communityGif,
  guruAnimationImage,
  guruLogoGif,
  houseDiscount,
  houseLocation,
  listingImg,
  propertyBudget,
  propertyGrowthInvestment,
} from "@/assets/images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const floatingIcons = [
  { id: 1, icon: buyHomeWebsite },
  { id: 2, icon: houseDiscount },
  { id: 3, icon: houseLocation },
  { id: 4, icon: propertyBudget },
  { id: 5, icon: propertyGrowthInvestment },
];

export default function OfferingsSection() {
  const [animatingIcon, setAnimatingIcon] = useState<number | null>(null);
  const rotation = useMotionValue(0);
  const scale = useMotionValue(1);
  const xOffset = useMotionValue(0);
  const yOffset = useMotionValue(0);
  const [isMounted, setIsMounted] = useState(false);

  const [angleOffset, setAngleOffset] = useState(0);
  const [radius, setRadius] = useState(120);

  useEffect(() => {
    let rafId: number;

    const rotate = () => {
      setAngleOffset((prev) => (prev + 0.01) % (2 * Math.PI)); // rotate every frame
      rafId = requestAnimationFrame(rotate);
    };

    rotate();

    const interval = setInterval(() => {
      // Animate icons toward guru
      animate(radius, 0, {
        duration: 1,
        onUpdate: (latest) => setRadius(latest),
      }).then(() => {
        setTimeout(() => {
          animate(radius, 120, {
            duration: 1,
            onUpdate: (latest) => setRadius(latest),
          });
        }, 500); // stay at center for 2s
      });
    }, 5000); // every 10s

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);

    // Rotation animation (continuous)
    const rotateAnimation = animate(rotation, 360, {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    });

    // Pulsing animation sequence
    const pulseAnimation = () => {
      // Initial state (10 seconds)
      const sequence = animate(xOffset, 0, { duration: 10 });

      // Move toward center (0.5s)
      sequence.then(() =>
        animate(xOffset, -40, { duration: 0.5, ease: "easeOut" })
      );
      sequence.then(() =>
        animate(yOffset, -20, { duration: 0.5, ease: "easeOut" })
      );
      sequence.then(() =>
        animate(scale, 0.8, { duration: 0.5, ease: "easeOut" })
      );

      // Hold near center (2s)
      sequence.then(() => new Promise((resolve) => setTimeout(resolve, 2000)));

      // Return to original position (0.5s)
      sequence.then(() =>
        animate(xOffset, 0, { duration: 0.5, ease: "easeIn" })
      );
      sequence.then(() =>
        animate(yOffset, 0, { duration: 0.5, ease: "easeIn" })
      );
      sequence.then(() => animate(scale, 1, { duration: 0.5, ease: "easeIn" }));

      // Repeat the whole sequence
      sequence.then(pulseAnimation);
    };

    pulseAnimation();

    return () => {
      rotateAnimation.stop();
      // Cleanup any running animations
    };
  }, []);

  return (
    <div className="p-4 md:py-[80px] ">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
        {/* Guru Section */}
        <div className="mx-auto">
          <Image src={guruAnimationImage} alt="Animation Image" className="" />
        </div>

        {/* Listings Section */}

        <div className="flex-1  h-full max-h-[384px] md:h-auto p-0  bg-[#FAFAFA]  border-[#D9D9D9] rounded-[12px] shadow-lg">
          <div className="relative h-56 overflow-hidden ">
            <Image
              src={listingImg}
              alt="Listings Image"
              fill
              className="object-fill p-0 md:p-6  h-[550px] md:h-[233px] rounded-xl overflow-hidden"
            />
          </div>
          <div className="p-6 mt-2 md:mt-0 pt-0 flex justify-center items-center md:items-start flex-col  max-h-[110px]">
            <h2 className="text-5 font-semibold text-gray-800 mb-2">
              Listings
            </h2>
            <p className="text-gray-600  text-[14px]">
              Browse verified homes for rent
            </p>
            <Button className="w-[160px] text-[14px] font-semibold bg-[#FFF] text-gray-800 border-2 border-gray-200 rounded-lg">
              Find Rentals
              <ArrowUpRight />
              {/* <ArrowRight className="ml-2 w-4 h-4" /> */}
            </Button>
          </div>
        </div>

        {/* Communities Section */}

        <div className="flex-1  h-full max-h-[384px] md:h-auto p-0  bg-[#FAFAFA] border-[#D9D9D9] rounded-[12px] shadow-lg ">
          <div className="relative h-56 p-0 md:p-6  overflow-hidden rounded-xl">
            <Image
              src={communityGif}
              alt="Communities Image"
              fill
              className="object-cover !h-[calc(100%-48px)] !w-[calc(100%-48px)] !inset-6 rounded-xl overflow-hidden"
            />
          </div>
          <div className="p-6 pt-0 flex justify-center items-center md:items-start flex-col max-h-[110px]">
            <h2 className="text-5 font-semibold text-gray-800 mb-2">
              Communities
            </h2>
            <p className="text-gray-600  text-[14px]">
              Discover jobs for vendors
            </p>
            <Button className="w-[160px] text-[14px] font-semibold bg-[#FFF] text-gray-800 border-2 border-gray-200 rounded-lg">
              Explore Markets
              <ArrowUpRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
