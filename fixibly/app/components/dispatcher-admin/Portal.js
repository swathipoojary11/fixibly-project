"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }) {
  const el = useRef(null);
  if (!el.current && typeof document !== "undefined") {
    el.current = document.body;
  }
  if (!el.current) return null;
  return createPortal(children, el.current);
}
