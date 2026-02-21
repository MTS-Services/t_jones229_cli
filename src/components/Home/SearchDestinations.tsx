"use client";

import React, { useState } from "react";
import { cardData } from "@/constant/SearchDestinations";
import SearchDestinationsCard from "./SearchDestinationsCard";
import Container from "../common/Container";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchDestinations() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const cards = cardData.slice(0, 3);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <Container className="">
      <h1 className="text-[#242424] text-xl md:text-4xl text-center font-bold mb-8">
        Search Our Destinations{" "}
      </h1>

      {/* Desktop Grid - Hidden on Mobile */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 grid-rows-1 lg:gap-8 md:gap-6.5 gap-5 justify-center items-center">
        {cards.map((cardInfo, index) => (
          <SearchDestinationsCard
            key={index}
            cardInfo={cardInfo}
            isLast={index === cards.length - 1}
          />
        ))}
      </div>

      {/* Mobile Carousel - Hidden on Desktop */}
      <div className="md:hidden relative">
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {cards.map((cardInfo, index) => (
              <div key={index} className="min-w-full px-2">
                <SearchDestinationsCard cardInfo={cardInfo} isLast={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-gray-800 text-white border border-gray-500 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Previous destination"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-gray-800 text-white border border-gray-500 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Next destination"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-8 h-2 bg-[#105d9e]"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
