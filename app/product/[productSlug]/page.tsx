import {
  StockAvailabillity,
  UrgencyText,
  SingleProductRating,
  ProductTabs,
  SingleProductDynamicFields,
  AddToWishlistBtn,
} from "@/components";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook, FaSquareXTwitter, FaSquarePinterest } from "react-icons/fa6";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const res = await fetch(`http://localhost:3001/api/slugs/${params.productSlug}`);
  const product = await res.json();

  const imagesRes = await fetch(`http://localhost:3001/api/images/${product.id}`);
  const images = await imagesRes.json();

  if (!product || product.error) notFound();

  return (
    <div className="bg-white text-black">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10">
        {/* Top section: image + product details */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product images */}
          <div className="flex-1">
            <Image
              src={product?.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"}
              width={500}
              height={500}
              alt={product.title}
              className="w-full max-w-md object-contain mx-auto"
            />

            <div className="flex justify-center gap-3 flex-wrap mt-5">
              {images?.map((imageItem: ImageItem) => (
                <Image
                  key={imageItem.imageID}
                  src={`/${imageItem.image}`}
                  width={80}
                  height={80}
                  alt={`product image ${imageItem.imageID}`}
                  className="border rounded-md object-contain p-1 hover:scale-105 transition"
                />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="flex-1 flex flex-col gap-6">
            <SingleProductRating rating={product?.rating} />
            <h1 className="text-3xl font-bold">{product?.title}</h1>
            <p className="text-2xl font-semibold text-blue-600">Ksh. {product?.price}</p>

            <StockAvailabillity stock={94} inStock={product?.inStock} />
            <SingleProductDynamicFields product={product} />

            <div className="flex flex-col gap-4">
              <AddToWishlistBtn product={product} slug={params.productSlug} />
              <p className="text-lg">
                <span className="font-semibold">SKU:</span> abccd-18
              </p>

              {/* Social Share */}
              <div className="flex items-center gap-3 text-lg">
                <span className="font-semibold">Share:</span>
                <div className="flex gap-2 text-2xl text-blue-500">
                  <FaSquareFacebook className="hover:text-blue-700 transition" />
                  <FaSquareXTwitter className="hover:text-black transition" />
                  <FaSquarePinterest className="hover:text-red-500 transition" />
                </div>
              </div>

              {/* IntaSend Secure Payment Badge */}
              <div className="mt-4">
                <a
                  href="https://intasend.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-with-mpesa-hr-dark.png"
                    width="375"
                    alt="IntaSend Secure Payments (PCI-DSS Compliant)"
                    className="mx-auto"
                  />
                </a>
                <strong>
                  <a
                    href="https://intasend.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs mt-2 text-gray-500 hover:underline text-center"
                  >
                    Secured by IntaSend Payments
                  </a>
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="py-16 border-t mt-10">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;