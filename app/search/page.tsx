import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Share2 } from "lucide-react";

interface Props {
  searchParams: { search: string };
}

interface Product {
  id: number;
  name: string;
  url_key: string;
  image: string;
  formattedPrice: string;
  shortDescription: string;
  description: string;
  averageRating: number;
  totalReviews: number;
}

const SearchPage = async ({ searchParams: { search } }: Props) => {
  const data = await fetch(
    `https://jezkimhardware.dukasasa.co.ke/api/products`,
    { cache: "no-store" }
  );

  const res = await data.json();
  const allProducts = res.data || [];

  const filtered = search
    ? allProducts.filter((product: any) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    : allProducts;

  const products: Product[] = filtered.map((product: any) => ({
    id: product.id,
    name: product.name,
    url_key: product.url_key,
    image: product.base_image?.medium_image_url || "/placeholder.jpg",
    formattedPrice: product.formated_price,
    shortDescription: product.short_description?.replace(/<[^>]*>?/gm, "") ?? "",
    description: product.description?.replace(/<[^>]*>?/gm, "") ?? "",
    averageRating: product.reviews?.average_rating || 0,
    totalReviews: product.reviews?.total || 0,
  }));

  return (
    <div className="bg-white text-black py-10 min-h-screen">
      <SectionTitle title="Search Page" path="Home | Search" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        {search && (
          <h3 className="text-3xl sm:text-4xl text-center font-semibold mb-10">
            Showing results for &quot;{search}&quot;
          </h3>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white text-black rounded-xl shadow-md overflow-hidden flex flex-col justify-between"
              >
                <Link href={`/products/${product.url_key}`} className="relative block">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={500}
                    height={300}
                    className="w-full h-52 object-contain p-4"
                  />
                </Link>

                <div className="p-4 space-y-2">
                  <Link href={`/products/${product.url_key}`} className="block hover:text-[#ff5b00]">
                    <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {product.shortDescription}
                  </p>

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
                        const text = `${product.name} - ${product.shortDescription}`;
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
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
          </div>
        ) : (
          <h3 className="text-2xl text-center mt-20 font-medium text-gray-600">
            No products found for &quot;{search}&quot;
          </h3>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
