"use client";
import React from "react";

function Button({ children, onClick, variant = "primary", className = "", disabled = false, type = "button" }) {
  const variants = {
    primary:   "bg-[#112E81] hover:bg-[#4343B8] text-white shadow-md hover:shadow-lg",
    secondary: "bg-[#A9D2DE] hover:bg-[#4085E6] text-[#112E81] hover:text-white",
    outline:   "border border-[#112E81] text-[#112E81] hover:bg-[#112E81] hover:text-white",
    danger:    "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
