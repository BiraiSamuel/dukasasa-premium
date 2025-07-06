"use client";
import React from "react";
import { X } from "lucide-react";

export default function IntaSendModal({
  link,
  onClose,
}: {
  link: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-fade-in">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Secure Payment via IntaSend</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <iframe
            src={link}
            className="w-full h-[500px] rounded-md border"
            allow="payment *"
          />
        </div>
      </div>
    </div>
  );
}
