import React from "react";
import Header from "@/components/Store/Header";
import Footer from "@/components/Store/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />

      <main className="bg-gray-50">{children}</main>

      <Footer />
    </div>
  );
}
