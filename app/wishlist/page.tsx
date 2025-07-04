"use client";

import { SectionTitle } from "@/components";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import { bagistoGetWishlist, bagistoRemoveFromWishlist } from "@/lib/bagisto";
import WishItem from "@/components/WishItem";

interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailability: number;
}

const WishlistPage = () => {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const fetchWishlist = async () => {
    try {
      const token = (session as any)?.accessToken as string;
      if (!token) return;

      const response = await bagistoGetWishlist(token);

      const products = response.map((item: any) => ({
        id: item.id,
        title: item.name,
        price: parseFloat(item.price),
        image: item.base_image?.small_image_url || "/placeholder.png",
        slug: item.url_key,
        stockAvailability: item.in_stock ? 1 : 0,
      }));

      setWishlist(products);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const token = (session as any)?.accessToken as string;
      if (!token) return;

      await bagistoRemoveFromWishlist(productId, token);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  useEffect(() => {
    if ((session as any)?.accessToken) {
      fetchWishlist();
    }
  }, [session]);

  return (
    <div className="bg-white min-h-screen">
      <SectionTitle title="Wishlist" path="Home | Wishlist" />
      {wishlist.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
          No items found in the wishlist
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-[#ff5b00]">Image</th>
                  <th className="text-[#ff5b00]">Name</th>
                  <th className="text-[#ff5b00]">Stock Status</th>
                  <th className="text-[#ff5b00]">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item) => (
                  <WishItem
                    key={nanoid()}
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    slug={item.slug}
                    stockAvailability={item.stockAvailability}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
