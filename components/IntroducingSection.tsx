"use client";

import Link from "next/link";
import React from "react";

const IntroducingSection = () => {
  return (
    <section className="py-14 bg-gradient-to-r from-white via-orange-100 to-orange-300 shadow-inner">
      <div className="text-center flex flex-col gap-y-5 items-center px-4">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight transition-transform duration-300 hover:scale-105">
          INTRODUCING{" "}
          <span className="text-orange-600">JEZKIM HARDWARE</span>
        </h2>

        <div className="space-y-1 max-w-2xl mx-auto">
          <p className="text-gray-800 text-lg font-medium">
            Power Tools that Work as Hard as You Do.
          </p>
          <p className="text-gray-800 text-lg font-medium">
            From drills to grinders — rugged, reliable, ready for any job.
          </p>
        </div>

        <Link
          href="/shop"
          className="mt-4 inline-block bg-orange-600 text-white font-bold px-8 py-2 text-base rounded-full shadow-md transition-transform hover:scale-105 hover:bg-orange-700"
        >
          SHOP NOW
        </Link>
      </div>
    </section>
  );
};

export default IntroducingSection;