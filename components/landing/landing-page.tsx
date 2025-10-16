"use client";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/contexts/auth-context";

import { FeatureCards } from "./feature-cards";
import { Footer } from "./footer";
import GuruDifferentSection from "./guru-different-section";
import { HeroSection } from "./hero-section";
import HowItWorks from "./how-it-works";
import InvestorInformation from "./investor-information";
import JourneySection from "./journey-section";
import { LandingHeader } from "./landing-header";
import OfferingsSection from "./offerings-section";
import ReadyToList from "./ReadyToList";
import Testimonials from "./testimonials";
import { UserSpecificFeatures } from "./user-specific-features";

export function LandingPage() {
  const { user, userLoading } = useAuth();
  const router = useRouter();

  if (userLoading) return;

  // if (user && !user?.role?.includes("tenant")) {
  //   router.push("/dashboard");
  //   return null;
  // }

  return (
    <div className="min-h-screen w-full flex flex-col max-w-container mx-auto overflow-hidden">
      <LandingHeader />
      <main>
        <div className="mx-auto w-full px-4 md:px-16">
          <HeroSection />
          {/* <FeatureCards />   */}
          <OfferingsSection />
          {/* <UserSpecificFeatures /> */}
          <JourneySection />
          <GuruDifferentSection />
          <HowItWorks />
        </div>
        <Testimonials />
        <div className="md:px-10 lg:px-16">
          <ReadyToList />
        </div>
        <InvestorInformation />
      </main>
      <Footer />
    </div>
  );
}
