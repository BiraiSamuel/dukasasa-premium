"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section
      className="w-full bg-gradient-to-br from-gray-50 via-gray-100 to-orange-100 py-20"
      aria-label="Hero section"
    >
      <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
        
        {/* Text Content */}
        <div className="flex flex-col gap-6 text-center lg:text-left font-sans">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Built for Power, Engineered for Work
          </h1>
          <p className="text-lg md:text-xl text-gray-800/90 max-w-xl mx-auto lg:mx-0">
            Discover high-performance power tools built to tackle the toughest jobs with speed, strength, and precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
            <Link href="/shop">
              <button
                type="button"
                className="bg-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow hover:bg-orange-700 transition"
              >
                Shop Now
              </button>
            </Link>
            <button
              type="button"
              className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-full border border-orange-300 hover:bg-orange-50 transition"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Product Image */}
        <div className="flex justify-center lg:justify-end">
          <Image
            src="/watch for banner.png"
            width={500}
            height={500}
            alt="Power Tool Banner"
            priority
            className="w-auto h-auto max-w-full drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;