import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function FeatureShowcase() {
  return (
    <div className="space-y-8">
      {/* Marketing Copy */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-black">
          Explore the world's leading Property Management App.
        </h2>

        <p className="text-gray-600">
          Millions of property owners and agencies around the world manage their
          properties with Rental Guru - the home to the world's best Property
          Management.
        </p>

        {/* Reviews Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <AvatarGroup />
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-500 text-sm">
                Rated Best Over
              </span>
              <span className="text-primary-600 font-semibold text-sm">
                15.7k
              </span>
              <span className="font-medium text-gray-500 text-sm">Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvatarGroup() {
  return (
    <div className="flex -space-x-4 border-r border-r-gray-300 pr-2">
      <Avatar className="border-2 border-white w-8 h-8">
        <AvatarFallback className="bg-primary-500 text-white text-xs">
          JD
        </AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white w-8 h-8">
        <AvatarFallback className="bg-[#F79009] text-white text-xs">
          TS
        </AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white w-8 h-8">
        <AvatarFallback className="bg-[#00aae5] text-white text-xs">
          MK
        </AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white w-8 h-8">
        <AvatarFallback className="bg-primary-500 text-white text-xs">
          JD
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
