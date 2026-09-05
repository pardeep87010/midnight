import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../product images');
const destDir = path.join(__dirname, '../public/product-images');

// 1. Ensure public/product-images directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 2. Read all files from sourceDir
const files = fs.readdirSync(sourceDir);
console.log(`Found ${files.length} image files in 'product images' directory.`);

// Copy all files to public/product-images
const copiedFiles = [];
for (const file of files) {
  const srcPath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  fs.copyFileSync(srcPath, destPath);
  copiedFiles.push(file);
}
console.log(`Copied ${copiedFiles.length} files to public/product-images.`);

// 3. Define the 10 Products with exact matching patterns
const PRODUCTS_CONFIG = [
  {
    id: 'lelo-mona-wave',
    name: 'LELO Mona Wave Dual-Motor G-Spot Wand',
    pattern: 'LELO Mona Wave',
    category: 'vibrators',
    subcategory: 'G-Spot Vibrators',
    price: 12499,
    originalPrice: 15999,
    discount: '22% OFF',
    badge: 'Luxury Flagship',
    stock: 35,
    subtitle: 'WaveMotion technology that mimics the come-hither finger motion',
    description: 'Engineered with patented WaveMotion technology that surges and rolls inside you to mimic the natural come-hither finger motion with dual synchronized rumble motors.',
    sound: '< 25 dB (Ultra Silent)',
    material: '100% Medical Liquid Silicone & ABS Alloy',
    battery: '120 min Runtime / Magnetic Fast USB',
    waterproof: 'IPX7 100% Waterproof',
    modes: '10 Sensation Speeds & Wave Frequencies',
    colors: [{ name: 'Midnight Plum', hex: '#3E1C4D' }, { name: 'Rose Gold', hex: '#B76E79' }]
  },
  {
    id: 'bullet-vibrator-pro',
    name: 'The Micro-Pulse Bullet Vibrator Pro',
    pattern: 'The Micro-Pulse Bullet',
    category: 'vibrators',
    subcategory: 'Bullet Vibrators',
    price: 2499,
    originalPrice: 3299,
    discount: '24% OFF',
    badge: 'Beginner Essential',
    stock: 80,
    subtitle: 'Discreet pinpoint external clitoral stimulation wand',
    description: 'Compact, whisper-quiet micro-pulse bullet delivering deep concentrated resonant frequencies with one-button simplicity and satin soft-touch coating.',
    sound: '< 28 dB',
    material: 'Body-Safe Liquid Silicone & Polished ABS',
    battery: '90 min USB Fast Rechargeable',
    waterproof: 'IPX7 Submersible',
    modes: '10 High-Frequency Pulse Modes',
    colors: [{ name: 'Rose Gold Ember', hex: '#B76E79' }, { name: 'Midnight Onyx', hex: '#1C1C1C' }]
  },
  {
    id: 'dual-sensation-rabbit-pro',
    name: 'The Dual-Sensation Rabbit Vibrator Pro',
    pattern: 'The Dual-Sensation Rabbit',
    category: 'vibrators',
    subcategory: 'Rabbit Vibrators',
    price: 6499,
    originalPrice: 8099,
    discount: '20% OFF',
    badge: 'Best Seller',
    stock: 45,
    subtitle: 'Shaft for internal G-spot + clitoral bunny-ear stimulator',
    description: 'Features a contoured anatomical shaft for internal G-spot massage and a flexible external bunny-ear arm delivering synchronized dual orgasms.',
    sound: '< 30 dB',
    material: '100% Medical Liquid Silicone',
    battery: '120 min USB Magnetic Runtime',
    waterproof: 'IPX7 Waterproof',
    modes: '12 Dual-Motor Sensation Patterns',
    colors: [{ name: 'Velvet Plum', hex: '#4D1E4B' }, { name: 'Blush Rose', hex: '#B76E79' }]
  },
  {
    id: 'aura-power-wand',
    name: 'The Empress Heavy-Duty Full Body Wand Massager',
    pattern: 'The Empress Heavy-Duty',
    category: 'vibrators',
    subcategory: 'Wand Vibrators',
    price: 8799,
    originalPrice: 10899,
    discount: '19% OFF',
    badge: 'Heavyweight Power',
    stock: 30,
    subtitle: 'High-torque broad head massager for rumbling vibrations',
    description: 'Equipped with a high-torque brushless motor and cushioned silicone head designed for broad, rumbling vibrations that relieve deep muscle tension and trigger explosive climax.',
    sound: '< 34 dB',
    material: 'Medical Silicone & Aviation Alloy Neck',
    battery: '180 min Runtime / Fast AC & USB',
    waterproof: 'IPX6 Splashproof',
    modes: '8 Speeds + 12 Variable Patterns',
    colors: [{ name: 'Frosted Rose', hex: '#B76E79' }, { name: 'Obsidian Black', hex: '#1C1C1C' }]
  },
  {
    id: 'whisper-magnetic-panty-vibe',
    name: 'The Whisper Remote-Control Magnetic Panty Vibrator',
    pattern: 'The Whisper Remote-Control',
    category: 'vibrators',
    subcategory: 'Panty Vibrators',
    price: 4999,
    originalPrice: 6999,
    discount: '28% OFF',
    badge: 'Discreet Wearable',
    stock: 55,
    subtitle: 'Magnetic clamp wearable vibe with long-range wireless remote',
    description: 'Ultra-thin ergonomic curve secures invisibly inside underwear with powerful magnetic hold, controlled via wireless remote up to 15 meters for public or private thrills.',
    sound: '< 24 dB (Whisper Stealth)',
    material: 'Seamless Platinum Silicone',
    battery: '90 min Magnetic USB Charge',
    waterproof: 'IPX8 100% Submersible',
    modes: '10 Wireless Remote Modes',
    colors: [{ name: 'Rose Gold Ember', hex: '#B76E79' }, { name: 'Midnight Onyx', hex: '#1C1C1C' }]
  },
  {
    id: 'eggstacy-love-egg-pro',
    name: 'Eggstacy Wireless Remote Love Egg Pro',
    pattern: 'Eggstacy Wireless Remote',
    category: 'vibrators',
    subcategory: 'Egg Vibrators',
    price: 3499,
    originalPrice: 4999,
    discount: '30% OFF',
    badge: 'Couples Favorite',
    stock: 60,
    subtitle: 'Kegel strengthening & internal wireless love egg',
    description: 'Smooth waterproof Kegel love egg designed to tone pelvic floor muscles while delivering intense wireless partner-controlled pleasure.',
    sound: '< 26 dB',
    material: 'Body-Safe Liquid Silicone',
    battery: '120 min Runtime',
    waterproof: 'IPX7 100% Waterproof',
    modes: '12 Vibration Frequencies',
    colors: [{ name: 'Sky Mint', hex: '#38BDF8' }, { name: 'Velvet Rose', hex: '#B56571' }]
  },
  {
    id: 'lelo-gigi-2',
    name: 'LELO Gigi 2 Targeted G-Spot Stimulator',
    pattern: 'LELO Gigi 2',
    category: 'vibrators',
    subcategory: 'G-Spot Vibrators',
    price: 9999,
    originalPrice: 12999,
    discount: '23% OFF',
    badge: 'Award Winner',
    stock: 28,
    subtitle: 'Flattened sculpted tip engineered for pinpoint G-spot pressure',
    description: 'Sculpted with a flattened duckbill-style tip that glides precisely against the G-spot to provide intense focused vibrations with whisper-quiet motor.',
    sound: '< 28 dB',
    material: 'Silky Smooth Medical Silicone & ABS',
    battery: '120 min USB Rechargeable',
    waterproof: 'IPX7 Submersible',
    modes: '8 Variable Sensation Speeds',
    colors: [{ name: 'Plum Purple', hex: '#4A154B' }, { name: 'Champagne Pearl', hex: '#E5DCC3' }]
  },
  {
    id: 'we-vibe-chorus-couples',
    name: 'We-Vibe Chorus Couples App-Controlled Vibrator',
    pattern: 'We-Vibe Chorus',
    category: 'vibrators',
    subcategory: 'Couples Vibrators',
    price: 14499,
    originalPrice: 17999,
    discount: '19% OFF',
    badge: 'Best for Couples',
    stock: 22,
    subtitle: 'Worn during intercourse for simultaneous dual-partner stimulation',
    description: 'Flexible U-shape massager worn during intercourse. Stimulates the clitoris and G-spot simultaneously while enhancing penile sensation for the partner.',
    sound: '< 28 dB',
    material: 'Silky Platinum Silicone',
    battery: '90 min Magnetic Wireless Dock',
    waterproof: '100% Waterproof',
    modes: 'Touch-Sense Smart Controls + Smartphone App',
    colors: [{ name: 'Cosmic Blue', hex: '#1E3A8A' }, { name: 'Sunset Pink', hex: '#DB2777' }]
  },
  {
    id: 'svakom-tanya-thermal',
    name: 'Svakom Tanya Ergonomic 38°C Thermal Vibrator',
    pattern: 'Svakom Tanya',
    category: 'vibrators',
    subcategory: 'G-Spot Vibrators',
    price: 6999,
    originalPrice: 8999,
    discount: '22% OFF',
    badge: 'Thermal Warmth',
    stock: 32,
    subtitle: 'Warms up to body temperature (38°C) with dual-motor pulsation',
    description: 'Features intelligent thermal heating that warms the silicone body to realistic human body temperature (38°C) within 3 minutes while delivering dual-point stimulation.',
    sound: '< 30 dB',
    material: 'Medical Soft-Touch Silicone',
    battery: '100 min USB Fast Charge',
    waterproof: 'IPX7 Waterproof',
    modes: '5 Sensation Speeds + 5 Vibration Modes',
    colors: [{ name: 'Velvet Rose', hex: '#B56571' }, { name: 'Obsidian Onyx', hex: '#1C1C1C' }]
  },
  {
    id: 'fun-factory-miss-bi',
    name: 'Fun Factory Miss Bi Double G-Spot & Clitoral Toy',
    pattern: 'Fun Factory Miss Bi',
    category: 'vibrators',
    subcategory: 'Rabbit Vibrators',
    price: 7999,
    originalPrice: 9999,
    discount: '20% OFF',
    badge: 'German Engineering',
    stock: 25,
    subtitle: 'Curved dual-flex body crafted in Germany for deep fullness',
    description: 'Precision German engineered dual-stimulation toy with a firm curved G-spot arm and ergonomic clitoral resonance paddle that adapts to all body anatomies.',
    sound: '< 29 dB',
    material: '100% Medical-Grade German Silicone',
    battery: 'Magnetic Click \'n\' Charge USB',
    waterproof: '100% Submersible',
    modes: '6 Vibration Speeds + 6 Rhythms',
    colors: [{ name: 'Neon Magenta', hex: '#BE185D' }, { name: 'Deep Sea', hex: '#0369A1' }]
  }
];

