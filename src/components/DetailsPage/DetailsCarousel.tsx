"use client";

import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import placeholderImage from "@/assets/Carousel.png";

// Define productType if not already imported
type productType = Array<{ url?: string }>;

// Or import it if it's defined elsewhere:
// import { productType } from "@/types/productType";

const DetailsCarousel = ({ product }: { product: productType }) => {
  return (
    <div className="relative product-slider">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        speed={900}
        grabCursor={true}
        pagination={{
          el: ".product-pagination",

          clickable: true,
          type: "bullets",
        }}
        navigation={{
          nextEl: ".product-prev",
          prevEl: ".product-next",
        }}
        modules={[Pagination, Navigation]}
      >
        {product &&
          product?.map((image: any, index: number) => (
            <SwiperSlide key={index}>
              <div className="relative h-[600px] w-full ">
                <Image
                  src={image?.url || placeholderImage}
                  alt="Boat image"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="hidden md:block ">
        <div className="flex items-center gap-2">
          <button className="absolute top-[50%] left-3  translate-x-[-50%] z-[2] lg:ml-6 md:lg-5 ml-4 ">
            <IoIosArrowBack className="text-[#105d9e] text-3xl product-next" />
          </button>
          <div className="absolute bottom-5 flex items-center justify-center z-[2] product-pagination "></div>
          <button className="absolute top-[50%] right-3  translate-x-[-50%] z-[2]">
            <IoIosArrowForward className="text-[#105d9e] text-2xl product-prev" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsCarousel;
