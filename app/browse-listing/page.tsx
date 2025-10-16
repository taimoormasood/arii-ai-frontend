import { BrowseListingComponent } from "@/components/landing/browse-listing";
import { Footer } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/landing-header";

export default function BrowseListingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main>
        <BrowseListingComponent />
      </main>
      <Footer />
    </div>
  );
}
