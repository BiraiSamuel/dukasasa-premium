"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchProducts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = searchInput.trim();
    if (!trimmedInput) return;

    setLoading(true);

    try {
      // Navigate to search results page with query param
      router.push(`/search?query=${encodeURIComponent(trimmedInput)}`);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
      setSearchInput("");
    }
  };

  return (
    <form
      onSubmit={searchProducts}
      className="flex w-full max-w-xl mx-auto rounded-full shadow-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-[#ff5b00] transition"
      role="search"
      aria-label="Search products"
    >
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for products..."
        className="flex-1 px-4 py-2 text-sm text-gray-800 focus:outline-none bg-gray-100 placeholder-gray-400"
        aria-label="Search input"
      />
      <button
        type="submit"
        className="bg-[#ff5b00] text-white px-5 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
        aria-label="Search"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchInput;
