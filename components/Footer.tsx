"use client";

import { navigation } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

const Footer = () => {
  const year = new Date().getFullYear();
  const initialRenderRef = useRef(true);

  useEffect(() => {
    initialRenderRef.current = true;
  }, []);

  return (
    <>
      <footer className="bg-white border-t relative z-10" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>

        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 pt-24 pb-14">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="flex flex-col items-start space-y-4">
              <Image
                src="/logo v1.png"
                alt="Jezkim Hardware logo"
                width={250}
                height={250}
                className="h-auto w-auto"
              />
              <div className="mt-2">
                <a
                  href="https://intasend.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-with-mpesa-hr-dark.png"
                    width="300"
                    alt="IntaSend Secure Payments"
                    className="mx-auto"
                  />
                </a>
                <a
                  href="https://intasend.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs mt-2 text-gray-500 hover:underline text-center"
                >
                  Secured by IntaSend Payments
                </a>
              </div>
              <p className="text-sm text-gray-600 pt-4">
                &copy; {year} DukaSasa. All rights reserved.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-lg font-bold text-[#ff5b00]">Sale</h3>
                  <ul className="mt-6 space-y-4">
                    <li><a href="/sales/offers" className="text-sm text-gray-700 hover:text-gray-900">Current Offers</a></li>
                    <li><a href="/sales/clearance" className="text-sm text-gray-700 hover:text-gray-900">Clearance Deals</a></li>
                    <li><a href="/sales/weekly" className="text-sm text-gray-700 hover:text-gray-900">Weekly Specials</a></li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-lg font-bold text-[#ff5b00]">About Jezkim Hardware</h3>
                  <ul className="mt-6 space-y-4">
                    <li><a href="/about" className="text-sm text-gray-700 hover:text-gray-900">Company Info</a></li>
                    <li><a href="/about/team" className="text-sm text-gray-700 hover:text-gray-900">Meet the Team</a></li>
                    <li><a href="/about/careers" className="text-sm text-gray-700 hover:text-gray-900">Careers</a></li>
                    <li><a href="/contact" className="text-sm text-gray-700 hover:text-gray-900">Contact Us</a></li>
                  </ul>
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-lg font-bold text-[#ff5b00]">Buying</h3>
                  <ul className="mt-6 space-y-4">
                    <li><a href="/how-to-buy" className="text-sm text-gray-700 hover:text-gray-900">How to Buy</a></li>
                    <li><a href="/shipping" className="text-sm text-gray-700 hover:text-gray-900">Shipping & Delivery</a></li>
                    <li><a href="/returns" className="text-sm text-gray-700 hover:text-gray-900">Returns Policy</a></li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-lg font-bold text-[#ff5b00]">Support</h3>
                  <ul className="mt-6 space-y-4">
                    <li><a href="/support/help-center" className="text-sm text-gray-700 hover:text-gray-900">Help Center</a></li>
                    <li><a href="/support/contact" className="text-sm text-gray-700 hover:text-gray-900">Customer Support</a></li>
                    <li><a href="/support/faq" className="text-sm text-gray-700 hover:text-gray-900">FAQs</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a
          href="https://wa.me/254716261608"
          title="Chat with us on WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            height: "60px",
            width: "60px",
            borderRadius: "50%",
            backgroundColor: "#00e785",
            boxShadow: "4px 5px 10px rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999,
            cursor: "pointer",
            transition: "transform 0.3s ease",
            animation: "pulse 2s infinite",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="35"
            height="35"
            fill="#fff"
          >
            <path d="M16 2.933c-7.3 0-13.067 5.767-13.067 13.067 0 2.3.6 4.534 1.733 6.534l-1.8 5.534 5.7-1.8a13.017 13.017 0 006.434 1.633c7.3 0 13.067-5.767 13.067-13.067S23.3 2.933 16 2.933zm0 23.467a11.285 11.285 0 01-5.7-1.567l-.4-.233-3.4 1.067 1.067-3.3-.233-.434a10.55 10.55 0 01-1.6-5.6c0-5.867 4.8-10.667 10.667-10.667S26.667 10.6 26.667 16.467 21.867 26.4 16 26.4zm6.3-8.3c-.367-.2-2.167-1.067-2.5-1.2-.333-.133-.567-.2-.8.2-.233.367-.933 1.2-1.133 1.433-.2.267-.4.3-.767.1a9.267 9.267 0 01-2.767-1.7 10.1 10.1 0 01-1.867-2.3c-.2-.367 0-.567.167-.767.167-.2.367-.433.533-.667.2-.233.267-.4.4-.667.133-.267.067-.5 0-.7-.067-.2-.8-2.067-1.1-2.833-.3-.733-.6-.633-.8-.633-.2 0-.433 0-.667.033-.233.033-.6.1-.9.433s-1.2 1.167-1.2 2.833 1.233 3.3 1.4 3.533c.167.233 2.4 3.667 5.8 5.133 2.133.9 2.967 1.033 4.033.867.633-.1 2.067-.833 2.367-1.667.3-.833.3-1.567.2-1.667-.067-.133-.3-.2-.667-.367z" />
          </svg>
        </a>

        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </footer>

      {initialRenderRef.current && (
        <TawkMessengerReact
          propertyId="614722fb25797d7a89ffbb69"
          widgetId="1ffuu1a9n"
        />
      )}
    </>
  );
};

export default Footer;