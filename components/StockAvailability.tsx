import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StockAvailabillity = ({ stock, inStock }: { stock: number; inStock: boolean }) => {
  return (
    <div className="flex items-center gap-2 text-lg font-medium">
      {inStock ? (
        <>
          <FaCheckCircle className="text-green-600" />
          <span className="text-green-600">In Stock ({stock} available)</span>
        </>
      ) : (
        <>
          <FaTimesCircle className="text-red-600" />
          <span className="text-red-600">Out of Stock</span>
        </>
      )}
    </div>
  );
};

export default StockAvailabillity;
