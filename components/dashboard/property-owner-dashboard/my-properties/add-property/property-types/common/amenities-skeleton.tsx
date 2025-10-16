export const AmenitiesLoader = () => {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Title */}
      <div className="h-6 w-32 bg-gray-200 rounded" />

      {/* Laundry Facilities - Radio Buttons */}
      <div className="space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="flex flex-wrap gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-300 rounded-full" />
              <div className="h-4 w-52 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Cooling, Heating, Appliances - Checkbox Groups */}
      {["Cooling", "Heating", "Appliances"].map((section, idx) => (
        <div key={idx} className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="flex flex-wrap gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
