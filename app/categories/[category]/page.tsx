// app/categories/[category]/page.tsx

import React from "react";
import { SectionTitle, ProductItem } from "@/components";

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

const PRODUCTS_API = "https://jezkimhardware.dukasasa.co.ke/api/products";
const CATEGORIES_API = "https://jezkimhardware.dukasasa.co.ke/api/categories";

const CategoryPage = async ({ params }: Props) => {
  const categorySlug = params.category;

  // Fetch all categories
  const categoriesRes = await fetch(CATEGORIES_API, { cache: "no-store" });
  const categoriesData = await categoriesRes.json();
  const allCategories = categoriesData.data || [];

  // Find the matching category by slug
  const matchedCategory = allCategories.find(
    (cat: any) => cat.slug === categorySlug
  );

  if (!matchedCategory) {
    return (
      <div className="min-h-screen flex justify-center items-center text-3xl text-red-500">
        Category not found
      </div>
    );
  }

  // Fetch products in the matched category
  const productsRes = await fetch(
    `${PRODUCTS_API}?category_id=${matchedCategory.id}`,
    { cache: "no-store" }
  );
  const productsData = await productsRes.json();
  const rawProducts = productsData.data || [];

  // Format and sanitize product data
  const products: Product[] = rawProducts.map((product: any) => ({
    id: product.id,
    name: product.name,
    urlKey: product.url_key,
    image: product.base_image?.medium_image_url || "/placeholder.jpg",
    formattedPrice: product.formated_price,
    shortDescription:
      product.short_description?.replace(/<[^>]*>?/gm, "") ?? "",
    description: product.description?.replace(/<[^>]*>?/gm, "") ?? "",
    averageRating: product.reviews?.average_rating || 0,
    totalReviews: product.reviews?.total || 0,
  }));

  return (
    <div className="bg-white min-h-screen">
      <SectionTitle
        title={matchedCategory.name}
        path={`Home | ${matchedCategory.name}`}
      />
      <div className="max-w-screen-2xl mx-auto px-4">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-10">
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                color="black"
              />
            ))}
          </div>
        ) : (
          <h3 className="text-3xl text-center py-10 text-gray-600">
            No products found in this category.
          </h3>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
