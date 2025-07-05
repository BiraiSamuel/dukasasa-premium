"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb, Filters, SortBy } from "@/components";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Share2, Loader2 } from "lucide-react";
import { Dialog } from "@headlessui/react";

const improveCategoryText = (text: string): string => {
  const readable = text.replace(/-/g, " ");
  return readable.charAt(0).toUpperCase() + readable.slice(1);
};

const PRODUCTS_API = "/api/proxy/products";
const CATEGORIES_API = "/api/proxy/categories";

const ShopPage = ({ params }: { params: { slug?: string[] } }) => {
  const categorySlug = params?.slug?.[0] ?? "";
  const [allFetchedProducts, setAllFetchedProducts] = useState<any[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const BATCH_SIZE = 20;

  const fetchProducts = async (page = 1) => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${PRODUCTS_API}?page=${page}&limit=${BATCH_SIZE}`),
        fetch(CATEGORIES_API),
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      const allProducts = productsData.data || [];
      const allCategories = categoriesData.data || [];
      const matchedCategory = allCategories.find(
        (cat: any) => cat.slug === categorySlug
      );

      const filteredProducts = matchedCategory
        ? allProducts.filter((product: any) =>
            product.categories?.some((c: any) => c.id === matchedCategory.id)
          )
        : allProducts;

      const formatted = filteredProducts.map((product: any) => ({
        id: product.id,
        name: product.name,
        url_key: product.url_key,
        image: product.base_image?.medium_image_url || "/placeholder.jpg",
        formattedPrice: product.formated_price,
        shortDescription: product.short_description?.replace(/<[^>]*>?/gm, "") ?? "",
        description: product.description?.replace(/<[^>]*>?/gm, "") ?? "",
        averageRating: product.reviews?.average_rating || 0,
        totalReviews: product.reviews?.total || 0,
        categories: product.categories || [],
      }));

      setAllFetchedProducts((prev) => [...prev, ...formatted]);
      setVisibleProducts((prev) => [...prev, ...formatted]);
      setHasMore(formatted.length === BATCH_SIZE);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!hasMore) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage);
  };

  const getRelated = (product: any) => {
    const categoryIds = product.categories.map((cat: any) => cat.id);
    const relatedItems = allFetchedProducts.filter(
      (p) =>
        p.id !== product.id &&
        p.categories.some((cat: any) => categoryIds.includes(cat.id))
    );
    setRelated(relatedItems.slice(0, 6));
  };

  useEffect(() => {
    setAllFetchedProducts([]);
    setVisibleProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setInitialLoading(true);
    fetchProducts(1);
  }, [categorySlug]);

  const allDisplayed = !hasMore;

  return (
    <div className="bg-white text-gray-900 py-10 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <Breadcrumb />

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
          <aside className="sticky top-24 self-start md:block hidden">
            <Filters />
          </aside>

          <main className="w-full">
            <div className="md:hidden mb-4">
              <details className="bg-white text-black rounded-md shadow p-4">
                <summary className="cursor-pointer font-semibold text-sm">Filter Products</summary>
                <div className="mt-4">
                  <Filters />
                </div>
              </details>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-y-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide">
                {categorySlug ? improveCategoryText(categorySlug) : "All Products"}
              </h1>
              <SortBy />
            </div>

            {!initialLoading && visibleProducts.length > 0 && (
              <p className="text-sm text-gray-600 mb-6">
                Showing <strong>{visibleProducts.length}</strong> products
              </p>
            )}

            {initialLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 text-[#ff5b00] animate-spin" />
              </div>
            ) : visibleProducts.length === 0 ? (
              <p className="text-center text-gray-600">No products found.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleProducts.map((product) => (
                    <div key={product.id} className="bg-white text-black rounded-xl shadow-md overflow-hidden flex flex-col justify-between">
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
                        <div className="text-sm text-gray-600">
                          <p className="line-clamp-3">{product.shortDescription}</p>
                          <button
                            type="button"
                            className="text-[#ff5b00] underline text-sm block mt-1"
                            onClick={() => {
                              setSelectedProduct(product);
                              getRelated(product);
                            }}
                          >
                            View more
                          </button>
                        </div>

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
                              const url = `${window.location.origin}/products/${product.url_key}`;
                              const text = `${product.name} - ${product.shortDescription}`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                            }}
                          >
                            <Share2 size={16} /> WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore || allDisplayed}
                    className={`px-6 py-2 rounded text-sm font-medium ${
                      allDisplayed
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#ff5b00] text-white hover:bg-[#cc4400]"
                    } flex items-center gap-2`}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                      </>
                    ) : allDisplayed ? (
                      "You've reached the end"
                    ) : (
                      "Load More Products"
                    )}
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black/50 px-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-2xl w-full text-black shadow-xl">
            <Dialog.Title className="text-2xl font-bold mb-4">
              {selectedProduct?.name}
            </Dialog.Title>

            <Image
              src={selectedProduct?.image || ""}
              alt={selectedProduct?.name || ""}
              width={500}
              height={300}
              className="w-full h-64 object-contain mb-4 rounded"
            />

            <p className="text-sm text-gray-700 whitespace-pre-line mb-4">
              {selectedProduct?.description}
            </p>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-[#ff5b00] text-lg">{selectedProduct?.formattedPrice}</span>
              <Link
                href={`/products/${selectedProduct?.url_key}`}
                className="bg-[#ff5b00] text-white px-4 py-2 rounded hover:bg-[#cc4400]"
              >
                View Product
              </Link>
            </div>

            <h3 className="text-lg font-semibold mb-2">Related Products</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {related.map((item) => (
                <div key={item.id} className="text-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={150}
                    className="w-full h-32 object-contain rounded mb-1"
                  />
                  <p className="font-medium line-clamp-2">{item.name}</p>
                  <p className="text-[#ff5b00] font-semibold">{item.formattedPrice}</p>
                </div>
              ))}
            </div>

            <div className="text-right">
              <button
                className="text-sm text-[#ff5b00] underline hover:text-[#cc4400]"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ShopPage;
