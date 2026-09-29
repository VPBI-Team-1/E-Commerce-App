import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export interface AdminBackButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export function AdminBackButton({
  label = "Kembali",
  href = "/admin/products",
  className = "",
}: AdminBackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg px-3.5 py-2 shadow-xs transition-colors hover:bg-gray-50 cursor-pointer ${className}`}
    >
      <ArrowLeftIcon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
