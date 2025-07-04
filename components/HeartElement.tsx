// *********************
// Role of the component: Wishlist icon with quantity located in the header
// Name of the component: HeartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1
// Component call: <HeartElement />
// Input parameters: wishQuantity (number)
// Output: wishlist icon with quantity
// *********************

"use client";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa6";

const HeartElement = ({ wishQuantity }: { wishQuantity: number }) => {
  return (
    <div className="relative">
      <Link href="/wishlist">
        <FaHeart className="text-2xl text-black" />
        <span className="block w-6 h-6 font-bold text-xs bg-[#ff5b00] text-white rounded-full flex justify-center items-center absolute top-[-17px] right-[-22px]">
          {wishQuantity}
        </span>
      </Link>
    </div>
  );
};

export default HeartElement;