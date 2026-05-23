const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

// Reliable Unsplash URLs with auto=format&fit=crop for max compatibility
const u = (id, w = 500) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${w}&fit=crop&auto=format&q=80`;

const products = [
  // ===== MOBILES =====
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Experience the ultimate Galaxy with the S24 Ultra. Featuring a 6.8" Dynamic AMOLED display, built-in S Pen, and 200MP camera system for exceptional photography.',
    price: 124999, originalPrice: 134999, discountPercent: 7,
    category: 'Mobiles', brand: 'Samsung',
    images: [
      u('1610945415295-d9bbf067e59c'),
      u('1511707171634-5f897ff02aa9'),
      u('1592750475338-74b7b21085ab'),
    ],
    stock: 50, rating: 4.6, reviewCount: 3421,
    specifications: new Map([
      ['Display', '6.8" Dynamic AMOLED 2X, 120Hz'],
      ['Processor', 'Snapdragon 8 Gen 3'],
      ['RAM', '12 GB'], ['Storage', '256 GB'],
      ['Camera', '200MP + 50MP + 10MP + 12MP'],
      ['Battery', '5000 mAh'], ['OS', 'Android 14 (One UI 6.1)'],
    ]),
    tags: ['flagship', '5g', 'android'], isFeatured: true,
  },
  {
    name: 'Apple iPhone 15 Pro',
    description: 'iPhone 15 Pro. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    price: 134900, originalPrice: 139900, discountPercent: 4,
    category: 'Mobiles', brand: 'Apple',
    images: [
      u('1632661674596-df8be070a5c5'),
      u('1556656793-08538906a9f8'),
      u('1512941937669-90a1b58e7e9c'),
    ],
    stock: 35, rating: 4.7, reviewCount: 5612,
    specifications: new Map([
      ['Display', '6.1" Super Retina XDR OLED'],
      ['Processor', 'Apple A17 Pro'],
      ['RAM', '8 GB'], ['Storage', '128 GB'],
      ['Camera', '48MP + 12MP + 12MP'],
      ['Battery', '3274 mAh'], ['OS', 'iOS 17'],
    ]),
    tags: ['flagship', '5g', 'ios'], isFeatured: true,
  },
  {
    name: 'OnePlus 12R 5G',
    description: 'Powered by Snapdragon 8 Gen 1 with 100W SUPERVOOC charging. Features a stunning 6.78" Fluid AMOLED display with 120Hz refresh rate.',
    price: 39999, originalPrice: 44999, discountPercent: 11,
    category: 'Mobiles', brand: 'OnePlus',
    images: [
      u('1598327105666-5b89351aff97'),
      u('1533228100845-08145b01de14'),
    ],
    stock: 80, rating: 4.4, reviewCount: 2187,
    specifications: new Map([
      ['Display', '6.78" Fluid AMOLED, 120Hz'],
      ['Processor', 'Snapdragon 8 Gen 1'],
      ['RAM', '8 GB'], ['Storage', '128 GB'],
      ['Battery', '5400 mAh, 100W charging'],
      ['OS', 'OxygenOS 14 (Android 14)'],
    ]),
    tags: ['5g', 'fast-charging', 'android'], isFeatured: false,
  },
  {
    name: 'Redmi Note 13 Pro+ 5G',
    description: '200MP OIS camera, 120W HyperCharge, and Dimensity 7200 Ultra. A powerhouse mid-range phone with premium features.',
    price: 29999, originalPrice: 34999, discountPercent: 14,
    category: 'Mobiles', brand: 'Xiaomi',
    images: [
      u('1601784551446-20c9e07cdbdb'),
      u('1574944985070-8f3ebaebf9b9'),
    ],
    stock: 120, rating: 4.3, reviewCount: 4532,
    specifications: new Map([
      ['Display', '6.67" AMOLED, 120Hz'],
      ['Processor', 'Dimensity 7200 Ultra'],
      ['RAM', '8 GB'], ['Storage', '256 GB'],
      ['Camera', '200MP + 8MP + 2MP'],
      ['Battery', '5000 mAh, 120W charging'],
    ]),
    tags: ['5g', 'mid-range', 'camera-phone'], isFeatured: true,
  },

  // ===== ELECTRONICS =====
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling with 8 microphones. Up to 30-hour battery life.',
    price: 26990, originalPrice: 34990, discountPercent: 23,
    category: 'Electronics', brand: 'Sony',
    images: [
      u('1505740420928-5e560c06d30e'),
      u('1583394838336-acd977736f90'),
      u('1484704849700-f032a568e944'),
    ],
    stock: 60, rating: 4.7, reviewCount: 8934,
    specifications: new Map([
      ['Type', 'Over-ear, Wireless'], ['Driver Size', '30mm'],
      ['Frequency Response', '4Hz – 40,000Hz'], ['Battery Life', '30 hours'],
      ['Connectivity', 'Bluetooth 5.2'], ['Weight', '250g'],
    ]),
    tags: ['noise-canceling', 'wireless', 'premium-audio'], isFeatured: true,
  },
  {
    name: 'Samsung 65" 4K QLED Smart TV',
    description: 'Quantum HDR 12X, Neo Quantum Processor 4K, Object Tracking Sound+. Experience cinema-quality picture right in your living room.',
    price: 89999, originalPrice: 129999, discountPercent: 31,
    category: 'Electronics', brand: 'Samsung',
    images: [
      u('1593784991095-a205069470b6'),
      u('1461151304267-38535e780c79'),
    ],
    stock: 25, rating: 4.5, reviewCount: 1876,
    specifications: new Map([
      ['Screen Size', '65 inches'], ['Resolution', '4K Ultra HD (3840x2160)'],
      ['HDR', 'Quantum HDR 12X'], ['Smart Features', 'Tizen OS, Alexa Built-in'],
      ['Refresh Rate', '120Hz'], ['HDMI Ports', '4'],
    ]),
    tags: ['4k', 'smart-tv', 'qled'], isFeatured: true,
  },
  {
    name: 'boAt Rockerz 450 Bluetooth Headset',
    description: 'Enjoy music on the go with up to 15 hours of playback, 40mm dynamic drivers, and padded ear cushions for all-day comfort.',
    price: 1299, originalPrice: 3990, discountPercent: 67,
    category: 'Electronics', brand: 'boAt',
    images: [
      u('1618366712010-f4ae9c647dcb'),
      u('1484704849700-f032a568e944'),
    ],
    stock: 200, rating: 4.1, reviewCount: 21456,
    specifications: new Map([
      ['Type', 'On-ear, Wireless'], ['Driver Size', '40mm'],
      ['Battery Life', '15 hours'], ['Connectivity', 'Bluetooth 5.0'],
      ['Weight', '180g'],
    ]),
    tags: ['budget', 'wireless', 'bass'], isFeatured: false,
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera',
    description: 'The perfect everyday camera for creators. 24.2MP APS-C sensor, 4K video, Dual Pixel CMOS AF II for fast and accurate autofocus.',
    price: 66990, originalPrice: 74990, discountPercent: 11,
    category: 'Electronics', brand: 'Canon',
    images: [
      u('1502920917128-1aa500764cbd'),
      u('1516035069371-29a1b244cc32'),
    ],
    stock: 18, rating: 4.6, reviewCount: 987,
    specifications: new Map([
      ['Sensor', '24.2MP APS-C CMOS'], ['Processor', 'DIGIC X'],
      ['ISO Range', '100-32000'], ['Video', '4K 30fps, Full HD 120fps'],
      ['AF Points', '651 AF zones'], ['Weight', '375g'],
    ]),
    tags: ['mirrorless', 'camera', 'photography', '4k'], isFeatured: false,
  },
  {
    name: 'Dell 27" IPS Monitor',
    description: 'Full HD IPS display with 75Hz refresh rate, HDMI & VGA connectivity. Flicker-free and ComfortView for eye comfort during long work sessions.',
    price: 13999, originalPrice: 18999, discountPercent: 26,
    category: 'Electronics', brand: 'Dell',
    images: [
      u('1527443224154-c4a573d5f5c5'),
      u('1586210579191-33b45e38fa2c'),
    ],
    stock: 35, rating: 4.5, reviewCount: 6543,
    specifications: new Map([
      ['Size', '27 inches'], ['Resolution', 'Full HD (1920x1080)'],
      ['Panel Type', 'IPS'], ['Refresh Rate', '75Hz'],
      ['Response Time', '5ms'], ['Ports', 'HDMI 1.4, VGA, 4x USB'],
    ]),
    tags: ['monitor', 'ips', 'full-hd', 'office'], isFeatured: false,
  },
  {
    name: 'Skullcandy Crusher ANC 2 Headphones',
    description: 'Immersive adjustable bass, active noise canceling, 50-hour battery. Feel the music like never before.',
    price: 14999, originalPrice: 21999, discountPercent: 32,
    category: 'Electronics', brand: 'Skullcandy',
    images: [
      u('1583394838336-acd977736f90'),
      u('1505740420928-5e560c06d30e'),
    ],
    stock: 40, rating: 4.3, reviewCount: 2134,
    specifications: new Map([
      ['Type', 'Over-ear, Wireless'], ['Battery Life', '50 hours'],
      ['ANC', 'Yes'], ['Connectivity', 'Bluetooth 5.2'],
    ]),
    tags: ['headphones', 'anc', 'bass'], isFeatured: false,
  },

  // ===== LAPTOPS =====
  {
    name: 'Apple MacBook Air M2',
    description: 'MacBook Air with M2 chip. Supercharged by the next-generation M2 chip, MacBook Air moves everything forward. Up to 18 hours of battery life.',
    price: 114900, originalPrice: 119900, discountPercent: 4,
    category: 'Laptops', brand: 'Apple',
    images: [
      u('1517336714731-489689fd1ca8'),
      u('1611186871525-279d7b6ca248'),
    ],
    stock: 40, rating: 4.8, reviewCount: 7821,
    specifications: new Map([
      ['Processor', 'Apple M2 chip'], ['RAM', '8 GB Unified Memory'],
      ['Storage', '256 GB SSD'], ['Display', '13.6" Liquid Retina, 2560x1664'],
      ['Battery', 'Up to 18 hours'], ['Weight', '1.24 kg'],
    ]),
    tags: ['ultrabook', 'macos', 'premium'], isFeatured: true,
  },
  {
    name: 'HP Victus 15 Gaming Laptop',
    description: 'Intel Core i5-12450H, NVIDIA GeForce RTX 3050 4GB, 16GB RAM, 512GB SSD. Game-ready with a 144Hz FHD display.',
    price: 59999, originalPrice: 74999, discountPercent: 20,
    category: 'Laptops', brand: 'HP',
    images: [
      u('1588872657578-7efd81f3ab8b'),
      u('1603302576837-37561b2e2302'),
    ],
    stock: 55, rating: 4.3, reviewCount: 3254,
    specifications: new Map([
      ['Processor', 'Intel Core i5-12450H'],
      ['GPU', 'NVIDIA GeForce RTX 3050 4GB'],
      ['RAM', '16 GB DDR5'], ['Storage', '512 GB SSD'],
      ['Display', '15.6" FHD 144Hz IPS'], ['OS', 'Windows 11 Home'],
    ]),
    tags: ['gaming', 'laptop', 'rtx'], isFeatured: true,
  },
  {
    name: 'Lenovo IdeaPad Slim 3',
    description: 'Powered by AMD Ryzen 5 7520U, 8GB RAM, and 512GB SSD. Thin and light design for everyday computing.',
    price: 34990, originalPrice: 42990, discountPercent: 19,
    category: 'Laptops', brand: 'Lenovo',
    images: [
      u('1496181133206-80ce9b88a853'),
      u('1593642632559-0c6d3fc62b89'),
    ],
    stock: 70, rating: 4.2, reviewCount: 5123,
    specifications: new Map([
      ['Processor', 'AMD Ryzen 5 7520U'], ['RAM', '8 GB LPDDR5'],
      ['Storage', '512 GB SSD'], ['Display', '15.6" FHD IPS'],
      ['Battery', 'Up to 9 hours'], ['OS', 'Windows 11 Home'],
    ]),
    tags: ['budget-laptop', 'amd', 'student'], isFeatured: false,
  },

  // ===== FASHION =====
  {
    name: "Levi's Men's 511 Slim Jeans",
    description: 'Slim through the thigh and leg opening. A versatile everyday pant that keeps you looking sharp from morning to night.',
    price: 2099, originalPrice: 3999, discountPercent: 48,
    category: 'Fashion', brand: "Levi's",
    images: [
      u('1542272604-787c3835535d'),
      u('1475178626620-a4d074967452'),
    ],
    stock: 150, rating: 4.3, reviewCount: 12453,
    specifications: new Map([
      ['Fit', 'Slim Fit'], ['Material', '99% Cotton, 1% Elastane'],
      ['Rise', 'Mid Rise'], ['Closure', 'Zip Fly with Button'],
    ]),
    tags: ['jeans', 'mens', 'slim-fit'], isFeatured: false,
  },
  {
    name: 'Nike Air Max 270 Running Shoes',
    description: "Nike Air Max 270 delivers a fresh, ultra-comfortable ride with Nike's biggest Air unit yet.",
    price: 10795, originalPrice: 12995, discountPercent: 17,
    category: 'Fashion', brand: 'Nike',
    images: [
      u('1542291026-7eec264c27ff'),
      u('1600185365483-26d7a4cc7519'),
    ],
    stock: 90, rating: 4.5, reviewCount: 8765,
    specifications: new Map([
      ['Type', 'Running / Lifestyle'], ['Upper', 'Engineered Mesh'],
      ['Sole', 'Rubber Outsole'], ['Technology', 'Air Max Cushioning'],
    ]),
    tags: ['shoes', 'running', 'nike', 'sports'], isFeatured: true,
  },
  {
    name: "Allen Solly Men's Formal Shirt",
    description: 'Regular fit formal shirt perfect for office wear. Made from premium 100% cotton for all-day comfort.',
    price: 799, originalPrice: 1499, discountPercent: 47,
    category: 'Fashion', brand: 'Allen Solly',
    images: [
      u('1603252109303-2751441dd157'),
      u('1581803118522-7b72a50f7e9f'),
    ],
    stock: 200, rating: 4.1, reviewCount: 6234,
    specifications: new Map([
      ['Fit', 'Regular Fit'], ['Material', '100% Cotton'],
      ['Occasion', 'Formal / Office'], ['Sleeve', 'Full Sleeve'],
    ]),
    tags: ['formal', 'shirt', 'office-wear'], isFeatured: false,
  },
  {
    name: "H&M Women's Floral Midi Dress",
    description: 'Beautiful woven midi dress with floral print. Features a round neckline, short puff sleeves, and a concealed zip at the back.',
    price: 1499, originalPrice: 2999, discountPercent: 50,
    category: 'Fashion', brand: 'H&M',
    images: [
      u('1515372039744-b8f02a3ae446'),
      u('1496747611176-843222e1e57c'),
    ],
    stock: 80, rating: 4.2, reviewCount: 3421,
    specifications: new Map([
      ['Fit', 'Regular Fit'], ['Material', '100% Polyester'],
      ['Length', 'Midi'], ['Occasion', 'Casual / Party'],
    ]),
    tags: ['dress', 'women', 'floral', 'midi'], isFeatured: false,
  },

  // ===== HOME & FURNITURE =====
  {
    name: 'Prestige Iris 750W Mixer Grinder',
    description: '3 stainless steel jars, 3-speed control + pulse function, motor overload protection, 2-year warranty.',
    price: 2399, originalPrice: 3995, discountPercent: 40,
    category: 'Home & Furniture', brand: 'Prestige',
    images: [
      u('1556909114-f6e7ad7d3136'),
      u('1585515320310-259814833e62'),
    ],
    stock: 100, rating: 4.4, reviewCount: 18765,
    specifications: new Map([
      ['Power', '750W'], ['Jars', '3 Stainless Steel Jars'],
      ['Speed Settings', '3 Speed + Pulse'],
      ['Warranty', '2 Years on Motor'], ['Capacity', '1.5L Liquidizing Jar'],
    ]),
    tags: ['kitchen', 'mixer', 'appliance'], isFeatured: false,
  },
  {
    name: 'Godrej Axis Edge Pro 7L Air Cooler',
    description: 'Inverter compatible, Honeycomb cooling pads, auto louver movement, and 4-way air deflection.',
    price: 5999, originalPrice: 8990, discountPercent: 33,
    category: 'Home & Furniture', brand: 'Godrej',
    images: [
      u('1585771724684-38269d6639fd'),
      u('1558618047-3c8c76ca7d96'),
    ],
    stock: 45, rating: 4.0, reviewCount: 2341,
    specifications: new Map([
      ['Capacity', '7 Litres'], ['Coverage Area', 'Up to 150 sq ft'],
      ['Power Consumption', '85W'], ['Cooling Pad', 'Honeycomb'], ['Warranty', '1 Year'],
    ]),
    tags: ['cooler', 'summer', 'appliance'], isFeatured: false,
  },
  {
    name: 'Wakefit Orthopaedic Memory Foam Mattress',
    description: 'Premium memory foam mattress with 3-zone body support for complete spine alignment. Medium firm feel.',
    price: 12999, originalPrice: 22999, discountPercent: 43,
    category: 'Home & Furniture', brand: 'Wakefit',
    images: [
      u('1631049307264-da0ec9d70304'),
      u('1555041469-a586c61ea9bc'),
    ],
    stock: 30, rating: 4.5, reviewCount: 7654,
    specifications: new Map([
      ['Size', 'Queen (60x72 inches)'], ['Thickness', '6 inches'],
      ['Material', 'Memory Foam + HR Foam'], ['Firmness', 'Medium Firm'],
      ['Warranty', '10 Years'], ['Trial Period', '100 Nights'],
    ]),
    tags: ['mattress', 'sleep', 'ortho', 'bedroom'], isFeatured: true,
  },
  {
    name: 'Instant Pot Duo 7-in-1 Pressure Cooker',
    description: '7 appliances in 1: Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Saute, Yogurt Maker, Warmer.',
    price: 8999, originalPrice: 14999, discountPercent: 40,
    category: 'Home & Furniture', brand: 'Instant Pot',
    images: [
      u('1556909172-54557c7e4fb7'),
      u('1585515320310-259814833e62'),
    ],
    stock: 55, rating: 4.6, reviewCount: 11234,
    specifications: new Map([
      ['Capacity', '5.7 Litres'], ['Power', '1000W'],
      ['Functions', '7-in-1'], ['Programmes', '14 Smart Programs'],
      ['Material', 'Stainless Steel Inner Pot'],
    ]),
    tags: ['cooker', 'kitchen', 'instant-pot', 'appliance'], isFeatured: true,
  },

  // ===== BOOKS =====
  {
    name: 'Atomic Habits by James Clear',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. No.1 New York Times bestseller with over 15 million copies sold worldwide.',
    price: 399, originalPrice: 799, discountPercent: 50,
    category: 'Books', brand: 'Penguin Random House',
    images: [
      u('1544947950-fa07a98d237f'),
      u('1512820790803-83ca734da794'),
    ],
    stock: 500, rating: 4.7, reviewCount: 45321,
    specifications: new Map([
      ['Author', 'James Clear'], ['Publisher', 'Penguin Random House'],
      ['Pages', '320'], ['Language', 'English'],
      ['ISBN', '9781847941831'], ['Genre', 'Self-Help / Psychology'],
    ]),
    tags: ['self-help', 'habits', 'bestseller'], isFeatured: true,
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    price: 349, originalPrice: 599, discountPercent: 42,
    category: 'Books', brand: 'Harriman House',
    images: [
      u('1589829085413-56de8ae18c73'),
      u('1497633762265-9d179a990aa6'),
    ],
    stock: 400, rating: 4.6, reviewCount: 32456,
    specifications: new Map([
      ['Author', 'Morgan Housel'], ['Pages', '256'],
      ['Language', 'English'], ['Genre', 'Finance / Self-Help'],
    ]),
    tags: ['finance', 'investing', 'money', 'bestseller'], isFeatured: false,
  },
  {
    name: 'Wings of Fire — APJ Abdul Kalam',
    description: "An autobiography of one of India's greatest scientists and the 11th President of India.",
    price: 149, originalPrice: 295, discountPercent: 49,
    category: 'Books', brand: 'Universities Press',
    images: [
      u('1481627834876-b7833e8f5570'),
      u('1512820790803-83ca734da794'),
    ],
    stock: 600, rating: 4.8, reviewCount: 67234,
    specifications: new Map([
      ['Author', 'A.P.J. Abdul Kalam'], ['Pages', '196'],
      ['Language', 'English'], ['Genre', 'Autobiography / Inspiration'],
    ]),
    tags: ['autobiography', 'india', 'inspiration', 'kalam'], isFeatured: false,
  },
  {
    name: 'Rich Dad Poor Dad',
    description: "What the rich teach their kids about money. The #1 personal finance book of all time.",
    price: 299, originalPrice: 499, discountPercent: 40,
    category: 'Books', brand: 'Plata Publishing',
    images: [
      u('1553729459-efe14ef6a47c'),
      u('1497633762265-9d179a990aa6'),
    ],
    stock: 450, rating: 4.5, reviewCount: 89543,
    specifications: new Map([
      ['Author', 'Robert T. Kiyosaki'], ['Pages', '336'],
      ['Language', 'English'], ['Genre', 'Personal Finance'],
    ]),
    tags: ['finance', 'investing', 'wealth', 'bestseller'], isFeatured: false,
  },

  // ===== SPORTS =====
  {
    name: 'Cosco Dribble Basketball (Size 7)',
    description: 'Official size basketball for outdoor and indoor courts. Durable rubber construction with high air retention bladder.',
    price: 699, originalPrice: 1199, discountPercent: 42,
    category: 'Sports', brand: 'Cosco',
    images: [
      u('1546519638405-a2dba4c38d3b'),
      u('1558618047-3c8c76ca7d96'),
    ],
    stock: 120, rating: 4.2, reviewCount: 4567,
    specifications: new Map([
      ['Size', 'Size 7 (Official)'], ['Material', 'Rubber'],
      ['Surface', 'Indoor / Outdoor'], ['Circumference', '74-76 cm'],
    ]),
    tags: ['basketball', 'outdoor', 'sports'], isFeatured: false,
  },
  {
    name: 'Nivia Carbonite Web Badminton Racket',
    description: 'Carbon fibre frame with 100% isometric head shape for a larger sweet spot.',
    price: 1249, originalPrice: 2499, discountPercent: 50,
    category: 'Sports', brand: 'Nivia',
    images: [
      u('1617217891266-6c2e7e9e4d10'),
      u('1554068865-24cecd4e34b8'),
    ],
    stock: 85, rating: 4.3, reviewCount: 3214,
    specifications: new Map([
      ['Frame Material', 'Carbon Fibre'], ['Shaft', 'Flexible'],
      ['Weight', '85g (±5g)'], ['String Tension', 'Up to 28 lbs'],
      ['Balance', 'Even Balance'],
    ]),
    tags: ['badminton', 'racket', 'sports'], isFeatured: false,
  },
  {
    name: "Boldfit Men's Running Shoes",
    description: 'Lightweight mesh upper, anti-slip rubber sole, breathable lining. Perfect for running, gym, and daily sports.',
    price: 799, originalPrice: 2499, discountPercent: 68,
    category: 'Sports', brand: 'Boldfit',
    images: [
      u('1608231387042-66d1773070a5'),
      u('1542291026-7eec264c27ff'),
    ],
    stock: 150, rating: 4.0, reviewCount: 9876,
    specifications: new Map([
      ['Upper', 'Mesh'], ['Sole', 'EVA + Rubber Outsole'],
      ['Closure', 'Lace-Up'], ['Ideal For', 'Running, Gym, Sports'],
    ]),
    tags: ['running-shoes', 'sports', 'gym'], isFeatured: false,
  },

  // ===== GROCERY =====
  {
    name: 'Aashirvaad Whole Wheat Atta 10 kg',
    description: 'Made from finest whole wheat grain, Aashirvaad Superior MP Atta gives you soft, nutritious rotis every day.',
    price: 349, originalPrice: 420, discountPercent: 17,
    category: 'Grocery', brand: 'Aashirvaad',
    images: [
      u('1574323347407-f5e1ad6d020b'),
      u('1509440159596-0249088772ff'),
    ],
    stock: 300, rating: 4.6, reviewCount: 52341,
    specifications: new Map([
      ['Weight', '10 kg'], ['Type', 'Whole Wheat Atta'],
      ['Brand', 'Aashirvaad'], ['Shelf Life', '6 Months'],
    ]),
    tags: ['atta', 'flour', 'staples', 'daily-essentials'], isFeatured: true,
  },
  {
    name: 'Tata Salt Iodised — 1 kg (Pack of 5)',
    description: 'Tata Salt is vacuum evaporated iodised salt. Free from impurities, consistent in granule size, ideal for daily cooking.',
    price: 89, originalPrice: 110, discountPercent: 19,
    category: 'Grocery', brand: 'Tata Salt',
    images: [
      u('1588964895597-cfccd6e2dbf9'),
      u('1617952184588-bfe4c1067df5'),
    ],
    stock: 500, rating: 4.5, reviewCount: 34521,
    specifications: new Map([
      ['Weight', '1 kg × 5 = 5 kg'], ['Type', 'Iodised Salt'],
      ['Shelf Life', '2 Years'], ['Brand', 'Tata Salt'],
    ]),
    tags: ['salt', 'staples', 'daily-essentials', 'kitchen'], isFeatured: false,
  },
  {
    name: 'Fortune Sunflower Oil — 5 Litre',
    description: 'Fortune Sunflower Oil is rich in Vitamin E and good for heart. Suitable for frying, cooking, and salad dressing.',
    price: 599, originalPrice: 720, discountPercent: 17,
    category: 'Grocery', brand: 'Fortune',
    images: [
      u('1474979266404-7eaacbcd87c5'),
      u('1504674900247-0877df9cc836'),
    ],
    stock: 200, rating: 4.4, reviewCount: 18765,
    specifications: new Map([
      ['Volume', '5 Litres'], ['Type', 'Refined Sunflower Oil'],
      ['Shelf Life', '12 Months'], ['Rich In', 'Vitamin E'],
    ]),
    tags: ['oil', 'cooking-oil', 'kitchen', 'grocery'], isFeatured: true,
  },
  {
    name: 'Amul Gold Full Cream Milk — 1L (Pack of 6)',
    description: 'Amul Gold Full Cream Milk with 6% fat. Rich, creamy taste for tea, coffee, and cooking. UHT treated.',
    price: 399, originalPrice: 450, discountPercent: 11,
    category: 'Grocery', brand: 'Amul',
    images: [
      u('1550583724-b2692b85b150'),
      u('1563636619-e9143da7973b'),
    ],
    stock: 250, rating: 4.5, reviewCount: 29876,
    specifications: new Map([
      ['Volume', '1 L × 6 = 6 L'], ['Type', 'Full Cream UHT Milk'],
      ['Fat', '6%'], ['Shelf Life', '6 Months (unopened)'],
    ]),
    tags: ['milk', 'dairy', 'amul', 'daily-essentials'], isFeatured: false,
  },
  {
    name: 'Britannia Good Day Butter Cookies — 1 kg',
    description: 'Crispy, buttery goodness in every bite! Britannia Good Day cookies made with real butter, perfect for snacking with chai.',
    price: 199, originalPrice: 250, discountPercent: 20,
    category: 'Grocery', brand: 'Britannia',
    images: [
      u('1558961363-fa8fdf82db35'),
      u('1499636757-cbf1eed5e04d'),
    ],
    stock: 400, rating: 4.3, reviewCount: 41234,
    specifications: new Map([
      ['Weight', '1 kg'], ['Type', 'Butter Cookies'],
      ['Shelf Life', '6 Months'], ['Flavour', 'Butter'],
    ]),
    tags: ['cookies', 'biscuits', 'snacks', 'britannia'], isFeatured: false,
  },
  {
    name: 'Tata Tea Gold — 500g',
    description: 'Tata Tea Gold - Fine whole leaf tea with special tips for a refreshing, rich brew. Perfect for morning and evening.',
    price: 259, originalPrice: 310, discountPercent: 16,
    category: 'Grocery', brand: 'Tata Tea',
    images: [
      u('1558618666-fcd25c85cd64'),
      u('1571934811571-d7920c61c6af'),
    ],
    stock: 350, rating: 4.5, reviewCount: 55678,
    specifications: new Map([
      ['Weight', '500 g'], ['Type', 'Whole Leaf Tea'],
      ['Shelf Life', '18 Months'], ['Flavour', 'Rich & Refreshing'],
    ]),
    tags: ['tea', 'beverages', 'tata', 'daily-essentials'], isFeatured: true,
  },
  {
    name: 'Maggi 2-Minute Noodles — 12 Pack',
    description: "India's favourite instant noodles! Maggi 2-Minute Masala Noodles — a quick, tasty meal ready in just 2 minutes.",
    price: 168, originalPrice: 204, discountPercent: 18,
    category: 'Grocery', brand: 'Maggi',
    images: [
      u('1569718212165-3a8278d5f624'),
      u('1552332386-f8dd1aa7e9c8'),
    ],
    stock: 600, rating: 4.7, reviewCount: 98765,
    specifications: new Map([
      ['Pack Size', '12 × 70g = 840g'], ['Type', 'Instant Noodles'],
      ['Flavour', 'Masala'], ['Cook Time', '2 Minutes'],
    ]),
    tags: ['noodles', 'instant-food', 'snacks', 'maggi'], isFeatured: true,
  },
  {
    name: 'Kissan Mixed Fruit Jam — 700g',
    description: 'Kissan Mixed Fruit Jam made from real fruits with no artificial colours. Perfect spread for bread, toast, and sandwiches.',
    price: 149, originalPrice: 185, discountPercent: 19,
    category: 'Grocery', brand: 'Kissan',
    images: [
      u('1563636619-e9143da7973b'),
      u('1490818153584-5ef2ca6a2a0e'),
    ],
    stock: 280, rating: 4.3, reviewCount: 22345,
    specifications: new Map([
      ['Weight', '700 g'], ['Type', 'Mixed Fruit Jam'],
      ['Shelf Life', '12 Months'], ['No Artificial Colours', 'Yes'],
    ]),
    tags: ['jam', 'breakfast', 'spread', 'grocery'], isFeatured: false,
  },
];

const defaultUser = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  password: 'password123',
  phone: '9876543210',
  isDefault: true,
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopsmart');
    console.log('MongoDB connected for seeding...');
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products across 8 categories`);
    await User.create(defaultUser);
    console.log('✅ Default user: rahul.sharma@example.com / password123');
    const cats = [...new Set(products.map(p => p.category))];
    console.log('📦 Categories:', cats.join(', '));
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