// Group & Sort images for each product
const FINAL_10_PRODUCTS = PRODUCTS_CONFIG.map(config => {
  // Find all matching image files
  const matchingFiles = copiedFiles.filter(f => f.toLowerCase().includes(config.pattern.toLowerCase()));
  
  // Sort by index: _0, _1, _2, _3, _4, etc.
  matchingFiles.sort((a, b) => {
    const getIndex = (name) => {
      const match = name.match(/_(\d+)\.[a-zA-Z0-9]+$/);
      return match ? parseInt(match[1], 10) : 999;
    };
    return getIndex(a) - getIndex(b);
  });

  const imageUrls = matchingFiles.map(f => `/product-images/${encodeURIComponent(f)}`);

  console.log(`Product "${config.name}": Found ${imageUrls.length} images -> Cover: ${imageUrls[0]}`);

  return {
    ...config,
    images: imageUrls,
    rating: 5.0,
    reviewsCount: Math.floor(Math.random() * 200) + 50,
    specs: {
      sound: config.sound,
      material: config.material,
      battery: config.battery,
      waterproof: config.waterproof,
      modes: config.modes
    },
    inTheBox: [
      `${config.name} Main Unit`,
      'Magnetic USB Fast Charger',
      'Velvet Travel Pouch',
      'Confidential User Manual'
    ]
  };
});

