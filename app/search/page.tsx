// app/search/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SectionTitle } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Share2 } from "lucide-react";

// Skeleton loader (basic version)
const SkeletonCard = () => (
  <div className="bg-white border rounded-xl p-4 shadow-md animate-pulse space-y-3">
    <div className="h-40 bg-gray-200 rounded-md" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-full" />
    <div className="h-3 bg-gray-200 rounded w-5/6" />
    <div className="h-4 bg-gray-300 rounded w-1/2 mt-2" />
    <div className="h-8 bg-gray-200 rounded-md w-full" />
  </div>
);

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!query) return;
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || !hasMore) return;
      setLoading(true);

      try {
        const res = await fetch(
          `/api/proxy/search?search=${encodeURIComponent(query)}&page=${page}`
        );
        const json = await res.json();

        const results = json.products || [];
        const meta = json.meta;

        setProducts((prev) => [...prev, ...results]);
        setHasMore(meta?.current_page < meta?.last_page);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  return (
    <div className="bg-white text-black py-10 min-h-screen">
      <SectionTitle title="Search Results" path="Home | Search" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <h3 className="text-3xl sm:text-4xl text-center font-semibold mb-10">
          {query ? `Showing results for "${query}"` : "Search Results"}
        </h3>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white text-black rounded-xl shadow-md overflow-hidden flex flex-col justify-between"
                >
                  <Link href={`/products/${product.url_key}`} className="relative block">
                    <Image
                      src={
                        product.base_image?.medium_image_url || "/placeholder.jpg"
                      }
                      alt={product.name}
                      width={500}
                      height={300}
                      className="w-full h-52 object-contain p-4"
                    />
                  </Link>

                  <div className="p-4 space-y-2">
                    <Link
                      href={`/products/${product.url_key}`}
                      className="block hover:text-[#ff5b00]"
                    >
                      <h3 className="font-semibold text-base line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {product.short_description?.replace(/<[^>]*>/g, "")}
                    </p>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) =>
                        i < product.reviews?.average_rating ? (
                          <FaStar key={i} className="text-yellow-400 text-xs" />
                        ) : (
                          <FaRegStar key={i} className="text-yellow-400 text-xs" />
                        )
                      )}
                      <span className="text-xs text-gray-500">
                        ({product.reviews?.total || 0})
                      </span>
                    </div>

                    <p className="text-[#ff5b00] font-bold">
                      {product.formated_price}
                    </p>

                    <div className="text-green-600 text-sm font-medium">
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </div>

                    <div className="flex justify-between mt-4 gap-2">
                      <Link
                        href={`/products/${product.url_key}`}
                        className="bg-[#ff5b00] text-white px-3 py-1 text-sm rounded hover:bg-[#cc4400] text-center w-full"
                      >
                        View Product
                      </Link>
                      <button
                        type="button"
                        className="text-[#ff5b00] hover:text-[#cc4400] text-sm flex items-center gap-1"
                        onClick={() => {
                          const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://dukasasa.co.ke"}/products/${product.url_key}`;
                          const text = `${product.name} - ${product.short_description?.replace(/<[^>]*>/g, "")}`;
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(
                              text + " " + url
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        <Share2 size={16} /> WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {loading &&
                Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>

            {hasMore && !loading && (
              <div className="text-center mt-10">
                <button
                  className="px-6 py-2 bg-[#ff5b00] text-white rounded hover:bg-[#cc4400]"
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <h3 className="text-2xl text-center mt-20 font-medium text-gray-600">
            No products found for &quot;{query}&quot;
          </h3>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
