"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { page } = usePaginationStore();
  const { sortBy } = useSortStore();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/proxy/categories");
        const data = await res.json();
        setCategories(data?.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }

    replace(`${pathname}?${params}`);
  }, [inputCategory, sortBy, page, selectedCategories]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 text-sm text-black">
      <h3 className="text-2xl font-bold text-[#ff5b00]">Filters</h3>

      {/* Availability */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Availability</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory((prev) => ({
                  ...prev,
                  inStock: { ...prev.inStock, isChecked: !prev.inStock.isChecked },
                }))
              }
              className="accent-[#ff5b00] w-4 h-4"
            />
            <span>In stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory((prev) => ({
                  ...prev,
                  outOfStock: { ...prev.outOfStock, isChecked: !prev.outOfStock.isChecked },
                }))
              }
              className="accent-[#ff5b00] w-4 h-4"
            />
            <span>Out of stock</span>
          </label>
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* Price Filter */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Price</h4>
        <input
          type="range"
          min={0}
          max={3000}
          step={10}
          value={inputCategory.priceFilter.value}
          onChange={(e) =>
            setInputCategory((prev) => ({
              ...prev,
              priceFilter: { ...prev.priceFilter, value: Number(e.target.value) },
            }))
          }
          className="w-full accent-[#ff5b00]"
        />
        <p className="text-sm mt-1">Max price: ${inputCategory.priceFilter.value}</p>
      </div>

      <hr className="border-gray-300" />

      {/* Rating Filter */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Minimum Rating</h4>
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory((prev) => ({
              ...prev,
              ratingFilter: { ...prev.ratingFilter, value: Number(e.target.value) },
            }))
          }
          className="w-full accent-[#ff5b00]"
        />
        <div className="flex justify-between text-xs px-1 text-gray-500">
          {[0, 1, 2, 3, 4, 5].map((val) => (
            <span key={val}>{val}</span>
          ))}
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* Category Filter */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Categories</h4>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm">Loading categories...</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {categories.map((category: any) => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="accent-[#ff5b00] w-4 h-4"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;