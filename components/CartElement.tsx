// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.3
// Component call: <CartElement />
// Input parameters: no input parameters
// Output: Cart icon and quantity from Bagisto backend
// *********************

"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";

const CartElement = () => {
  const [quantity, setQuantity] = useState(0);

  const fetchCartQuantity = async () => {
    try {
      const res = await fetch("/api/proxy/cart", { cache: "no-store" });
      const json = await res.json();
      const items = json.cart?.data?.items || [];
      const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setQuantity(total);
    } catch (err) {
      console.error("Failed to fetch cart quantity");
      setQuantity(0); // fallback
    }
  };

  useEffect(() => {
    fetchCartQuantity();
  }, []);

  return (
    <div className="relative">
      <Link href="/cart" className="relative block">
        <FaCartShopping className="text-2xl text-black" />
        <span className="block w-6 h-6 bg-[#ff5b00] text-white rounded-full text-xs font-bold flex justify-center items-center absolute top-[-17px] right-[-22px]">
          {quantity}
        </span>
      </Link>
    </div>
  );
};

export default CartElement;
