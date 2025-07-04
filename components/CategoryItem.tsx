// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.2 (Updated for orange theme)
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href} className="transition-transform hover:scale-105">
      <div className="flex flex-col items-center gap-y-3 cursor-pointer bg-white py-6 px-4 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300">
        
        {/* Icon Container */}
        <div className="w-20 h-20 flex items-center justify-center bg-[#ffe7db] rounded-full p-3">
          {children}
        </div>

        {/* Category Title */}
        <h3 className="font-semibold text-lg text-center tracking-wide transition-colors text-[#ff5b00] group-hover:text-[#d64a00]">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryItem;