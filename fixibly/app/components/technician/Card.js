import React from "react";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-[48px] border border-[#ECECEC] shadow-[0_32px_100px_rgba(15,23,42,0.08)] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
