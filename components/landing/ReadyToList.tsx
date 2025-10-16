import Image from "next/image";
import React from "react";

import BuildingSkyscraperIcon from "@/assets/icons/building-skyscraper-icon";
import ListBarIcon from "@/assets/icons/list-bar-icon";
import TagIcon from "@/assets/icons/tag-icon";
import { guruLogoGif } from "@/assets/images";

const ReadyToList = () => {
  return (
    <div className="h-full bg-[url('/green-bg-lines.png')] bg-cover my-[100px]   bg-center bg-no-repeat relative overflow-hidden ">
      {/* Diagonal line pattern overlay */}

      <div className=" relative z-10   px-6 py-[100px] lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 w-full max-w-container mx-auto">
        {/* Left Content */}
        <div className="flex-1  ">
          <h1 className=" lg:ml-12 text-4xl md:text-4xl text-center md:text-start font-semibold text-white mb-8 leading-[44px]">
            Ready to List Your Property or
            <br />
            Start Renting?
          </h1>

          {/* Action Buttons */}
          <div className="lg:ml-12 flex flex-col sm:flex-row gap-4 mb-8  justify-center lg:justify-start">
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold w-full md:w-[143px] py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg leading-6">
              Join as Vendor
            </button>

            <button className="bg-secondary-600 hover:bg-secondary-600 text-white font-semibold w-full md:w-[143px]  py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg leading-6">
              List a Property
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold w-full md:w-[143px]  py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg leading-6">
              Start Renting
            </button>
          </div>
        </div>

        {/* Right Content - Character and Features */}
        <div className="flex-1 flex flex-col items-center lg:items-end w-full ">
          {/* Feature Cards */}
          <div className="flex flex-col  gap-3 max-w-sm w-full relative">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <BuildingSkyscraperIcon />
                <span className="text-gray-800 font-medium">
                  Best Revenue Generating Properties
                </span>
              </div>
            </div>

            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <TagIcon />
                <span className="text-gray-800 font-medium">
                  Boost Occupancy with Discounts
                </span>
              </div>
            </div>

            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <ListBarIcon />
                <span className="text-gray-800 font-medium">
                  Enhance Listings for More Revenue
                </span>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center lg:justify-start  items-start ">
            {/* Character base */}

            <Image
              src={guruLogoGif}
              alt="Guru Character"
              className="object-cover rounded-full h-[200px] w-[200px] ml-12 "
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyToList;
