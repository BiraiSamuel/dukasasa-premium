"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Heading from "./Heading";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { bagistoAddToWishlist } from "@/lib/bagisto";
import { useRouter } from "next/navigation";

const PRODUCTS_PER_PAGE = 20;

type Product = {
  id: number;
  name: string;
  urlKey: string;
  price: string;
  formattedPrice: string;
  image: string;
  shortDescription: string;
  description: string;
  averageRating: number;
  totalReviews: number;
  inStock: boolean;
  isOnSale: boolean;
};

const ProductsSection = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const token = session?.accessToken as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/proxy/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      const allProducts = (data.data || [])
        .filter((item: any) => item.in_stock && item.base_image?.medium_image_url)
        .map((item: any): Product => ({
          id: item.id,
          name: item.name,
          urlKey: item.url_key,
          price: item.price,
          formattedPrice: item.formated_price,
          image: item.base_image.medium_image_url,
          shortDescription: item.short_description?.replace(/<[^>]*>?/gm, "") ?? "",
          description: item.description?.replace(/<[^>]*>?/gm, "") ?? "",
          averageRating: item.reviews?.average_rating || 0,
          totalReviews: item.reviews?.total || 0,
          inStock: item.in_stock,
          isOnSale: !!item.special_price,
        }));

      const start = (page - 1) * PRODUCTS_PER_PAGE;
      const end = start + PRODUCTS_PER_PAGE;
      const sliced = allProducts.slice(start, end);

      setProducts((prev) => [...prev, ...sliced]);
      if (end >= allProducts.length) setHasMore(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleAddToCart = async (productId: number, redirect = false) => {
    //if (!token) return alert("Please log in to add to cart.");

    try {
      const res = await fetch(`/api/proxy/cart/add/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });

      const text = await res.text();
      try {
        const result = JSON.parse(text);
        if (!res.ok) throw new Error(result?.message || "Failed to add to cart");
        alert("Product added to cart!");
        if (redirect) router.push("/cart");
      } catch {
        console.error("Invalid response:", text);
        alert("Unexpected response from server.");
      }
    } catch (error: any) {
      alert(error.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    //if (!token) return alert("Please log in to add to wishlist.");
    try {
      await bagistoAddToWishlist(productId, token);
      alert("Added to wishlist!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400" />
      )
    );

  const getRelatedProducts = (current: Product) =>
    products.filter(
      (item) => item.id !== current.id && item.name.split(" ")[0] === current.name.split(" ")[0]
    ).slice(0, 3);

  const handleShowMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#cc4400] to-[#ff5b00] text-white border-t-4 border-white py-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <Heading title="FEATURED PRODUCTS" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {loading && products.length === 0 ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-white/10 rounded-lg h-[300px] w-full"></div>
            ))
          ) : error ? (
            <p className="col-span-full text-red-300 text-center font-semibold">{error}</p>
          ) : products.length === 0 ? (
            <p className="col-span-full text-center text-white text-lg">No products available.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white text-black rounded-xl shadow-lg overflow-hidden flex flex-col justify-between"
              >
                <Link href={`/products/${product.urlKey}`} className="relative cursor-pointer block">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={500}
                    height={300}
                    className="w-full h-52 object-contain p-4"
                  />
                  {product.isOnSale && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">SALE</span>
                  )}
                  {product.inStock ? (
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      In Stock
                    </span>
                  ) : (
                    <span className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                </Link>

                <div className="p-4 space-y-2">
                  <Link href={`/products/${product.urlKey}`}>
                    <h3 className="font-semibold text-base line-clamp-2 hover:text-[#ff5b00]">{product.name}</h3>
                  </Link>
                  <div className="text-sm text-gray-600 line-clamp-3 relative">
                    {product.shortDescription}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute bottom-0 right-0 bg-white text-[#ff5b00] px-2 py-0 text-xs underline hover:text-[#cc4400]"
                    >
                      View More
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {renderStars(product.averageRating)}
                    <span className="text-gray-500">({product.totalReviews})</span>
                  </div>

                  <p className="text-[#ff5b00] font-bold">{product.formattedPrice}</p>

                  <div className="flex justify-between mt-4 gap-2">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-[#ff5b00] text-white px-3 py-1 text-sm rounded hover:bg-[#cc4400]"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToCart(product.id, true)}
                      className="border border-[#ff5b00] text-[#ff5b00] px-3 py-1 text-sm rounded hover:bg-[#cc4400] hover:text-white"
                    >
                      Buy Now
                    </button>
                  </div>

                  <div className="mt-2 text-right">
                    <button
                      onClick={() => handleAddToWishlist(product.id)}
                      className="text-xs text-[#ff5b00] underline hover:text-[#cc4400]"
                    >
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {hasMore && !loading && (
          <div className="text-center mt-10">
            <button
              onClick={handleShowMore}
              className="bg-white text-[#ff5b00] font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black/50 px-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-xl w-full text-black shadow-xl space-y-4">
            <Dialog.Title className="text-xl font-semibold mb-2 border-b pb-2">
              {selectedProduct?.name}
            </Dialog.Title>

            <Image
              src={selectedProduct?.image || ""}
              alt={selectedProduct?.name || ""}
              width={500}
              height={300}
              className="w-full h-64 object-contain"
            />

            <p className="text-sm text-gray-700 whitespace-pre-line">
              {selectedProduct?.description}
            </p>

            <div className="flex justify-between items-center mt-6">
              <span className="font-bold text-[#ff5b00]">{selectedProduct?.formattedPrice}</span>
              <button
                className="bg-[#ff5b00] text-white px-4 py-2 rounded hover:bg-[#cc4400]"
                onClick={() => {
                  handleAddToCart(selectedProduct!.id);
                  setSelectedProduct(null);
                }}
              >
                Add to Cart
              </button>
            </div>

            <button
              className="mt-4 text-sm text-[#ff5b00] underline hover:text-[#cc4400]"
              onClick={() => setSelectedProduct(null)}
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
};

export default ProductsSection;
