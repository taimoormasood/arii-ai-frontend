import React from "react";

const Loader = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
};

export default Loader;
