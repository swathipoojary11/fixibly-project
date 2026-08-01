"use client";
import DispatcherApp from "./DispatcherApp/page";
import { DispatcherStoreProvider } from "./DispatcherStore";

export default function DispatcherPage() {
  return (
    <DispatcherStoreProvider>
      <DispatcherApp />
    </DispatcherStoreProvider>
  );
}
