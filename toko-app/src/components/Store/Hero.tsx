import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative isolate min-h-105 overflow-hidden text-blue-950 sm:min-h-115 lg:min-h-130">
      <Image
        src="/hero.jpg"
        alt="Setup komputer ByteStore"
        fill
        priority
        className="object-cover object-left sm:object-center"
      />

      <div className="absolute inset-0 bg-white/20" />

      <div className="relative z-10 mx-auto flex min-h-105 max-w-7xl items-center px-6 py-12 sm:min-h-115 lg:min-h-130">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-md backdrop-blur-sm sm:text-sm">
            Toko Produk & Periferal Komputer
          </p>
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Upgrade Setup, Tingkatkan Performa
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-blue-950 sm:text-lg">
            Temukan berbagai komponen PC dan periferal terbaik untuk kebutuhan
            gaming, kerja, dan sehari-hari.
          </p>

          <a
            href="#produk"
            className="mt-7 inline-flex rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Jelajahi Produk
          </a>
        </div>
      </div>
    </section>
  );
}
