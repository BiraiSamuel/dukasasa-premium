"use client";

import {
  StockAvailabillity,
  SingleProductRating,
  ProductTabs,
  SingleProductDynamicFields,
  AddToWishlistBtn,
} from "@/components";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaSquareFacebook,
  FaSquareXTwitter,
  FaSquarePinterest,
} from "react-icons/fa6";

const SingleProductPage = ({ params }: { params: { slug: string } }) => {
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/proxy/products", { cache: "no-store" });
        const data = await res.json();
        const match = data?.data?.find((item: any) => item.url_key === params.slug);
        if (!match) return notFound();
        setProduct(match);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = async () => {
    if (!product) return;

    const payload = {
      product_id: product.id,
      quantity: 1,
    };

    try {
      const res = await fetch(`/api/proxy/cart/add/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      try {
        const result = JSON.parse(text);
        if (!res.ok) throw new Error(result?.message || "Failed to add to cart");
        toast.success("Added to cart!");
      } catch {
        console.error("Invalid JSON:", text);
        toast.error("Invalid response from server");
      }
    } catch (error: any) {
      toast.error(error.message || "Add to cart failed");
    }
  };

  if (!product) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  const images = product.images || [];
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white text-black">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Images */}
          <div className="flex-1">
            <Image
              src={product.base_image?.medium_image_url || "/product_placeholder.jpg"}
              width={500}
              height={500}
              alt={product.name}
              className="w-full max-w-md object-contain mx-auto"
            />
            <div className="flex justify-center gap-3 flex-wrap mt-5">
              {images.map((img: any, index: number) => (
                <Image
                  key={index}
                  src={img.url || "/product_placeholder.jpg"}
                  width={80}
                  height={80}
                  alt={`product image ${index}`}
                  className="border rounded-md object-contain p-1 hover:scale-105 transition"
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-6">
            <SingleProductRating rating={product.reviews?.average_rating} />
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold text-[#ff5b00]">
              {product.formated_price}
            </p>

            <StockAvailabillity
              stock={product.in_stock ? 1 : 0}
              inStock={product.in_stock ? 1 : 0}
            />

            <SingleProductDynamicFields product={product} />

            <div className="flex flex-col gap-4">
              <AddToWishlistBtn product={product} slug={params.slug} />
              <p className="text-lg">
                <span className="font-semibold">SKU:</span> {product.sku || "N/A"}
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-[#ff5b00] hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    handleAddToCart().then(() => (window.location.href = "/cart"));
                  }}
                  className="border border-[#ff5b00] text-[#ff5b00] hover:bg-[#ff5b00] hover:text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Buy Now
                </button>
              </div>

              {/* ✅ IntaSend Trust Badge */}
              <div className="mt-4 text-center">
                <a
                  href="https://intasend.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-with-mpesa-hr-dark.png"
                    width="300"
                    alt="IntaSend Secure Payments"
                    className="mx-auto"
                  />
                </a>
                <a
                  href="https://intasend.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs mt-2 text-gray-500 hover:underline"
                >
                  Secured by IntaSend Payments
                </a>
              </div>

              <div className="flex items-center gap-3 text-lg mt-6">
                <span className="font-semibold">Share:</span>
                <div className="flex gap-2 text-2xl text-blue-500">
                  <FaSquareFacebook className="hover:text-blue-700 transition" />
                  <FaSquareXTwitter className="hover:text-black transition" />
                  <FaSquarePinterest className="hover:text-red-500 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="py-16 border-t mt-10">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
