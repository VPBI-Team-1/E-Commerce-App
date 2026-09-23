import React from "react";
import StoreHeader from "@/components/Store/StoreHeader";
import StoreFooter from "@/components/Store/StoreFooter";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <StoreHeader />

      <main>{children}</main>

      <StoreFooter />
    </div>
  );
}
