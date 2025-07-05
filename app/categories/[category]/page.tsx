"use client";

import React, { useEffect, useState } from "react";
import { SectionTitle } from "@/components";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaStar, FaRegStar } from "react-icons/fa6";

interface Props {
  params: { category: string };
}

interface Product {
  id: number;
  name: string;
  urlKey: string;
  image: string;
  formattedPrice: string;
  shortDescription: string;
  description: string;
  averageRating: number;
  totalReviews: number;
}

const PRODUCTS_API = "/api/proxy/products";
const CATEGORIES_API = "/api/proxy/categories";

const CategoryPage = ({ params }: Props) => {
  const categorySlug = params.category;
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [matchedCategory, setMatchedCategory] = useState<any>({ name: categorySlug });
  const [sortOption, setSortOption] = useState<string>("default");
  const BATCH_SIZE = 8;

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const categoriesRes = await fetch(CATEGORIES_API, { cache: "no-store" });
        const categoriesData = await categoriesRes.json();
        const categories = categoriesData.data || [];
        const category = categories.find((cat: any) => cat.slug === categorySlug);

        if (!category) return;
        setMatchedCategory(category);

        const productsRes = await fetch(`${PRODUCTS_API}?category_id=${category.id}`, { cache: "no-store" });
        const productsData = await productsRes.json();
        const rawProducts = productsData.data || [];

        const formatted = rawProducts.map((product: any) => ({
          id: product.id,
          name: product.name,
          urlKey: product.url_key,
          image: product.base_image?.medium_image_url || "/placeholder.jpg",
          formattedPrice: product.formated_price,
          shortDescription: product.short_description?.replace(/<[^>]*>?/gm, "") ?? "",
          description: product.description?.replace(/<[^>]*>?/gm, "") ?? "",
          averageRating: product.reviews?.average_rating || 0,
          totalReviews: product.reviews?.total || 0,
        }));

        setAllProducts(formatted);
        setVisibleProducts(formatted.slice(0, BATCH_SIZE));
      } catch (error) {
        console.error("Error fetching category or products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categorySlug]);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const nextBatch = allProducts.slice(
        visibleProducts.length,
        visibleProducts.length + BATCH_SIZE
      );
      setVisibleProducts((prev) => [...prev, ...nextBatch]);
      setLoadingMore(false);
    }, 500);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    let sorted = [...allProducts];
    if (option === "price-low") {
      sorted.sort((a, b) => parseFloat(a.formattedPrice.replace(/[^\d.]/g, "")) - parseFloat(b.formattedPrice.replace(/[^\d.]/g, "")));
    } else if (option === "price-high") {
      sorted.sort((a, b) => parseFloat(b.formattedPrice.replace(/[^\d.]/g, "")) - parseFloat(a.formattedPrice.replace(/[^\d.]/g, "")));
    } else if (option === "rating") {
      sorted.sort((a, b) => b.averageRating - a.averageRating);
    }
    setAllProducts(sorted);
    setVisibleProducts(sorted.slice(0, BATCH_SIZE));
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const res = await fetch(`/api/proxy/cart/add/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Failed to add to cart");
      toast.success("Added to cart");
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <SectionTitle title={matchedCategory.name} path={`Home | ${matchedCategory.name}`} />

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-screen-2xl mx-auto px-4 py-10">
          {Array.from({ length: BATCH_SIZE }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 animate-pulse rounded-xl h-[370px]"
            ></div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <p className="text-gray-600">
              Showing <strong>{visibleProducts.length}</strong> of <strong>{allProducts.length}</strong> products
            </p>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border text-sm px-3 py-2 rounded"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white text-black rounded-xl shadow-md overflow-hidden flex flex-col justify-between"
                >
                  <Link href={`/products/${product.urlKey}`} className="relative block">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={300}
                      className="w-full h-52 object-contain p-4"
                    />
                  </Link>
                  <div className="p-4 space-y-2">
                    <Link href={`/products/${product.urlKey}`} className="block hover:text-[#ff5b00]">
                      <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-3">{product.shortDescription}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) =>
                        i < product.averageRating ? (
                          <FaStar key={i} className="text-yellow-400 text-xs" />
                        ) : (
                          <FaRegStar key={i} className="text-yellow-400 text-xs" />
                        )
                      )}
                      <span className="text-xs text-gray-500">({product.totalReviews})</span>
                    </div>
                    <p className="text-[#ff5b00] font-bold">{product.formattedPrice}</p>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="mt-2 bg-[#ff5b00] text-white px-4 py-2 text-sm rounded hover:bg-[#cc4400] w-full"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h3 className="text-3xl text-center py-10 text-gray-600">
              No products found in this category.
            </h3>
          )}

          {visibleProducts.length < allProducts.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-[#ff5b00] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#cc4400] flex items-center gap-2"
              >
                {loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</> : "Show More Products"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
