import { PrismaClient } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient) {
  console.log('--- Seeding Brands ---');
  const brandNames = [
    "AMD",
    "ASUS",
    "Alienware",
    "Audio-Technica",
    "BenQ",
    "Bose",
    "Cooler Master",
    "Corsair",
    "Crucial",
    "EVGA",
    "Edifier",
    "Gigabyte",
    "Intel",
    "Kingston",
    "Lian Li",
    "Logitech",
    "MSI",
    "NZXT",
    "Noctua",
    "Phanteks",
    "Samsung",
    "Seasonic",
    "Sennheiser",
    "Sony",
    "SteelSeries",
    "Thermaltake",
    "ZOTAC"
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
        "name": "AMD Ryzen 9 5950X 16-core, 32-thread unlocked desktop processor",
        "description": "AMD Ryzen 9 5950X 16-core, 32-thread unlocked desktop processor.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Processor",
        "price": 7250000,
        "image": "https://m.media-amazon.com/images/I/616VM20+AzL._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "Intel Core i7-12700KF Gaming Desktop Processor 12 (8P+4E) Cores up to 5.0",
        "description": "Intel Core i7-12700KF Gaming Desktop Processor 12 (8P+4E) Cores up to 5.0 GHz Unlocked LGA1700 600 Series Chipset 125W.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Processor",
        "price": 4150000,
        "image": "https://m.media-amazon.com/images/I/51AqEkc2BuL._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "AMD Ryzen 7 5800X 8-core, 16-Thread Unlocked Desktop Processor",
        "description": "AMD Ryzen 7 5800X 8-core, 16-Thread Unlocked Desktop Processor.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Processor",
        "price": 3300000,
        "image": "https://m.media-amazon.com/images/I/61IIbwz-+ML._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "Intel Core i9-12900K Gaming Desktop Processor with Integrated Graphics and",
        "description": "Intel Core i9-12900K Gaming Desktop Processor with Integrated Graphics and 16 (8P+8E) Cores up to 5.2 GHz Unlocked LGA17.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Processor",
        "price": 5750000,
        "image": "https://m.media-amazon.com/images/I/619bhMyNXzL._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "Intel Core i7-12700K Gaming Desktop Processor with Integrated Graphics and",
        "description": "Intel Core i7-12700K Gaming Desktop Processor with Integrated Graphics and 12 (8P+4E) Cores up to 5.0 GHz Unlocked  LGA1.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Processor",
        "price": 4400000,
        "image": "https://m.media-amazon.com/images/I/51GYVerUgML._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "AMD Ryzen 5 5600G 6-Core 12-Thread Unlocked Desktop Processor with Radeon",
        "description": "AMD Ryzen 5 5600G 6-Core 12-Thread Unlocked Desktop Processor with Radeon Graphics.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Processor",
        "price": 1850000,
        "image": "https://m.media-amazon.com/images/I/51f2hkWjTlL._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "Intel Core i5-12600K Desktop Processor with Integrated Graphics and 10",
        "description": "Intel Core i5-12600K Desktop Processor with Integrated Graphics and 10 (6P+4E) Cores up to 4.9 GHz Unlocked LGA1700 600.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Processor",
        "price": 3450000,
        "image": "https://m.media-amazon.com/images/I/51QJsh7HAhL._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "AMD Ryzen 9 5900X 12-core, 24-Thread Unlocked Desktop Processor",
        "description": "AMD Ryzen 9 5900X 12-core, 24-Thread Unlocked Desktop Processor.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Processor",
        "price": 5250000,
        "image": "https://m.media-amazon.com/images/I/616VM20+AzL._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "Intel Core i5-13600K (Latest Gen) Desktop Processor 14 cores (6 P-cores + 8 E-cores) with Integrated Graphics",
        "description": "Intel Core i5-13600K (Latest Gen) Desktop Processor 14 cores (6 P-cores + 8 E-cores) with Integrated Graphics - Unlocked.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Processor",
        "price": 5100000,
        "image": "https://m.media-amazon.com/images/I/61lNEpDfdcL._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "Intel Core i9-13900KF (Latest Gen) Gaming Desktop Processor 24 cores (8 P-cores + 16 E-cores)",
        "description": "Intel Core i9-13900KF (Latest Gen) Gaming Desktop Processor 24 cores (8 P-cores + 16 E-cores) - Unlocked.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Processor",
        "price": 8600000,
        "image": "https://m.media-amazon.com/images/I/61-+pgXU1vL._AC_UL320_.jpg",
        "variants": [
            "Box Resmi",
            "Tray"
        ]
    },
    {
        "name": "GIGABYTE B650 AORUS Elite AX (AM5/ LGA 1718/ AMD B650/ ATX/ 5-Year",
        "description": "GIGABYTE B650 AORUS Elite AX (AM5/ LGA 1718/ AMD B650/ ATX/ 5-Year Warranty/ DDR5/ M.2/ PCIe 5.0/ USB 3.2 Gen2X2 Type-C/.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Motherboard",
        "price": 3200000,
        "image": "https://m.media-amazon.com/images/I/81vtcmUUsPL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "GIGABYTE Z790 AORUS Elite AX (LGA 1700/ Intel Z790/ ATX/ DDR5/ Quad M.2/",
        "description": "GIGABYTE Z790 AORUS Elite AX (LGA 1700/ Intel Z790/ ATX/ DDR5/ Quad M.2/ PCIe 5.0/ USB 3.2 Gen2X2 Type-C/Intel WiFi 6E/.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Motherboard",
        "price": 3850000,
        "image": "https://m.media-amazon.com/images/I/81tBFbXgi8L._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "ASUS ROG Maximus Z790 Hero (WiFi 6E) LGA 1700(Intel\u00ae13th&12th Gen) ATX",
        "description": "ASUS ROG Maximus Z790 Hero (WiFi 6E) LGA 1700(Intel\u00ae13th&12th Gen) ATX Gaming Motherboard(PCIe 5.0,DDR5,20+1power Stages.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Motherboard",
        "price": 9250000,
        "image": "https://m.media-amazon.com/images/I/81CpgF-+P4L._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "ASUS TUF Gaming Z790-Plus WiFi LGA 1700(Intel\u00ae12th&13th Gen) ATX Gaming",
        "description": "ASUS TUF Gaming Z790-Plus WiFi LGA 1700(Intel\u00ae12th&13th Gen) ATX Gaming Motherboard(PCIe 5.0,DDR5,4xM.2 Slots,16+1 DrMOS.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Motherboard",
        "price": 3550000,
        "image": "https://m.media-amazon.com/images/I/81rX0VhoStL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "MSI MAG B650 Tomahawk WiFi Gaming Motherboard (AMD AM5, ATX, DDR5, PCIe",
        "description": "MSI MAG B650 Tomahawk WiFi Gaming Motherboard (AMD AM5, ATX, DDR5, PCIe 4.0, M.2, SATA 6Gb/s, USB 3.2 Gen 2, HDMI/DP, Wi.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Motherboard",
        "price": 3500000,
        "image": "https://m.media-amazon.com/images/I/81k4xzo++EL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "ASUS TUF Gaming B650-PLUS WiFi Socket AM5 (LGA 1718) Ryzen 7000 ATX Gaming",
        "description": "ASUS TUF Gaming B650-PLUS WiFi Socket AM5 (LGA 1718) Ryzen 7000 ATX Gaming Motherboard(14 Power Stages, PCIe\u00ae 5.0 M.2 Su.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Motherboard",
        "price": 3450000,
        "image": "https://m.media-amazon.com/images/I/81ogi-krqkL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "ASUS ROG Strix Z790-E Gaming WiFi 6E LGA 1700(Intel\u00ae 12th&13th Gen) ATX",
        "description": "ASUS ROG Strix Z790-E Gaming WiFi 6E LGA 1700(Intel\u00ae 12th&13th Gen) ATX Gaming Motherboard(PCIe 5.0, DDR5,18+1 Power Sta.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Motherboard",
        "price": 7200000,
        "image": "https://m.media-amazon.com/images/I/81cQQqzPcSL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "GIGABYTE X670 AORUS Elite AX (AM5/ LGA 1718/ AMD/ X670/ ATX/ 5 Year",
        "description": "GIGABYTE X670 AORUS Elite AX (AM5/ LGA 1718/ AMD/ X670/ ATX/ 5 Year Warranty/ DDR5/ Quad M.2/ PCIe 5.0/ USB 3.2 Gen2X2 T.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Motherboard",
        "price": 4450000,
        "image": "https://m.media-amazon.com/images/I/81gJF9ViWiL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "ASUS ROG Strix X670E-E Gaming Socket AM5(LGA 1718) Ryzen 7000 ATX Gaming",
        "description": "ASUS ROG Strix X670E-E Gaming Socket AM5(LGA 1718) Ryzen 7000 ATX Gaming Motherboard(18+2 Power Stages,PCIe\u00ae 5.0, DDR,4x.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Motherboard",
        "price": 7500000,
        "image": "https://m.media-amazon.com/images/I/81ohPDfik0L._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "ASUS ROG STRIX Z790-H Gaming (WiFi 6E)LGA 1700(Intel\u00ae12&13th Gen)ATX",
        "description": "ASUS ROG STRIX Z790-H Gaming (WiFi 6E)LGA 1700(Intel\u00ae12&13th Gen)ATX gaming motherboard(DDR5 -7800 MT/s, PCIe 5.0 x16 wi.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Motherboard",
        "price": 4150000,
        "image": "https://m.media-amazon.com/images/I/81oTJSRKihL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Corsair 4000D Airflow Tempered Glass Mid-Tower ATX PC Case - Black",
        "description": "Corsair 4000D Airflow Tempered Glass Mid-Tower ATX PC Case - Black.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Corsair",
        "categoryName": "Casing",
        "price": 1700000,
        "image": "https://m.media-amazon.com/images/I/81hL4tPkXZL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Cooler Master MasterBox Q300L Micro-ATX Tower with Magnetic Design Dust",
        "description": "Cooler Master MasterBox Q300L Micro-ATX Tower with Magnetic Design Dust Filter, Transparent Acrylic Side Panel, Adjustab.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Cooler Master",
        "categoryName": "Casing",
        "price": 650000,
        "image": "https://m.media-amazon.com/images/I/81I9Ef0fOIL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Lian Li LI PC-O11 Dynamic EVO Snow White ATX Full Tower Gaming Computer Case",
        "description": "Lian Li LI PC-O11 Dynamic EVO Snow White ATX Full Tower Gaming Computer Case - O11DEW.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Lian Li",
        "categoryName": "Casing",
        "price": 2500000,
        "image": "https://m.media-amazon.com/images/I/61KmNQhuxvL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Corsair 5000D Airflow Tempered Glass Mid-Tower ATX PC Case - Black",
        "description": "Corsair 5000D Airflow Tempered Glass Mid-Tower ATX PC Case - Black.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Corsair",
        "categoryName": "Casing",
        "price": 2500000,
        "image": "https://m.media-amazon.com/images/I/81fki2HcyeL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "NZXT H7 Flow - CM-H71FB-01 - ATX Mid Tower PC Gaming Case - Front I/O USB",
        "description": "NZXT H7 Flow - CM-H71FB-01 - ATX Mid Tower PC Gaming Case - Front I/O USB Type-C Port - Quick-Release Tempered Glass Sid.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "NZXT",
        "categoryName": "Casing",
        "price": 2100000,
        "image": "https://m.media-amazon.com/images/I/71Gl13SGxwL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Lian-Li Lian Li PC-O11 Dynamic Blanc avec fenetre",
        "description": "Lian-Li Lian Li PC-O11 Dynamic Blanc avec fenetre.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Lian Li",
        "categoryName": "Casing",
        "price": 2400000,
        "image": "https://m.media-amazon.com/images/I/61xK8tIyW+L._AC_UY218_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Phanteks Eclipse G500A Mid Tower Case, DRGB, Black",
        "description": "Phanteks Eclipse G500A Mid Tower Case, DRGB, Black.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Phanteks",
        "categoryName": "Casing",
        "price": 2050000,
        "image": "https://m.media-amazon.com/images/I/81u-2GM7YLL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Corsair iCUE 5000X RGB Tempered Glass Mid-Tower ATX PC Smart Case - White",
        "description": "Corsair iCUE 5000X RGB Tempered Glass Mid-Tower ATX PC Smart Case - White.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Corsair",
        "categoryName": "Casing",
        "price": 3050000,
        "image": "https://m.media-amazon.com/images/I/716nFovNhSL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Lian Li LANCOOL II MESH C RGB-S USB Type-C Included Mid-Tower Snow White",
        "description": "Lian Li LANCOOL II MESH C RGB-S USB Type-C Included Mid-Tower Snow White - LAN2MRS.50.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Lian Li",
        "categoryName": "Casing",
        "price": 1500000,
        "image": "https://m.media-amazon.com/images/I/71SWMjHK2sL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Lian Li PC-O11DW 011 DYNAMIC tempered glass on the front Chassis body SECC",
        "description": "Lian Li PC-O11DW 011 DYNAMIC tempered glass on the front Chassis body SECC ATX Mid Tower Gaming Computer Case White, 1 u.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Lian Li",
        "categoryName": "Casing",
        "price": 2000000,
        "image": "https://m.media-amazon.com/images/I/61Owz2vYVdL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Gigabyte GeForce RTX 4090 Gaming OC 24G Graphics Card, 3X WINDFORCE Fans,",
        "description": "Gigabyte GeForce RTX 4090 Gaming OC 24G Graphics Card, 3X WINDFORCE Fans, 24GB 384-bit GDDR6X, GV-N4090GAMING OC-24GD Vi.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Gigabyte",
        "categoryName": "VGA",
        "price": 27200000,
        "image": "https://m.media-amazon.com/images/I/71-c7pJItDL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "ZOTAC Gaming GeForce RTX 4080 16GB Trinity OC GDDR6X 256-bit 22.4 Gbps",
        "description": "ZOTAC Gaming GeForce RTX 4080 16GB Trinity OC GDDR6X 256-bit 22.4 Gbps PCIE 4.0 Graphics Card, IceStorm 2.0 Advanced Coo.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "ZOTAC",
        "categoryName": "VGA",
        "price": 17450000,
        "image": "https://m.media-amazon.com/images/I/819pla7Wo3L._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "ZOTAC Gaming GeForce RTX 4070 Twin Edge OC Spider-Man: Across The",
        "description": "ZOTAC Gaming GeForce RTX 4070 Twin Edge OC Spider-Man: Across The Spider-Verse Inspired Graphics Card Bundle, ZT-D40700H.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "ZOTAC",
        "categoryName": "VGA",
        "price": 8800000,
        "image": "https://m.media-amazon.com/images/I/91-hC5aUfaL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "ZOTAC Gaming GeForce RTX 4090 AMP Extreme AIRO 24GB GDDR6X 384-bit 21 Gbps",
        "description": "ZOTAC Gaming GeForce RTX 4090 AMP Extreme AIRO 24GB GDDR6X 384-bit 21 Gbps PCIE 4.0 Graphics Card, IceStorm 3.0 Advanced.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "ZOTAC",
        "categoryName": "VGA",
        "price": 27200000,
        "image": "https://m.media-amazon.com/images/I/81G6dTVikpL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "MSI Gaming GeForce RTX 4090 24GB GDRR6X 384-Bit HDMI/DP Nvlink Torx Fan 5",
        "description": "MSI Gaming GeForce RTX 4090 24GB GDRR6X 384-Bit HDMI/DP Nvlink Torx Fan 5 Ada Lovelace Architecture Liquid Cool OC Graph.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "MSI",
        "categoryName": "VGA",
        "price": 28000000,
        "image": "https://m.media-amazon.com/images/I/717SsV2u7UL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "MSI Gaming GeForce RTX 4080 16GB GDRR6X 384-Bit HDMI/DP Nvlink Tri-Frozr 3",
        "description": "MSI Gaming GeForce RTX 4080 16GB GDRR6X 384-Bit HDMI/DP Nvlink Tri-Frozr 3 Ada Lovelace Architecture Graphics Card (Gami.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "MSI",
        "categoryName": "VGA",
        "price": 19300000,
        "image": "https://m.media-amazon.com/images/I/71kWtif0f-L._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Gigabyte GeForce RTX 4080 Gaming OC 16G Graphics Card, 3X WINDFORCE Fans,",
        "description": "Gigabyte GeForce RTX 4080 Gaming OC 16G Graphics Card, 3X WINDFORCE Fans, 16GB 256-bit GDDR6X, GV-N4080GAMING OC-16GD Vi.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Gigabyte",
        "categoryName": "VGA",
        "price": 19050000,
        "image": "https://m.media-amazon.com/images/I/71PCd5sJmPL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Gigabyte GeForce RTX 4070 Ti Gaming OC 12G Graphics Card, 3X WINDFORCE",
        "description": "Gigabyte GeForce RTX 4070 Ti Gaming OC 12G Graphics Card, 3X WINDFORCE Fans, 12GB 192-bit GDDR6X, GV-N407TGAMING OC-12GD.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Gigabyte",
        "categoryName": "VGA",
        "price": 13600000,
        "image": "https://m.media-amazon.com/images/I/71pMOzYWZTL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Sapphire 11323-02-20G Pulse AMD Radeon RX 7900 XT Gaming Graphics Card",
        "description": "Sapphire 11323-02-20G Pulse AMD Radeon RX 7900 XT Gaming Graphics Card with 20GB GDDR6, AMD RDNA 3.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "VGA",
        "price": 12800000,
        "image": "https://m.media-amazon.com/images/I/81n9vllhNeL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Gigabyte GV-N406TEAGLE-8GD GeForce RTX 4060 Ti Eagle 8G Graphics Card, 3X",
        "description": "Gigabyte GV-N406TEAGLE-8GD GeForce RTX 4060 Ti Eagle 8G Graphics Card, 3X WINDFORCE Fans, 8GB 128-bit GDDR6, Video Card.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Gigabyte",
        "categoryName": "VGA",
        "price": 6400000,
        "image": "https://m.media-amazon.com/images/I/71d1VbQA1dL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "G.SKILL Trident Z5 RGB Series (Intel XMP 3.0) DDR5 RAM 64GB (2x32GB) 6400MT/s CL32-39-39-102 1.40V Desktop Computer Memory UDIMM",
        "description": "G.SKILL Trident Z5 RGB Series (Intel XMP 3.0) DDR5 RAM 64GB (2x32GB) 6400MT/s CL32-39-39-102 1.40V Desktop Computer Memo.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "Intel",
        "categoryName": "RAM",
        "price": 3350000,
        "image": "https://m.media-amazon.com/images/I/51c+p6RY+AL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "CORSAIR VENGEANCE RGB DDR5 RAM 32GB (2x16GB) 6000MHz CL36 Intel XMP iCUE Compatible Computer Memory",
        "description": "CORSAIR VENGEANCE RGB DDR5 RAM 32GB (2x16GB) 6000MHz CL36 Intel XMP iCUE Compatible Computer Memory - Black (CMH32GX5M2D.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "Intel",
        "categoryName": "RAM",
        "price": 1900000,
        "image": "https://m.media-amazon.com/images/I/61L8HPVBoUL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "G.SKILL Trident Z5 RGB Series (Intel XMP 3.0) DDR5 RAM 32GB (2x16GB) 6000MT/s CL36-36-36-96 1.35V Desktop Computer Memory UDIMM",
        "description": "G.SKILL Trident Z5 RGB Series (Intel XMP 3.0) DDR5 RAM 32GB (2x16GB) 6000MT/s CL36-36-36-96 1.35V Desktop Computer Memor.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "Intel",
        "categoryName": "RAM",
        "price": 1600000,
        "image": "https://m.media-amazon.com/images/I/51c+p6RY+AL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "G.SKILL Trident Z5 Neo RGB Series (AMD Expo) DDR5 RAM 32GB (2x16GB) 6000MT/s CL30-38-38-96 1.35V Desktop Computer Memory UDIMM",
        "description": "G.SKILL Trident Z5 Neo RGB Series (AMD Expo) DDR5 RAM 32GB (2x16GB) 6000MT/s CL30-38-38-96 1.35V Desktop Computer Memory.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "AMD",
        "categoryName": "RAM",
        "price": 1850000,
        "image": "https://m.media-amazon.com/images/I/61mydyeMZEL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "G.SKILL Trident Z5 Neo RGB Series (AMD Expo) DDR5 RAM 64GB (2x32GB) 6000MT/s CL30-40-40-96 1.40V Desktop Computer Memory UDIMM",
        "description": "G.SKILL Trident Z5 Neo RGB Series (AMD Expo) DDR5 RAM 64GB (2x32GB) 6000MT/s CL30-40-40-96 1.40V Desktop Computer Memory.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "AMD",
        "categoryName": "RAM",
        "price": 3300000,
        "image": "https://m.media-amazon.com/images/I/61mydyeMZEL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "CORSAIR VENGEANCE DDR5 RAM 32GB (2x16GB) 6000MHz CL36 Intel XMP iCUE Compatible Computer Memory",
        "description": "CORSAIR VENGEANCE DDR5 RAM 32GB (2x16GB) 6000MHz CL36 Intel XMP iCUE Compatible Computer Memory - Black (CMK32GX5M2D6000.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "Intel",
        "categoryName": "RAM",
        "price": 1850000,
        "image": "https://m.media-amazon.com/images/I/71AV5PQu1yL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "CORSAIR VENGEANCE RGB DDR5 RAM 64GB (2x32GB) 6400MHz CL32 Intel XMP iCUE Compatible Computer Memory",
        "description": "CORSAIR VENGEANCE RGB DDR5 RAM 64GB (2x32GB) 6400MHz CL32 Intel XMP iCUE Compatible Computer Memory - Black (CMH64GX5M2B.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "Intel",
        "categoryName": "RAM",
        "price": 3500000,
        "image": "https://m.media-amazon.com/images/I/61XsKRKsGoL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "G.SKILL Trident Z5 RGB Series (Intel XMP 3.0) DDR5 RAM 32GB (2x16GB) 6400MT/s CL32-39-39-102 1.40V Desktop Computer Memory UDIMM",
        "description": "G.SKILL Trident Z5 RGB Series (Intel XMP 3.0) DDR5 RAM 32GB (2x16GB) 6400MT/s CL32-39-39-102 1.40V Desktop Computer Memo.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "Intel",
        "categoryName": "RAM",
        "price": 1850000,
        "image": "https://m.media-amazon.com/images/I/51c+p6RY+AL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "CORSAIR VENGEANCE DDR5 RAM 64GB (2x32GB) 5200MHz CL40 Intel XMP iCUE Compatible Computer Memory",
        "description": "CORSAIR VENGEANCE DDR5 RAM 64GB (2x32GB) 5200MHz CL40 Intel XMP iCUE Compatible Computer Memory - Black (CMK64GX5M2B5200.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "Intel",
        "categoryName": "RAM",
        "price": 2700000,
        "image": "https://m.media-amazon.com/images/I/61T907b5OaL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "G.SKILL Trident Z5 Neo RGB Series (AMD Expo) DDR5 RAM 32GB (2x16GB) 6000MT/s CL36-36-36-96 1.35V Desktop Computer Memory UDIMM",
        "description": "G.SKILL Trident Z5 Neo RGB Series (AMD Expo) DDR5 RAM 32GB (2x16GB) 6000MT/s CL36-36-36-96 1.35V Desktop Computer Memory.",
        "warrantyInfo": "Lifetime Warranty (Seumur Hidup)",
        "brandName": "AMD",
        "categoryName": "RAM",
        "price": 1600000,
        "image": "https://m.media-amazon.com/images/I/61n52HHAikL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Corsair RM850x (2021) Fully Modular ATX Power Supply",
        "description": "Corsair RM850x (2021) Fully Modular ATX Power Supply - 80 PLUS Gold - Low-Noise Fan - Zero RPM - Black.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "Corsair",
        "categoryName": "PSU",
        "price": 2150000,
        "image": "https://m.media-amazon.com/images/I/81k55rfk1iL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Corsair HX1500i, HXi Series, 80 PLUS Platinum Fully Modular Ultra-Low",
        "description": "Corsair HX1500i, HXi Series, 80 PLUS Platinum Fully Modular Ultra-Low Noise ATX Digital Power Supply (Triple EPS12V Conn.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "Corsair",
        "categoryName": "PSU",
        "price": 4300000,
        "image": "https://m.media-amazon.com/images/I/61UeJ-U1mSL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Corsair HX1000i Fully Modular Ultra-Low Noise ATX Power Supply",
        "description": "Corsair HX1000i Fully Modular Ultra-Low Noise ATX Power Supply - ATX 3.0 & PCIe 5.0 Compliant - Fluid Dynamic Bearing Fa.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "Corsair",
        "categoryName": "PSU",
        "price": 3850000,
        "image": "https://m.media-amazon.com/images/I/81qkLv+EvdL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "be quiet! Dark Power 13 1000W, 80 Plus Titanium Efficiency, ATX 3.0, PCIe 5, Modular, Power Supply",
        "description": "be quiet! Dark Power 13 1000W, 80 Plus Titanium Efficiency, ATX 3.0, PCIe 5, Modular, Power Supply - BN661.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "PSU",
        "price": 4300000,
        "image": "https://m.media-amazon.com/images/I/81HxCfuGyeL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Corsair RM750e (2023) Fully Modular Low-Noise Power Supply",
        "description": "Corsair RM750e (2023) Fully Modular Low-Noise Power Supply - ATX 3.0 & PCIe 5.0 Compliant - 105\u00b0C-Rated Capacitors - 80.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "Corsair",
        "categoryName": "PSU",
        "price": 1600000,
        "image": "https://m.media-amazon.com/images/I/71XeKGayJaL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Thermaltake Toughpower GF1 850W 80+ Gold SLI/ CrossFire Ready Ultra Quiet",
        "description": "Thermaltake Toughpower GF1 850W 80+ Gold SLI/ CrossFire Ready Ultra Quiet 140mm Hydraulic Bearing Smart Zero Fan Full Mo.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "Thermaltake",
        "categoryName": "PSU",
        "price": 1700000,
        "image": "https://m.media-amazon.com/images/I/71EBGPzoYkL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Seasonic FOCUS Plus 650 Gold SSR-650FX 650W 80+ Gold ATX12V & EPS12V Full",
        "description": "Seasonic FOCUS Plus 650 Gold SSR-650FX 650W 80+ Gold ATX12V & EPS12V Full Modular 120mm FDB Fan Compact 140mm Size Power.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "Seasonic",
        "categoryName": "PSU",
        "price": 1450000,
        "image": "https://m.media-amazon.com/images/I/81hQzo5V5XL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Seasonic FOCUS Plus 850 Gold SSR-850FX 850W 80+ Gold ATX12V & EPS12V Full",
        "description": "Seasonic FOCUS Plus 850 Gold SSR-850FX 850W 80+ Gold ATX12V & EPS12V Full Modular 120mm FDB Fan Compact 140 mm Size Powe.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "Seasonic",
        "categoryName": "PSU",
        "price": 2400000,
        "image": "https://m.media-amazon.com/images/I/81Lo+vS9QBL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "EVGA SuperNOVA 1600 T2 80+ TITANIUM, 1600W ECO Mode Fully Modular NVIDIA",
        "description": "EVGA SuperNOVA 1600 T2 80+ TITANIUM, 1600W ECO Mode Fully Modular NVIDIA SLI and Crossfire Ready 10 Year Warranty Power.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "EVGA",
        "categoryName": "PSU",
        "price": 2400000,
        "image": "https://m.media-amazon.com/images/I/71udOM0TfwL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "EVGA SuperNOVA 1300 G2 80+ GOLD, 1300W Fully Modular NVIDIA SLI and",
        "description": "EVGA SuperNOVA 1300 G2 80+ GOLD, 1300W Fully Modular NVIDIA SLI and Crossfire Ready 10 Year Warranty Power Supply 120-G2.",
        "warrantyInfo": "10 Tahun Resmi",
        "brandName": "EVGA",
        "categoryName": "PSU",
        "price": 4900000,
        "image": "https://m.media-amazon.com/images/I/71JwxzHnJ4L._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "SAMSUNG 980 PRO SSD with Heatsink 1TB PCIe Gen 4 NVMe M.2 Internal Solid",
        "description": "SAMSUNG 980 PRO SSD with Heatsink 1TB PCIe Gen 4 NVMe M.2 Internal Solid State Drive + 2mo Adobe CC Photography, Heat Co.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Samsung",
        "categoryName": "Storage",
        "price": 1100000,
        "image": "https://m.media-amazon.com/images/I/81L3oXKJFFL._AC_UL320_.jpg",
        "variants": [
            "Dengan Heatsink",
            "Tanpa Heatsink"
        ]
    },
    {
        "name": "Crucial P3 Plus 2TB PCIe Gen4 3D NAND NVMe M.2 SSD, up to 5000MB/s",
        "description": "Crucial P3 Plus 2TB PCIe Gen4 3D NAND NVMe M.2 SSD, up to 5000MB/s - CT2000P3PSSD8.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Crucial",
        "categoryName": "Storage",
        "price": 1300000,
        "image": "https://m.media-amazon.com/images/I/51k5wAFZgFL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Crucial T700 2TB Gen5 NVMe M.2 SSD",
        "description": "Crucial T700 2TB Gen5 NVMe M.2 SSD - Up to 12,400 MB/s - DirectStorage Enabled - CT2000T700SSD3 - Gaming, Photography, V.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Crucial",
        "categoryName": "Storage",
        "price": 4300000,
        "image": "https://m.media-amazon.com/images/I/51pITVAc8QL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Samsung 990 PRO M.2 2000 GB PCI Express 4.0 V-NAND MLC NVMe, W127158676",
        "description": "Samsung 990 PRO M.2 2000 GB PCI Express 4.0 V-NAND MLC NVMe, W127158676 (Express 4.0 V-NAND MLC NVMe).",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Samsung",
        "categoryName": "Storage",
        "price": 2900000,
        "image": "https://m.media-amazon.com/images/I/71ByVZ1x2vL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "SAMSUNG 980 PRO SSD 2TB PCIe NVMe Gen 4 Gaming M.2 Internal Solid State",
        "description": "SAMSUNG 980 PRO SSD 2TB PCIe NVMe Gen 4 Gaming M.2 Internal Solid State Drive Memory Card + 2mo Adobe CC Photography, Ma.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Samsung",
        "categoryName": "Storage",
        "price": 2000000,
        "image": "https://m.media-amazon.com/images/I/71KeDAkw+0L._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Samsung 990 PRO Series",
        "description": "Samsung 990 PRO Series - 2TB PCIe Gen4. X4 NVMe 2.0c - M.2 Internal SSD (MZ-V9P2T0B/AM).",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Samsung",
        "categoryName": "Storage",
        "price": 2150000,
        "image": "https://m.media-amazon.com/images/I/71OKHrYRkPL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Kingston Fury Renegade 2TB PCIe Gen 4.0 NVMe M.2 Internal Gaming SSD with",
        "description": "Kingston Fury Renegade 2TB PCIe Gen 4.0 NVMe M.2 Internal Gaming SSD with Heat Sink | PS5 Ready | Up to 7300MB/s | SFYRD.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Kingston",
        "categoryName": "Storage",
        "price": 2350000,
        "image": "https://m.media-amazon.com/images/I/71XsT+ayLrL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "SAMSUNG 990 Pro 1TB Gen4 NVMe SSD 7450MB/s 6900MB/s R/W 1550K/1200K IOPS",
        "description": "SAMSUNG 990 Pro 1TB Gen4 NVMe SSD 7450MB/s 6900MB/s R/W 1550K/1200K IOPS 600TBW 1.5M Hrs MTBF for PS5 5yrs.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Samsung",
        "categoryName": "Storage",
        "price": 1800000,
        "image": "https://m.media-amazon.com/images/I/71XHEQZZW+L._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "SAMSUNG 980 PRO SSD with Heatsink 1TB PCIe Gen 4 NVMe M.2 Internal Solid",
        "description": "SAMSUNG 980 PRO SSD with Heatsink 1TB PCIe Gen 4 NVMe M.2 Internal Solid State Hard Drive, Heat Control, Max Speed, PS5.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Samsung",
        "categoryName": "Storage",
        "price": 1100000,
        "image": "https://m.media-amazon.com/images/I/61Iu3tKOZHL._AC_UL320_.jpg",
        "variants": [
            "Dengan Heatsink",
            "Tanpa Heatsink"
        ]
    },
    {
        "name": "Samsung 980 PRO 1TB PCIe 4.0 NVME M.2 SSD (MZ-V8P1T0BW)",
        "description": "Samsung 980 PRO 1TB PCIe 4.0 NVME M.2 SSD (MZ-V8P1T0BW).",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Samsung",
        "categoryName": "Storage",
        "price": 1350000,
        "image": "https://m.media-amazon.com/images/I/61mrTohjNbL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Noctua NH-D15 chromax.Black, Dual-Tower CPU Cooler (140mm, Black)",
        "description": "Noctua NH-D15 chromax.Black, Dual-Tower CPU Cooler (140mm, Black).",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Noctua",
        "categoryName": "Cooler dan Fan",
        "price": 1900000,
        "image": "https://m.media-amazon.com/images/I/91t48GBv8TL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Corsair iCUE H150i Elite CAPELLIX XT Desktop Liquid CPU Cooler",
        "description": "Corsair iCUE H150i Elite CAPELLIX XT Desktop Liquid CPU Cooler - Three AF120 RGB Elite Fans - 360mm Radiator - Intel\u00ae LG.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Cooler dan Fan",
        "price": 2950000,
        "image": "https://m.media-amazon.com/images/I/7107JaxG7XL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "NZXT Kraken Elite RGB 360",
        "description": "NZXT Kraken Elite RGB 360 - RL-KR36E-W1 - 360mm AIO CPU Liquid Cooler - Customizable 2.36\" LCD Display for Images, Perfo.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "NZXT",
        "categoryName": "Cooler dan Fan",
        "price": 4800000,
        "image": "https://m.media-amazon.com/images/I/41VBuuOSSpL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "NZXT Kraken 240 - RL-KN240-B1 - 240mm AIO CPU Liquid Cooler - Customizable",
        "description": "NZXT Kraken 240 - RL-KN240-B1 - 240mm AIO CPU Liquid Cooler - Customizable 1.54\" Square LCD Display for Images, Performa.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "NZXT",
        "categoryName": "Cooler dan Fan",
        "price": 1350000,
        "image": "https://m.media-amazon.com/images/I/41yL3DM3dGL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Noctua NF-A12x25 PWM chromax.Black.swap, Premium Quiet Fan, 4-Pin (120mm, Black)",
        "description": "Noctua NF-A12x25 PWM chromax.Black.swap, Premium Quiet Fan, 4-Pin (120mm, Black).",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Noctua",
        "categoryName": "Cooler dan Fan",
        "price": 550000,
        "image": "https://m.media-amazon.com/images/I/91ma0CDm10L._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Noctua NH-D15, Premium CPU Cooler with 2x NF-A15 PWM 140mm Fans (Brown)",
        "description": "Noctua NH-D15, Premium CPU Cooler with 2x NF-A15 PWM 140mm Fans (Brown).",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Noctua",
        "categoryName": "Cooler dan Fan",
        "price": 1750000,
        "image": "https://m.media-amazon.com/images/I/91Hw1zcAIjL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Corsair iCUE H100i RGB Elite Liquid CPU Cooler (16 Dynamic RGB LEDs, 120mm",
        "description": "Corsair iCUE H100i RGB Elite Liquid CPU Cooler (16 Dynamic RGB LEDs, 120mm AF Elite Series FDB Fans, 240mm Radiator, iCU.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Corsair",
        "categoryName": "Cooler dan Fan",
        "price": 2250000,
        "image": "https://m.media-amazon.com/images/I/71Iogep6zTL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "DeepCool LT720 Liquid Cooler 360mm Multidimensional Infinity Mirror ARGB",
        "description": "DeepCool LT720 Liquid Cooler 360mm Multidimensional Infinity Mirror ARGB Block 300w TDP 4th Gen Dual-Chamber Pump 3100RP.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Cooler dan Fan",
        "price": 1500000,
        "image": "https://m.media-amazon.com/images/I/61SQU4CXKTL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "DeepCool AK620 CPU Air Cooler High-Performance 260w TDP 6 Copper Heat",
        "description": "DeepCool AK620 CPU Air Cooler High-Performance 260w TDP 6 Copper Heat Pipes Dual-Tower CPU Cooler with Fans Each 120mm P.",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Intel",
        "categoryName": "Cooler dan Fan",
        "price": 1000000,
        "image": "https://m.media-amazon.com/images/I/81oNtbH-3lL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Noctua NF-A12x25 PWM, Premium Quiet Fan, 4-Pin (120mm, Brown)",
        "description": "Noctua NF-A12x25 PWM, Premium Quiet Fan, 4-Pin (120mm, Brown).",
        "warrantyInfo": "5 Tahun Resmi",
        "brandName": "Noctua",
        "categoryName": "Cooler dan Fan",
        "price": 550000,
        "image": "https://m.media-amazon.com/images/I/81Bh89Q9fcL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "BenQ ZOWIE XL2731K 27-Inch 165Hz Gaming Monitor | 1080P | DyAc | PS5 &",
        "description": "BenQ ZOWIE XL2731K 27-Inch 165Hz Gaming Monitor | 1080P | DyAc | PS5 & Xbox 120FPS Compatible | Native Fast Response TN.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "BenQ",
        "categoryName": "Monitor",
        "price": 3200000,
        "image": "https://m.media-amazon.com/images/I/51YbGDdog+L._AC_UY218_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "LG UltraGear QHD 27-Inch Gaming Monitor 27GL83A-B",
        "description": "LG UltraGear QHD 27-Inch Gaming Monitor 27GL83A-B - IPS 1ms (GtG), with HDR 10 Compatibility, NVIDIA G-SYNC, and AMD Fre.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Monitor",
        "price": 4000000,
        "image": "https://m.media-amazon.com/images/I/81dAe2wXIqL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "SAMSUNG Odyssey G7 Series 32-Inch WQHD (2560x1440) Gaming Monitor, 240Hz,",
        "description": "SAMSUNG Odyssey G7 Series 32-Inch WQHD (2560x1440) Gaming Monitor, 240Hz, Curved, 1ms, HDMI, G-Sync, FreeSync Premium Pr.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Samsung",
        "categoryName": "Monitor",
        "price": 9500000,
        "image": "https://m.media-amazon.com/images/I/61r-XPKCzKL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Alienware AW3423DW Curved Gaming Monitor 34.18 inch Quantom Dot-OLED 1800R Display, 3440x1440 Pixels at 175Hz, True 0.1ms Gray-to-Gray, 1M:1 Contrast Ratio, 1.07 Billions Colors",
        "description": "Alienware AW3423DW Curved Gaming Monitor 34.18 inch Quantom Dot-OLED 1800R Display, 3440x1440 Pixels at 175Hz, True 0.1m.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "Alienware",
        "categoryName": "Monitor",
        "price": 19100000,
        "image": "https://m.media-amazon.com/images/I/61upssEyo5L._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "LG UltraGear QHD 34-Inch Curved Gaming Monitor 34GP63A-B, VA with HDR 10",
        "description": "LG UltraGear QHD 34-Inch Curved Gaming Monitor 34GP63A-B, VA with HDR 10 Compatibility and AMD FreeSync Premium, 160Hz,.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Monitor",
        "price": 5250000,
        "image": "https://m.media-amazon.com/images/I/81soN3bwVFL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "ASUS ROG Swift 27\u201d1440P OLED DSC Gaming Monitor (PG27AQDM)",
        "description": "ASUS ROG Swift 27\u201d1440P OLED DSC Gaming Monitor (PG27AQDM) - QHD (2560x1440), 240Hz, 0.03ms, G-SYNC Compatible, Anti-Gla.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "Monitor",
        "price": 16000000,
        "image": "https://m.media-amazon.com/images/I/71PGYEFoiuL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "ASUS TUF Gaming VG289Q1A 28\u201d Monitor, 4K UHD (3840 x 2160), IPS,",
        "description": "ASUS TUF Gaming VG289Q1A 28\u201d Monitor, 4K UHD (3840 x 2160), IPS, Adaptive-Sync/ FreeSync, Eye Care, DisplayPort HDMI, DC.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "Monitor",
        "price": 4600000,
        "image": "https://m.media-amazon.com/images/I/71fthNcHgJL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "ASUS TUF Gaming VG27VH1B 27\u201d Curved Monitor, 1080P Full HD, 165Hz",
        "description": "ASUS TUF Gaming VG27VH1B 27\u201d Curved Monitor, 1080P Full HD, 165Hz (Supports 144Hz), Extreme Low Motion Blur, Adaptive-sy.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "Monitor",
        "price": 2850000,
        "image": "https://m.media-amazon.com/images/I/81i6G0uoctL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "LG 32GN650-B Ultragear Gaming Monitor 32\u201d QHD (2560 x 1440) Display, 165Hz",
        "description": "LG 32GN650-B Ultragear Gaming Monitor 32\u201d QHD (2560 x 1440) Display, 165Hz Refresh Rate, 1ms MBR, HDR 10, sRGB 95% Color.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Monitor",
        "price": 4950000,
        "image": "https://m.media-amazon.com/images/I/51DG5X9vJlL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "LG 27GP950-B 27\u201d Ultragear UHD (3840 x 2160) Nano IPS Gaming Monitor w/1ms",
        "description": "LG 27GP950-B 27\u201d Ultragear UHD (3840 x 2160) Nano IPS Gaming Monitor w/1ms Response Time, 144Hz Refresh Rate, NVIDIA G-S.",
        "warrantyInfo": "3 Tahun Resmi",
        "brandName": "AMD",
        "categoryName": "Monitor",
        "price": 12850000,
        "image": "https://m.media-amazon.com/images/I/71pT6MAfXmS._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Razer DeathAdder V3 Pro Wireless Gaming Mouse: 63g Ultra Lightweight",
        "description": "Razer DeathAdder V3 Pro Wireless Gaming Mouse: 63g Ultra Lightweight - Focus Pro 30K Optical Sensor - Fast Optical Switc.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "Keyboard dan Mouse",
        "price": 2350000,
        "image": "https://m.media-amazon.com/images/I/61a3WCSv23L._AC_UY218_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Logitech G502 Lightspeed Wireless Gaming Mouse, Hero 25K Sensor, 25,600 DPI, RGB, Adjustable Weights, 11 Programmable Buttons, Long Battery Life, POWERPLAY-Compatible, PC/Mac",
        "description": "Logitech G502 Lightspeed Wireless Gaming Mouse, Hero 25K Sensor, 25,600 DPI, RGB, Adjustable Weights, 11 Programmable Bu.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "Keyboard dan Mouse",
        "price": 1500000,
        "image": "https://m.media-amazon.com/images/I/713BtzRtsVS._AC_UY218_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Logitech G502 Hero High Performance Gaming Mouse Special Edition, Hero 16K Sensor, 16 000 DPI, RGB, Adjustable Weights, 11 Programmable Buttons, On-Board Memory, PC/Mac",
        "description": "Logitech G502 Hero High Performance Gaming Mouse Special Edition, Hero 16K Sensor, 16 000 DPI, RGB, Adjustable Weights,.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "Keyboard dan Mouse",
        "price": 750000,
        "image": "https://m.media-amazon.com/images/I/61BZuQV0xzS._AC_UY218_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "SteelSeries Rival 600",
        "description": "SteelSeries Rival 600 - Gaming Mouse - 12,000 CPI TrueMove3+ Dual Optical Sensor - 0.05 Lift-Off Distance - Weight Syste.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "SteelSeries",
        "categoryName": "Keyboard dan Mouse",
        "price": 1050000,
        "image": "https://m.media-amazon.com/images/I/610oAxNTxSL._AC_UY218_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Logitech G502 Hero High Performance Wired Gaming Mouse, 25K Sensor, 25,600 DPI, RGB, Adjustable Weights, 11 Programmable Buttons, On-Board Memory, PC/Mac",
        "description": "Logitech G502 Hero High Performance Wired Gaming Mouse, 25K Sensor, 25,600 DPI, RGB, Adjustable Weights, 11 Programmable.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "Keyboard dan Mouse",
        "price": 2400000,
        "image": "https://m.media-amazon.com/images/I/516LT-kaCoL._AC_UY218_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Logitech G502 HERO High Performance Wired Gaming Mouse, HERO 25K Sensor,",
        "description": "Logitech G502 HERO High Performance Wired Gaming Mouse, HERO 25K Sensor, 25,600 DPI, RGB, Adjustable Weights, 11 Program.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "Keyboard dan Mouse",
        "price": 650000,
        "image": "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_UY218_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Logitech G PRO X SUPERLIGHT Wireless Gaming Mouse, Ultra-Lightweight, HERO 25K Sensor, 25,600 DPI, 5 Programmable Buttons, Long Battery Life, Compatible with PC / Mac",
        "description": "Logitech G PRO X SUPERLIGHT Wireless Gaming Mouse, Ultra-Lightweight, HERO 25K Sensor, 25,600 DPI, 5 Programmable Button.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "ASUS",
        "categoryName": "Keyboard dan Mouse",
        "price": 2100000,
        "image": "https://m.media-amazon.com/images/I/51uy8gOG-iL._AC_UY218_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Logitech G502 Lightspeed Wireless Gaming Mouse with Hero 25K Sensor, PowerPlay Compatible, Tunable Weights and Lightsync RGB",
        "description": "Logitech G502 Lightspeed Wireless Gaming Mouse with Hero 25K Sensor, PowerPlay Compatible, Tunable Weights and Lightsync.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Logitech",
        "categoryName": "Keyboard dan Mouse",
        "price": 1400000,
        "image": "https://m.media-amazon.com/images/I/718b9wK3eaL._AC_UY218_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "SteelSeries Apex Pro TKL HyperMagnetic Gaming Keyboard",
        "description": "SteelSeries Apex Pro TKL HyperMagnetic Gaming Keyboard - World's Fastest Keyboard - Adjustable Actuation - Esports Tenke.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "SteelSeries",
        "categoryName": "Keyboard dan Mouse",
        "price": 3050000,
        "image": "https://m.media-amazon.com/images/I/71aDZGDOwlL._AC_UY218_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "SteelSeries Apex Pro HyperMagnetic Gaming Keyboard \u2014 World's Fastest",
        "description": "SteelSeries Apex Pro HyperMagnetic Gaming Keyboard \u2014 World's Fastest Keyboard \u2014 Adjustable Actuation \u2014 OLED Screen \u2014 RGB.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "SteelSeries",
        "categoryName": "Keyboard dan Mouse",
        "price": 2850000,
        "image": "https://m.media-amazon.com/images/I/71HmUNj01VL._AC_UY218_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Bose QuietComfort 45 Wireless Bluetooth Noise Cancelling Headphones,",
        "description": "Bose QuietComfort 45 Wireless Bluetooth Noise Cancelling Headphones, Over-Ear Headphones with Microphone, Personalized N.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Bose",
        "categoryName": "Audio",
        "price": 5250000,
        "image": "https://m.media-amazon.com/images/I/51BsejsSTqL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Edifier G2000 32W PC Gaming Computer Speakers for Laptop Mac Desktop",
        "description": "Edifier G2000 32W PC Gaming Computer Speakers for Laptop Mac Desktop Computer Woofer Speakers Bluetooth USB 3.5mm AUX In.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Edifier",
        "categoryName": "Audio",
        "price": 1750000,
        "image": "https://m.media-amazon.com/images/I/618Y4gPJHOS._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Sennheiser HD 660S2 - Wired Audiophile Stereo Headphones with Deep Sub",
        "description": "Sennheiser HD 660S2 - Wired Audiophile Stereo Headphones with Deep Sub Bass, Optimized Surround, Transducer Airflow, Ven.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Sennheiser",
        "categoryName": "Audio",
        "price": 7500000,
        "image": "https://m.media-amazon.com/images/I/71orcWeKkpL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Audio-Technica ATH-M20X Professional Studio Monitor Headphones, Black",
        "description": "Audio-Technica ATH-M20X Professional Studio Monitor Headphones, Black.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Audio-Technica",
        "categoryName": "Audio",
        "price": 800000,
        "image": "https://m.media-amazon.com/images/I/71HlB-gf46L._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Sennheiser HD 599 Open Back Headphone, Ivory",
        "description": "Sennheiser HD 599 Open Back Headphone, Ivory.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Sennheiser",
        "categoryName": "Audio",
        "price": 1900000,
        "image": "https://m.media-amazon.com/images/I/61rC-yMhtZL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Audio-Technica ATH-M30x Professional Studio Monitor Headphones, Black",
        "description": "Audio-Technica ATH-M30x Professional Studio Monitor Headphones, Black.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Audio-Technica",
        "categoryName": "Audio",
        "price": 1100000,
        "image": "https://m.media-amazon.com/images/I/71vJ7T5VquL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Sennheiser HD 600 - Audiophile Hi-Res Open Back Dynamic Headphone, Black",
        "description": "Sennheiser HD 600 - Audiophile Hi-Res Open Back Dynamic Headphone, Black.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Sennheiser",
        "categoryName": "Audio",
        "price": 4800000,
        "image": "https://m.media-amazon.com/images/I/81op1KfxDBL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Sony WH-1000XM5/B Wireless Industry Leading Noise Canceling Bluetooth",
        "description": "Sony WH-1000XM5/B Wireless Industry Leading Noise Canceling Bluetooth Headphones (Renewed).",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Sony",
        "categoryName": "Audio",
        "price": 4700000,
        "image": "https://m.media-amazon.com/images/I/519OfcZ38qL._AC_UL320_.jpg",
        "variants": [
            "Default"
        ]
    },
    {
        "name": "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones - Black (Renewed)",
        "description": "Sony WH-1000XM4 Wireless Noise Canceling Overhead Headphones - Black (Renewed).",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Sony",
        "categoryName": "Audio",
        "price": 3850000,
        "image": "https://m.media-amazon.com/images/I/61ldeo9lYbL._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
    },
    {
        "name": "Audio-Technica ATH-M50xBT2 Wireless Over-Ear Headphones, Black",
        "description": "Audio-Technica ATH-M50xBT2 Wireless Over-Ear Headphones, Black.",
        "warrantyInfo": "2 Tahun Resmi",
        "brandName": "Audio-Technica",
        "categoryName": "Audio",
        "price": 3200000,
        "image": "https://m.media-amazon.com/images/I/71mniDSXh1L._AC_UL320_.jpg",
        "variants": [
            "Hitam",
            "Putih"
        ]
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
