module.exports = {
  brands: ["AMD", "Intel", "Nvidia", "Noctua", "Corsair", "Asus", "Samsung"],

  categories: [
    "CPU",
    "CPU Cooler",
    "Motherboard",
    "Memory",
    "Storage",
    "Video Card",
    "Case",
    "Power Supply",
  ],

  products: [
    {
      category: "CPU",
      name: "Intel Core i3 (12th Gen) i3-12100 Quad-core (4 Core) 3.30 GHz Processor",
      brand: "Intel",
      price: 122,
      image_url:
        "https://m.media-amazon.com/images/I/51S4TUZtF1L._AC_SL1500_.jpg",
      features: [
        { feature: "Total Cores", description: "4" },
        { feature: "# of Performance-cores", description: "4" },
        { feature: "# of Efficient-cores", description: "0" },
        { feature: "Total Threads", description: "8" },
        { feature: "Performance-core Base Frequency", description: "3.30 GHz" },
        { feature: "Max Turbo Frequency", description: "4.30 GHz" },
        { feature: "Processor Base Power", description: "60 W" },
        { feature: "Maximum Turbo Power", description: "89 W" },
        { feature: "Sockets Supported", description: "FCLGA17000" },
      ],
      stock: 35,
    },
    {
      category: "CPU",
      name: "Intel Core i5 (12th Gen) i5-12600K 10 (6P+4E) Cores up to 4.9 GHz Unlocked Processor",
      brand: "Intel",
      price: 143,
      image_url:
        "https://m.media-amazon.com/images/I/51gEF5jd3TL._AC_SL1039_.jpg",
      features: [
        { feature: "Total Cores", description: "10" },
        { feature: "# of Performance-cores", description: "6" },
        { feature: "# of Efficient-cores", description: "4" },
        { feature: "Total Threads", description: "16" },
        { feature: "Efficient-core Base Frequency", description: "2.80 GHz" },
        { feature: "Performance-core Base Frequency", description: "3.70 GHz" },
        { feature: "Max Turbo Frequency", description: "4.90 GHz" },
        { feature: "Processor Base Power", description: "125 W" },
        { feature: "Maximum Turbo Power", description: "150 W" },
        { feature: "Sockets Supported", description: "FCLGA17000" },
      ],
      stock: 50,
    },
    {
      category: "CPU",
      name: "Intel Core i7 (12th Gen) i7-12700K 12 (8P+4E) Cores up to 5.0 GHz Unlocked Processor",
      brand: "Intel",
      price: 409,
      image_url:
        "https://m.media-amazon.com/images/I/514VNpfgxIL._AC_SL1040_.jpg",
      features: [
        { feature: "Total Cores", description: "12" },
        { feature: "# of Performance-cores", description: "8" },
        { feature: "# of Efficient-cores", description: "4" },
        { feature: "Total Threads", description: "20" },
        { feature: "Efficient-core Base Frequency", description: "2.70 GHz" },
        { feature: "Performance-core Base Frequency", description: "3.60 GHz" },
        { feature: "Max Turbo Frequency", description: "5.00 GHz" },
        { feature: "Processor Base Power", description: "125 W" },
        { feature: "Maximum Turbo Power", description: "190 W" },
        { feature: "Sockets Supported", description: "FCLGA17000" },
      ],
      stock: 40,
    },
    {
      category: "CPU",
      name: "Intel Core i9 (12th Gen) i9-12900KS 16 (8P+8E) Cores Up to 5.5 GHz Unlocked Processor",
      brand: "Intel",
      price: 739,
      image_url:
        "https://m.media-amazon.com/images/I/61oiLbWvC-L._AC_SL1280_.jpg",
      features: [
        { feature: "Total Cores", description: "16" },
        { feature: "# of Performance-cores", description: "8" },
        { feature: "# of Efficient-cores", description: "8" },
        { feature: "Total Threads", description: "24" },
        { feature: "Efficient-core Base Frequency", description: "2.50 GHz" },
        { feature: "Performance-core Base Frequency", description: "3.40 GHz" },
        { feature: "Max Turbo Frequency", description: "5.50 GHz" },
        { feature: "Processor Base Power", description: "150 W" },
        { feature: "Maximum Turbo Power", description: "241 W" },
        { feature: "Sockets Supported", description: "FCLGA17000" },
      ],
      stock: 40,
    },
    {
      category: "CPU",
      name: "AMD Ryzen 5 5600X 6-core, 12-Thread Unlocked Processor",
      brand: "AMD",
      price: 199,
      image_url:
        "https://m.media-amazon.com/images/I/61vGQNUEsGL._AC_SL1384_.jpg",
      features: [
        { feature: "# of CPU Cores", description: "6" },
        { feature: "# of Threads", description: "12" },
        { feature: "Base Clock", description: "3.7 GHz" },
        { feature: "Max. Boost Clock", description: "4.6 GHz" },
        { feature: "Default TDP", description: "65 W" },
        { feature: "CPU Socket", description: "AM4" },
      ],
      stock: 20,
    },
    {
      category: "CPU",
      name: "AMD Ryzen 7 5800X3D 8-core, 16-Thread Unlocked Processor",
      brand: "AMD",
      price: 449,
      image_url:
        "https://m.media-amazon.com/images/I/61Kq99IRdcL._AC_SL1000_.jpg",
      features: [
        { feature: "# of CPU Cores", description: "8" },
        { feature: "# of Threads", description: "16" },
        { feature: "Base Clock", description: "3.4 GHz" },
        { feature: "Max. Boost Clock", description: "4.5 GHz" },
        { feature: "Default TDP", description: "105 W" },
        { feature: "CPU Socket", description: "AM4" },
      ],
      stock: 42,
    },
    {
      category: "CPU",
      name: "AMD Ryzen 9 5950X 16-core, 32-Thread Unlocked Processor",
      brand: "AMD",
      price: 799,
      image_url:
        "https://m.media-amazon.com/images/I/616VM20+AzL._AC_SL1384_.jpg",
      features: [
        { feature: "# of CPU Cores", description: "16" },
        { feature: "# of Threads", description: "32" },
        { feature: "Base Clock", description: "3.4 GHz" },
        { feature: "Max. Boost Clock", description: "4.9 GHz" },
        { feature: "Default TDP", description: "105 W" },
        { feature: "CPU Socket", description: "AM4" },
      ],
      stock: 39,
    },

    {
      category: "Motherboard",
      name: "ASUS Prime B660-PLUS D4 LGA 1700(Intel 12th Gen) ATX Motherboard",
      brand: "Asus",
      price: 139.99,
      image_url:
        "https://m.media-amazon.com/images/I/81ZFlUz0rTL._AC_SL1500_.jpg",
      features: [
        { feature: "CPU Socket", description: "LGA 1700" },
        { feature: "Memory", description: "4 x DIMM, Max. 128GB, DDR4" },
        { feature: "PCIe 4.0 x16 Slots", description: "1" },
        { feature: "M.2 Slots", description: "3" },
        { feature: "Wireless & Bluetooth", description: "M.2 slot only" },
      ],
      stock: 158,
    },
    {
      category: "Motherboard",
      name: "ASUS ROG Strix Z690-E Gaming WiFi 6E LGA 1700(Intel 12th Gen)ATX Gaming Motherboard",
      brand: "Asus",
      price: 469.99,
      image_url:
        "https://m.media-amazon.com/images/I/81hQTzzTLrL._AC_SL1500_.jpg",
      features: [
        { feature: "CPU Socket", description: "LGA 1700" },
        { feature: "Memory", description: "4 x DIMM, Max. 128GB, DDR5" },
        { feature: "PCIe 5.0 x16 Slots", description: "1" },
        { feature: "PCIe 4.0 x16 Slots", description: "1" },
        { feature: "M.2 Slots", description: "3" },
        {
          feature: "Wireless & Bluetooth",
          description: "Wi-Fi 6E & Bluetooth v5.2",
        },
      ],
      stock: 124,
    },
    {
      category: "Motherboard",
      name: "ASUS ROG Strix B550-A Gaming AMD AM4 Zen 3 Ryzen 5000 & 3rd Gen Ryzen ATX Gaming Motherboard",
      brand: "Asus",
      price: 179.99,
      image_url:
        "https://m.media-amazon.com/images/I/91LqAWWBgSL._AC_SL1500_.jpg",
      features: [
        { feature: "CPU Socket", description: "Socket AM4" },
        { feature: "Memory", description: "4 x DIMM, Max. 128GB, DDR4" },
        { feature: "PCIe 4.0 x16 Slots", description: "1" },
        { feature: "M.2 Slots", description: "2" },
      ],
      stock: 176,
    },
    {
      category: "Motherboard",
      name: "ASUS ROG Strix X570-E Gaming WiFi II AMD AM4 X570S ATX Gaming Motherboard",
      brand: "Asus",
      price: 379.99,
      image_url:
        "https://m.media-amazon.com/images/I/91nSHOFzwoL._AC_SL1500_.jpg",
      features: [
        { feature: "CPU Socket", description: "Socket AM4" },
        { feature: "Memory", description: "4 x DIMM, Max. 128GB, DDR4" },
        { feature: "PCIe 4.0 x16 Slots", description: "2" },
        { feature: "M.2 Slots", description: "2" },
        {
          feature: "Wireless & Bluetooth",
          description: "Wi-Fi 6E & Bluetooth v5.2",
        },
      ],
      stock: 154,
    },

    {
      category: "CPU Cooler",
      name: "Noctua NH-U12S chromax.Black, 120mm Single-Tower CPU Cooler (Black)",
      brand: "Noctua",
      price: 79.99,
      image_url:
        "https://m.media-amazon.com/images/I/81Qu6DEtTlL._AC_SL1500_.jpg",
      features: [
        { feature: "LGA1200, LGA115x Support", description: "✓" },
        { feature: "LGA1700 Support", description: "✓" },
        { feature: "AM4 Support", description: "✓" },
        { feature: "AM5 Support", description: "✓" },
      ],
      stock: 242,
    },

    {
      category: "Memory",
      name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 DRAM 3200MHz",
      brand: "Corsair",
      price: 74.99,
      image_url:
        "https://m.media-amazon.com/images/I/41a2jzudKtL._AC_SL1006_.jpg",
      features: [
        { feature: "Capacity", description: "16 GB" },
        { feature: "Memory Speed", description: "3200 MHz" },
        { feature: "RAM Memory Technology", description: "DDR4" },
        { feature: "Size", description: "16GB Kit (2x8GB)" },
      ],
      stock: 185,
    },
    {
      category: "Memory",
      name: "CORSAIR Vengeance DDR5 32GB (2x16GB) DDR5 5200MHz",
      brand: "Corsair",
      price: 184.99,
      image_url:
        "https://m.media-amazon.com/images/I/71W0l9URZOL._AC_SL1500_.jpg",
      features: [
        { feature: "Capacity", description: "32 GB" },
        { feature: "Memory Speed", description: "5200 MHz" },
        { feature: "RAM Memory Technology", description: "DDR5" },
        { feature: "Size", description: "32GB Kit (2x16GB)" },
      ],
      stock: 174,
    },

    {
      category: "Storage",
      name: "SAMSUNG 980 PRO SSD 1TB PCIe 4.0 NVMe Gen 4 Gaming M.2 Internal Solid State Hard Drive",
      brand: "Samsung",
      price: 119.99,
      image_url:
        "https://m.media-amazon.com/images/I/71qA45tWZ5L._AC_SL1500_.jpg",
      features: [
        { feature: "Digital Storage Capacity", description: "1 TB" },
        { feature: "Hardware Disk Interface", description: "NVMe" },
      ],
      stock: 282,
    },

    {
      category: "Video Card",
      name: "NVIDIA GeForce RTX 3060 Ti Founders Edition 8GB GDDR6 PCI Express 4.0 Graphics Card",
      brand: "Nvidia",
      price: 399.99,
      image_url:
        "https://m.media-amazon.com/images/I/81uFpNyjm5L._AC_SL1500_.jpg",
      features: [
        { feature: "Graphics RAM Type", description: "GDDR6" },
        { feature: "Graphics RAM Size", description: "8 GB" },
      ],
      stock: 360,
    },

    {
      category: "Case",
      name: "Corsair 4000D Airflow Tempered Glass Mid-Tower ATX PC Case - Black",
      brand: "Corsair",
      price: 104.99,
      image_url:
        "https://m.media-amazon.com/images/I/81hL4tPkXZL._AC_SL1500_.jpg",
      features: [
        { feature: "Material", description: "Steel, Tempered Glass, Plastic" },
        { feature: "Included Fans", description: "2" },
      ],
      stock: 327,
    },

    {
      category: "Power Supply",
      name: "CORSAIR RM Series (2021), RM850, 850 Watt, 80 Plus Gold Certified, Fully Modular Power Supply",
      brand: "Corsair",
      price: 114.99,
      image_url:
        "https://m.media-amazon.com/images/I/61hq35vqQwL._AC_SL1320_.jpg",
      features: [
        { feature: "Wattage", description: "850 watts" },
        { feature: "Fully Modular", description: "✓" },
        { feature: "Certification", description: "80 Plus Gold" },
      ],
      stock: 346,
    },
  ],
};
