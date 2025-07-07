"use client";

import { SectionTitle } from "@/components";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import { bagistoGetWishlist, bagistoRemoveFromWishlist } from "@/lib/bagisto";
import WishItem from "@/components/WishItem";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const token = (session as any)?.accessToken as string;
      if (!token) {
        console.warn("No access token found.");
        return;
      }

      const response = await bagistoGetWishlist(token);
      console.log("Wishlist response:", response);

      if (!Array.isArray(response)) {
        console.warn("Wishlist response is not an array.");
        setWishlist([]);
        return;
      }

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
    } finally {
      setLoading(false);
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
    if (session && (session as any)?.accessToken) {
      fetchWishlist();
    } else {
      setLoading(false); // Prevent infinite loading
    }
  }, [session]);

  return (
    <div className="bg-white min-h-screen pb-16">
      <SectionTitle title="Wishlist" path="Home | Wishlist" />

      {loading ? (
        <div className="flex justify-center mt-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#ff5b00]" />
        </div>
      ) : wishlist.length === 0 ? (
        <h3 className="text-center text-4xl py-16 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-10 max-[400px]:text-xl">
          No items found in your wishlist.
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto px-4 animate-fade-in">
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
