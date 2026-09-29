import Link from "next/link";
import type { ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "dark";
  className?: string;
};

const variantClasses = {
  primary: "bg-blue-700 text-white hover:bg-blue-800",
  outline: "border border-blue-700 text-blue-700 hover:bg-blue-50",
  dark: "bg-gray-900 text-white hover:bg-blue-700",
};

export default function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
