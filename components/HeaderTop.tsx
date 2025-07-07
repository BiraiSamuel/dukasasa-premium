"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Menu, X, Headphones, Mail, User } from "lucide-react";

const HeaderTop = () => {
  const { data: session }: any = useSession();
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  const handleLogout = () => {
    toast.success("Logout successful!");
    setTimeout(() => signOut(), 1000);
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-[#ff5b00]/90 text-white text-sm border-b border-[#e25400] shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center h-10 px-6 md:px-12 lg:px-20 max-md:flex-col max-md:gap-2 max-md:h-auto py-2">

        {/* Left: Desktop Contact Info */}
        <ul className="hidden sm:flex items-center gap-x-6">
          <li className="flex items-center gap-x-1">
            <Headphones className="w-4 h-4" />
            <a href="tel:+254716261608" className="hover:underline">
              +254 716 261 608
            </a>
          </li>
          <li className="flex items-center gap-x-1">
            <Mail className="w-4 h-4" />
            <a href="mailto:sales-admin@dukasasa.co.ke" className="hover:underline">
              sales-admin@dukasasa.co.ke
            </a>
          </li>
        </ul>

        {/* Right: Auth & Mobile Menu */}
        <div className="sm:hidden flex justify-between w-full items-center">
          {/* Toggle */}
          <button
            onClick={() => setShowMobileInfo(!showMobileInfo)}
            className="flex items-center gap-1"
          >
            {showMobileInfo ? <X size={16} /> : <Menu size={16} />}
            <span className="text-white">Contact</span>
          </button>

          {/* Auth Links */}
          <ul className="flex items-center gap-x-4 font-medium">
            {!session ? (
              <>
                <li>
                  <Link
                    href="/login"
                    className="flex items-center gap-x-1 hover:text-[#ffd1b2] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="flex items-center gap-x-1 hover:text-[#ffd1b2] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="hidden sm:block text-white/80 text-sm">
                  {session.user?.email || "Account"}
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-x-1 hover:text-[#ffd1b2] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Desktop Auth Links */}
        <ul className="hidden sm:flex items-center gap-x-4 font-medium">
          {!session ? (
            <>
              <li>
                <Link
                  href="/login"
                  className="flex items-center gap-x-1 hover:text-[#ffd1b2] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="flex items-center gap-x-1 hover:text-[#ffd1b2] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="text-white/80 text-sm">
                {session.user?.email || "Account"}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-1 hover:text-[#ffd1b2] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile: Contact Info Toggle Content */}
        {showMobileInfo && (
          <ul className="flex flex-col sm:hidden mt-2 gap-y-1 w-full text-white text-sm">
            <li className="flex items-center gap-x-1">
              <Headphones className="w-4 h-4" />
              <a href="tel:+254716261608" className="hover:underline">
                +254 716 261 608
              </a>
            </li>
            <li className="flex items-center gap-x-1">
              <Mail className="w-4 h-4" />
              <a href="mailto:sales-admin@dukasasa.co.ke" className="hover:underline">
                sales-admin@dukasasa.co.ke
              </a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeaderTop;
