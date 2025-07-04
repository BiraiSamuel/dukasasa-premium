"use client";
import React from "react";
import ProductItem from "./ProductItem";

const Products = ({ items }: { items: any[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.length > 0 ? (
        items.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] border border-gray-200"
          >
            <ProductItem product={product} color="black" />
          </div>
        ))
      ) : (
        <h3 className="text-xl sm:text-2xl text-center w-full col-span-full text-gray-600 py-10">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;