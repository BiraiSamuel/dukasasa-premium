"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaCheck, FaCircleQuestion, FaXmark, FaMinus, FaPlus } from "react-icons/fa6";
import { SectionTitle } from "@/components";

const CartPage = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/proxy/cart", { cache: "no-store" });
      const json = await res.json();
      setCart(json.cart.data);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId: number) => {
    try {
      const res = await fetch("/api/proxy/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId }),
      });
      const result = await res.json();
      if (!result.success) throw new Error();
      toast.success("Item removed");
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      setUpdatingId(itemId);
      const res = await fetch("/api/proxy/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId, quantity }),
      });
      const result = await res.json();
      if (!result.success) throw new Error();
      fetchCart();
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white min-h-[70vh]">
      <SectionTitle title="Cart Page" path="Home | Cart" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        ) : !cart?.items?.length ? (
          <div className="text-center text-gray-500 py-20">
            <FaCircleQuestion className="text-6xl mx-auto mb-4" />
            <p>Your cart is empty</p>
            <Link
              href="/"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <ul className="divide-y divide-gray-200 border-t border-b">
                {cart.items.map((item: any) => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="w-24 h-24 sm:w-48 sm:h-48 flex-shrink-0">
                      <Image
                        src={item.product.base_image.medium_image_url}
                        width={192}
                        height={192}
                        alt={item.name}
                        className="rounded-md object-cover object-center w-full h-full"
                      />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={updatingId === item.id}
                              className="p-1 border rounded text-gray-600 hover:bg-gray-100"
                            >
                              <FaMinus />
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updatingId === item.id}
                              className="p-1 border rounded text-gray-600 hover:bg-gray-100"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">
                            Price: {item.formated_price}
                          </p>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <FaXmark className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                        <FaCheck className="text-green-500" /> In Stock
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{cart.formated_sub_total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{cart.formated_tax_total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>KES 0.00</span>
                </div>
                <div className="flex justify-between border-t pt-4 font-bold">
                  <span>Total</span>
                  <span>{cart.formated_grand_total}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full mt-6 text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
