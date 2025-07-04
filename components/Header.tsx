"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { FaBell } from "react-icons/fa6";

import HeaderTop from "./HeaderTop";
import SearchInput from "./SearchInput";
import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { setWishlist, wishQuantity } = useWishlistStore();

  const handleLogout = () => {
    toast.success("Logout successful!");
    setTimeout(() => signOut(), 1000);
  };

  const getWishlistByUserId = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/wishlist/${id}`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch wishlist");

      const wishlist = await response.json();
      const productArray = wishlist.map((item: any) => ({
        id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        image: item?.product?.mainImage,
        slug: item?.product?.slug,
        stockAvailabillity: item?.product?.inStock,
      }));

      setWishlist(productArray);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const getUserByEmail = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/email/${encodeURIComponent(session.user.email)}`,
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Failed to fetch user");

      const user = await response.json();
      getWishlistByUserId(user?.id);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      getUserByEmail();
    }
  }, [session?.user?.email]);

  return (
    <header className="bg-white shadow-sm w-full">
      <HeaderTop />

      {/* ====== Main Header ====== */}
      {!pathname.startsWith("/admin") && (
        <div className="w-full py-4 border-b bg-white">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-16 w-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Logo */}
            <div className="flex justify-between items-center w-full lg:w-auto">
              <Link href="/" className="shrink-0">
                <Image
                  src="/logo v1 svg.svg"
                  width={200}
                  height={60}
                  alt="Singitronic Logo"
                  className="w-52 h-auto"
                  priority
                />
              </Link>

              {/* Icons on mobile */}
              <div className="flex items-center gap-6 lg:hidden">
                <HeartElement wishQuantity={wishQuantity} />
                <CartElement />
              </div>
            </div>

            {/* Search Bar (takes full width on both mobile & desktop) */}
            <div className="w-full lg:flex-1 lg:px-8">
              <SearchInput />
            </div>

            {/* Icons on desktop */}
            <div className="hidden lg:flex items-center gap-6">
              <HeartElement wishQuantity={wishQuantity} />
              <CartElement />
            </div>
          </div>
        </div>
      )}

      {/* ====== Admin Header ====== */}
      {pathname.startsWith("/admin") && (
        <div className="w-full bg-white border-b shadow-sm py-4">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-16">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logo v1.png"
                width={130}
                height={60}
                alt="Singitronic Logo"
                className="w-36 h-auto"
              />
            </Link>

            {/* Admin Profile */}
            <div className="flex items-center gap-5">
              <FaBell className="text-xl text-[#ff5b00]" />

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ff5b00]">
                  <Image
                    src={session?.user?.image || "/randomuser.jpg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </button>
                <ul className="absolute right-0 mt-2 w-52 bg-white border shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 z-50">
                  <li>
                    <Link
                      href="/admin"
                      className="block px-4 py-2 hover:bg-[#ffe7db]"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/profile"
                      className="block px-4 py-2 hover:bg-[#ffe7db]"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-[#ffe7db]"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;