// 4. Wipe & Insert into SQLite Database
db.prepare('DELETE FROM products').run();

const insert = db.prepare(`
  INSERT INTO products (
    id, name, slug, subtitle, description, price, original_price,
    category, subcategory, badge, discount, rating, reviews_count,
    stock, specs_json, colors_json, in_the_box_json, images_json, is_active
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

const insertAll = db.transaction((prods) => {
  for (const p of prods) {
    insert.run(
      p.id,
      p.name,
      p.id,
      p.subtitle,
      p.description,
      p.price,
      p.originalPrice,
      p.category,
      p.subcategory,
      p.badge,
      p.discount,
      p.rating,
      p.reviewsCount,
      p.stock,
      JSON.stringify(p.specs),
      JSON.stringify(p.colors),
      JSON.stringify(p.inTheBox),
      JSON.stringify(p.images)
    );
  }
});

insertAll(FINAL_10_PRODUCTS);
const countInDb = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
console.log(`✅ Inserted ${countInDb} products into SQLite Database!`);

// 5. Update src/data/mockData.js with STITCH_PRODUCTS
const mockDataPath = path.join(__dirname, '../src/data/mockData.js');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

const productsCode = `export const STITCH_PRODUCTS = ${JSON.stringify(FINAL_10_PRODUCTS, null, 2)};`;
mockDataContent = mockDataContent.replace(/export const STITCH_PRODUCTS = \[[\s\S]*?\];/, productsCode);
fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
console.log(`✅ Updated STITCH_PRODUCTS in mockData.js with all 10 products!`);

// 6. Save JSON file
const jsonPath = path.join(__dirname, '../src/data/10_products_with_images.json');
fs.writeFileSync(jsonPath, JSON.stringify(FINAL_10_PRODUCTS, null, 2), 'utf8');

console.log(`\n🎉 All 10 products with multi-angle images have been successfully added to Midnight Bloom!`);
