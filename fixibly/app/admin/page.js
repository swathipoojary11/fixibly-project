"use client";
import AdminApp from "./AdminApp/page";
import { AdminStoreProvider } from "./AdminStore";

export default function AdminPage() {
  return (
    <AdminStoreProvider>
      <AdminApp />
    </AdminStoreProvider>
  );
}
