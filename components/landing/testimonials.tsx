// components/Testimonials.tsx
import "swiper/css";
import "swiper/css/pagination";

import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import GoldenStar from "@/assets/icons/golden-star";
import { girlAvatarImg } from "@/assets/images";

const testimonials = [
  {
    name: "Kelly Williams",
    role: "Tenant",
    feedback:
      "I listed my apartment and had it rented in 48 hours — all with verified tenants",
  },
  {
    name: "Kelly Williams",
    role: "Tenant",
    feedback:
      "I listed my apartment and had it rented in 48 hours — all with verified tenants",
  },
  {
    name: "Kelly Williams",
    role: "Tenant",
    feedback:
      "I listed my apartment and had it rented in 48 hours — all with verified tenants",
  },
  {
    name: "Kelly Williams",
    role: "Tenant",
    feedback:
      "I listed my apartment and had it rented in 48 hours — all with verified tenants",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#F1F9ED] py-16 px-4 sm:px-6 lg:px-16 w-full max-w-container mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="flex justify-center items-center mb-3 gap-3">
          <div className="w-16 h-[1px] bg-gradient-to-l from-primary to-transparent"></div>
          <div className="text-primary-500 text-sm font-medium  tracking-wide ">
            Testimonials
          </div>
          <div className="w-16 h-[1px] bg-gradient-to-r from-primary to-transparent"></div>
        </div>{" "}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          What Our Client Say’s
        </h2>
        <p className="text-gray-600">
          Real Success Stories from Our Rental Community. See how members are
          winning in the property market.
        </p>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 1500, disableOnInteraction: false }}
        pagination={{ el: ".swiper-pagination-custom", clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {testimonials.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white p-6 rounded-xl shadow-sm h-full">
              <div className="flex items-center mb-4">
                <Image
                  src={girlAvatarImg}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
                <div className="ml-auto text-3xl text-gray-300 font-serif">
                  “
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-4">{item.feedback}</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div className="" key={i}>
                    <GoldenStar />
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Outside */}
      <div className="swiper-pagination-custom mt-8 flex justify-center space-x-2" />
    </section>
  );
}
