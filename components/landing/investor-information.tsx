import React from "react";

const InvestorInformation = () => {
  return (
    <div className="w-full h-[183px] py-10 bg-secondary-900 flex flex-col items-center gap-6">
      <p className="text-white text-center max-w-3xl">
        Looking For Investor Information?
      </p>
      <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold w-[143px] py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg leading-6">
        Investor Access
      </button>
    </div>
  );
};

export default InvestorInformation;
