import Link from "next/link";
import {
  LuFacebook,
  LuInstagram,
  LuMail,
  LuMapPin,
  LuPhone,
  LuYoutube,
} from "react-icons/lu";

const navigationLinks = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Tentang", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

export default function StoreFooter() {
  return (
    <footer className="bg-blue-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="rounded-lg bg-primary px-3 py-1 text-2xl font-bold">
              B
            </span>

            <span className="text-2xl font-bold">
              Byte<span className="text-primary">Store</span>
            </span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-6 text-blue-100">
            Temukan komponen PC dan periferal terbaik untuk membangun setup
            impianmu.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300">
            Navigasi
          </h2>

          <nav className="mt-4 flex flex-col items-start gap-3 text-sm text-blue-100">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300">
            Hubungi Kami
          </h2>

          <div className="mt-4 space-y-3 text-sm text-blue-100">
            <p className="flex items-center gap-3">
              <LuMail className="h-4 w-4 shrink-0" />
              support@bytestore.com
            </p>

            <p className="flex items-center gap-3">
              <LuPhone className="h-4 w-4 shrink-0" />
              +62 812-3456-7890
            </p>

            <p className="flex items-center gap-3">
              <LuMapPin className="h-4 w-4 shrink-0" />
              Jakarta, Indonesia
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram ByteStore"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-primary"
            >
              <LuInstagram className="h-5 w-5" />
            </Link>

            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube ByteStore"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-primary"
            >
              <LuYoutube className="h-5 w-5" />
            </Link>

            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook ByteStore"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-primary"
            >
              <LuFacebook className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-sm text-blue-200">
          Copyright 2026 ByteStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
