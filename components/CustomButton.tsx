// *********************
// Role of the component: Custom button component
// Name of the component: CustomButton.tsx
// Developer: Aleksandar Kuzmanovic (Modified)
// Version: 1.1
// Component call: <CustomButton paddingX={paddingX} paddingY={paddingY} text={text} buttonType={buttonType} customWidth={customWidth} textSize={textSize} disabled={true} />
// Input parameters: CustomButtonProps interface
// Output: Custom button with optional disabled state
// *********************

import React from "react";

interface CustomButtonProps {
  paddingX: number;
  paddingY: number;
  text: string;
  buttonType: "submit" | "reset" | "button";
  customWidth: string; // e.g. "full" or "no"
  textSize: string; // e.g. "sm", "md"
  disabled?: boolean;
  showSpinner?: boolean; // Optional spinner
}

const CustomButton = ({
  paddingX,
  paddingY,
  text,
  buttonType,
  customWidth,
  textSize,
  disabled = false,
  showSpinner = false,
}: CustomButtonProps) => {
  return (
    <button
      type={buttonType}
      disabled={disabled}
      className={`${
        customWidth !== "no" ? `w-${customWidth}` : ""
      } uppercase bg-white px-${paddingX} py-${paddingY} text-${textSize} border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {disabled && showSpinner ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        text
      )}
    </button>
  );
};

export default CustomButton;
