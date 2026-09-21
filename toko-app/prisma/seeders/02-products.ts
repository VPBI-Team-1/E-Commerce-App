import { PrismaClient } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient) {
  console.log('--- Seeding Brands ---');
  const brandNames = [
    'Intel', 'AMD', 'ASUS', 'MSI', 'Lian Li', 'NZXT', 'NVIDIA', 
    'Corsair', 'G.Skill', 'Seasonic', 'Samsung', 'Crucial', 
    'Noctua', 'Alienware', 'LG', 'Wooting', 'Logitech', 
    'Sennheiser', 'Edifier'
  ];
  
  const brandsMap: Record<string, string> = {};
  for (const name of brandNames) {
    const brand = await prisma.brand.create({ data: { name } });
    brandsMap[name] = brand.id;
  }

  console.log('--- Seeding Categories ---');
  const pcCategory = await prisma.category.create({ data: { name: 'Komponen PC' } });
  const peripheralCategory = await prisma.category.create({ data: { name: 'Peripherals dan Aksesoris' } });

  const subCategories = [
    { name: 'Processor', parentId: pcCategory.id },
    { name: 'Motherboard', parentId: pcCategory.id },
    { name: 'Casing', parentId: pcCategory.id },
    { name: 'VGA', parentId: pcCategory.id },
    { name: 'RAM', parentId: pcCategory.id },
    { name: 'PSU', parentId: pcCategory.id },
    { name: 'Storage', parentId: pcCategory.id },
    { name: 'Cooler dan Fan', parentId: pcCategory.id },
    { name: 'Monitor', parentId: peripheralCategory.id },
    { name: 'Keyboard dan Mouse', parentId: peripheralCategory.id },
    { name: 'Audio', parentId: peripheralCategory.id },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const sub of subCategories) {
    const created = await prisma.category.create({ data: sub });
    categoriesMap[sub.name] = created.id;
  }

  console.log('--- Seeding Products ---');

  const productsData = [
    {
      name: 'Intel Core i9-14900K',
      description: '24 Cores (8P+16E), 32 Threads, Up to 6.0 GHz, 36MB Intel Smart Cache, Socket LGA 1700, 125W Base Power.',
      warrantyInfo: '3 Tahun Resmi Intel',
      brandName: 'Intel',
      categoryName: 'Processor',
      price: 10500000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Intel+Core+i9-14900K',
      variants: ['Box', 'Tray (Tanpa Box)']
    },
    {
      name: 'AMD Ryzen 9 9950X',
      description: '16 Cores, 32 Threads, Up to 5.7 GHz, 80MB L2+L3 Cache, Socket AM5, 170W TDP, TSMC 4nm FinFET.',
      warrantyInfo: '3 Tahun Resmi AMD',
      brandName: 'AMD',
      categoryName: 'Processor',
      price: 12000000,
      image: 'https://dummyimage.com/600x600/000/fff&text=AMD+Ryzen+9+9950X',
      variants: ['Default']
    },
    {
      name: 'ASUS ROG Maximus Z790 Dark Hero',
      description: 'Form Factor ATX, LGA 1700, Z790 Chipset, 4x DDR5 up to 8000+ MHz (OC), PCIe 5.0, 5x M.2 Slots, Wi-Fi 7, 2.5G LAN.',
      warrantyInfo: '3 Tahun Resmi ASUS',
      brandName: 'ASUS',
      categoryName: 'Motherboard',
      price: 13000000,
      image: 'https://dummyimage.com/600x600/000/fff&text=ROG+Maximus+Z790+Dark+Hero',
      variants: ['Default']
    },
    {
      name: 'MSI MAG X670E TOMAHAWK WIFI',
      description: 'Form Factor ATX, Socket AM5, X670E Chipset, 4x DDR5, PCIe 5.0, 4x M.2 Slots, Wi-Fi 6E, 2.5G LAN.',
      warrantyInfo: '3 Tahun Resmi MSI',
      brandName: 'MSI',
      categoryName: 'Motherboard',
      price: 5800000,
      image: 'https://dummyimage.com/600x600/000/fff&text=MSI+MAG+X670E+TOMAHAWK+WIFI',
      variants: ['Default']
    },
    {
      name: 'Lian Li O11 Dynamic EVO XL',
      description: 'Full Tower, E-ATX/ATX/Micro-ATX/Mini-ITX, Tempered Glass Front & Side Panel, Support up to 3x 420mm Radiators, Reversible Chassis.',
      warrantyInfo: '1 Tahun Resmi',
      brandName: 'Lian Li',
      categoryName: 'Casing',
      price: 3800000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Lian+Li+O11+Dynamic+EVO+XL',
      variants: ['Hitam', 'Putih']
    },
    {
      name: 'NZXT H9 Flow',
      description: 'Mid Tower, ATX/Micro-ATX/Mini-ITX, Dual-Chamber Design, Tempered Glass, Include 4x 120mm Quiet Airflow Fans, Dual 360mm Radiator Support.',
      warrantyInfo: '2 Tahun Resmi',
      brandName: 'NZXT',
      categoryName: 'Casing',
      price: 2700000,
      image: 'https://dummyimage.com/600x600/000/fff&text=NZXT+H9+Flow',
      variants: ['Hitam', 'Putih']
    },
    {
      name: 'NVIDIA GeForce RTX 5090 Founders Edition',
      description: '32GB GDDR7, 512-bit Memory Interface, PCIe 5.0, DLSS 4.0, Ray Tracing Cores Gen 4, Tensor Cores Gen 5, DisplayPort 2.1.',
      warrantyInfo: '3 Tahun Resmi NVIDIA',
      brandName: 'NVIDIA',
      categoryName: 'VGA',
      price: 35000000,
      image: 'https://dummyimage.com/600x600/000/fff&text=RTX+5090+Founders+Edition',
      variants: ['Default']
    },
    {
      name: 'ASUS ROG Strix GeForce RTX 4080 SUPER OC Edition',
      description: '16GB GDDR6X, 256-bit, PCIe 4.0, Boost Clock 2670 MHz, 3x Axial-tech Fans, Aura Sync ARGB, 3.5 Slot Design.',
      warrantyInfo: '3 Tahun Resmi ASUS',
      brandName: 'ASUS',
      categoryName: 'VGA',
      price: 22000000,
      image: 'https://dummyimage.com/600x600/000/fff&text=ROG+Strix+RTX+4080+SUPER',
      variants: ['Default']
    },
    {
      name: 'Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5 6400MHz',
      description: '64GB (2x32GB), DDR5, 6400MT/s, CL32, XMP 3.0, Patented DHX Cooling, Swappable Top Bars, RGB Lighting.',
      warrantyInfo: 'Lifetime Warranty (Seumur Hidup)',
      brandName: 'Corsair',
      categoryName: 'RAM',
      price: 6500000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Corsair+Dominator+Titanium',
      variants: ['Hitam', 'Putih']
    },
    {
      name: 'G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5 6000MHz',
      description: '32GB (2x16GB), DDR5, 6000MT/s, CL30, AMD EXPO (Optimized for AMD), Matte Black, RGB Lighting.',
      warrantyInfo: 'Lifetime Warranty (Seumur Hidup)',
      brandName: 'G.Skill',
      categoryName: 'RAM',
      price: 2300000,
      image: 'https://dummyimage.com/600x600/000/fff&text=G.Skill+Trident+Z5+Neo',
      variants: ['Default']
    },
    {
      name: 'Seasonic Vertex GX-1200',
      description: '1200W, 80 Plus Gold, Fully Modular, ATX 3.0 & PCIe 5.0 Ready (12VHPWR Cable Included), 135mm FDB Fan.',
      warrantyInfo: '10 Tahun Resmi Seasonic',
      brandName: 'Seasonic',
      categoryName: 'PSU',
      price: 4200000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Seasonic+Vertex+GX-1200',
      variants: ['Default']
    },
    {
      name: 'Corsair RM850x Shift',
      description: '850W, 80 Plus Gold, Fully Modular, Side-Mounted Connections (Type 5 Gen 1 Micro-Fit), ATX 3.0 Compatible, 140mm FDB Fan.',
      warrantyInfo: '10 Tahun Resmi Corsair',
      brandName: 'Corsair',
      categoryName: 'PSU',
      price: 2600000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Corsair+RM850x+Shift',
      variants: ['Default']
    },
    {
      name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD',
      description: '2TB Capacity, NVMe PCIe 4.0 x4, Sequential Read up to 7,450 MB/s, Sequential Write up to 6,900 MB/s, V-NAND TLC.',
      warrantyInfo: '5 Tahun Resmi',
      brandName: 'Samsung',
      categoryName: 'Storage',
      price: 3400000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Samsung+990+PRO+2TB',
      variants: ['Dengan Heatsink', 'Tanpa Heatsink']
    },
    {
      name: 'Crucial T705 2TB PCIe 5.0 NVMe M.2 SSD',
      description: '2TB Capacity, NVMe PCIe 5.0 x4, Sequential Read up to 14,500 MB/s, Sequential Write up to 12,700 MB/s, Premium Aluminum Heatsink.',
      warrantyInfo: '5 Tahun Resmi',
      brandName: 'Crucial',
      categoryName: 'Storage',
      price: 5800000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Crucial+T705+2TB',
      variants: ['Default']
    },
    {
      name: 'NZXT Kraken Elite 360 RGB',
      description: '360mm AIO Liquid Cooler, 2.36" LCD Display (60Hz), 3x 120mm F120 RGB Core Fans, Asetek 7th Gen Pump.',
      warrantyInfo: '6 Tahun Resmi',
      brandName: 'NZXT',
      categoryName: 'Cooler dan Fan',
      price: 5000000,
      image: 'https://dummyimage.com/600x600/000/fff&text=NZXT+Kraken+Elite+360+RGB',
      variants: ['Hitam', 'Putih']
    },
    {
      name: 'Noctua NF-A12x25 PWM',
      description: '120mm Premium Quiet Fan, SSO2 Bearing, 450-2000 RPM, 60 CFM, 22.6 dB(A), 4-pin PWM, Anti-Vibration Pads.',
      warrantyInfo: '6 Tahun Resmi',
      brandName: 'Noctua',
      categoryName: 'Cooler dan Fan',
      price: 550000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Noctua+NF-A12x25+PWM',
      variants: ['Coklat Tradisional', 'Chromax Black']
    },
    {
      name: 'Alienware AW3225QF',
      description: '32 Inch, 4K (3840 x 2160), QD-OLED Panel, 240Hz Refresh Rate, 0.03ms (GtG) Response Time, NVIDIA G-SYNC Compatible, Dolby Vision, Curved 1700R.',
      warrantyInfo: '3 Tahun Resmi (Termasuk Burn-in)',
      brandName: 'Alienware',
      categoryName: 'Monitor',
      price: 19500000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Alienware+AW3225QF',
      variants: ['Default']
    },
    {
      name: 'LG UltraGear 27GR95QE-B',
      description: '27 Inch, QHD (2560 x 1440), OLED Panel, 240Hz Refresh Rate, 0.03ms Response Time, HDR10, AMD FreeSync Premium, HDMI 2.1.',
      warrantyInfo: '2 Tahun Resmi',
      brandName: 'LG',
      categoryName: 'Monitor',
      price: 14000000,
      image: 'https://dummyimage.com/600x600/000/fff&text=LG+UltraGear+27GR95QE-B',
      variants: ['Default']
    },
    {
      name: 'Wooting 60HE+',
      description: '60% Layout, Lekker Linear Switches (Magnetic Hall Effect), Rapid Trigger, Adjustable Actuation Point (0.1mm - 4.0mm), PBT Keycaps, Web-based Wootility.',
      warrantyInfo: '4 Tahun Resmi',
      brandName: 'Wooting',
      categoryName: 'Keyboard dan Mouse',
      price: 4200000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Wooting+60HE%2B',
      variants: ['Default']
    },
    {
      name: 'Logitech G Pro X Superlight 2',
      description: 'Wireless Gaming Mouse, 60g Ultra-lightweight, HERO 2 Sensor (32K DPI, 500 IPS), LIGHTFORCE Hybrid Switches, USB-C, 95 Hours Battery.',
      warrantyInfo: '2 Tahun Resmi',
      brandName: 'Logitech',
      categoryName: 'Keyboard dan Mouse',
      price: 2400000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Logitech+G+Pro+X+Superlight+2',
      variants: ['Hitam', 'Putih', 'Magenta']
    },
    {
      name: 'Sennheiser HD 560S',
      description: 'Over-Ear Open Back Headphones, 120 Ohm Impedance, 6 Hz to 38 kHz Frequency Response, Reference-Grade Audio, Detachable Cable.',
      warrantyInfo: '2 Tahun Resmi',
      brandName: 'Sennheiser',
      categoryName: 'Audio',
      price: 3200000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Sennheiser+HD+560S',
      variants: ['Default']
    },
    {
      name: 'Edifier S3000 Pro',
      description: 'Active 2.0 Wireless Monitor Speakers, Hi-Res Audio Certified, Planar Diaphragm Tweeters, 6.5" Aluminum Alloy Bass Drivers, Bluetooth 5.0 aptX HD, 256W RMS.',
      warrantyInfo: '1 Tahun Resmi',
      brandName: 'Edifier',
      categoryName: 'Audio',
      price: 11000000,
      image: 'https://dummyimage.com/600x600/000/fff&text=Edifier+S3000+Pro',
      variants: ['Default']
    }
  ];

  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        warrantyInfo: p.warrantyInfo,
        brandId: brandsMap[p.brandName],
        categoryId: categoriesMap[p.categoryName],
        images: {
          create: [{ url: p.image, isPrimary: true }]
        },
        variants: {
          create: p.variants.map((v) => ({
            name: v,
            price: p.price,
            stock: 10
          }))
        }
      }
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log('Products seeded successfully!');
}
