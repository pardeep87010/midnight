import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import db from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadsDir = 'C:\\Users\\20092\\Downloads\\product images';
const projectImagesDir = path.join(__dirname, '../product images');
const publicImagesDir = path.join(__dirname, '../public/product-images');

// 1. Ensure target directories exist
if (!fs.existsSync(projectImagesDir)) fs.mkdirSync(projectImagesDir, { recursive: true });
if (!fs.existsSync(publicImagesDir)) fs.mkdirSync(publicImagesDir, { recursive: true });

// 2. Read source images from Downloads
const sourceFiles = fs.readdirSync(downloadsDir);
console.log(`Found ${sourceFiles.length} images in '${downloadsDir}'.`);

// Copy & optimize to public/product-images and project images/
for (const file of sourceFiles) {
  const src = path.join(downloadsDir, file);
  const destProject = path.join(projectImagesDir, file);
  const destPublic = path.join(publicImagesDir, file);
  fs.copyFileSync(src, destProject);
  fs.copyFileSync(src, destPublic);
}
console.log(`Copied ${sourceFiles.length} image files to project and public folders.`);

// 3. Define 20 Products Config
const PRODUCTS_CONFIG = [
  // 1. LELO Mona Wave
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
  // 2. The Micro-Pulse Bullet Vibrator Pro
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
  // 3. The Dual-Sensation Rabbit Vibrator Pro
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
  // 4. The Empress Heavy-Duty Full Body Wand Massager
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
  // 5. The Whisper Remote-Control Magnetic Panty Vibrator
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
  // 6. Eggstacy Wireless Remote Love Egg Pro
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
  // 7. LELO Gigi 2 Targeted G-Spot Stimulator
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
  // 8. We-Vibe Chorus Couples App-Controlled Vibrator
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
  // 9. Svakom Tanya Ergonomic 38°C Thermal Vibrator
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
  // 10. Fun Factory Miss Bi Double G-Spot & Clitoral Toy
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
  },
  // 11. Satisfyer Double Joy Synchronized Couples Ring
  {
    id: 'satisfyer-double-joy',
    name: 'Satisfyer Double Joy Synchronized Couples Ring',
    pattern: 'Satisfyer Double Joy',
    category: 'vibrators',
    subcategory: 'Couples Vibrators',
    price: 4599,
    originalPrice: 5999,
    discount: '23% OFF',
    badge: 'App Enabled',
    stock: 40,
    subtitle: 'Bluetooth app-controlled ergonomic couple ring',
    description: 'Designed to be shared during intimate partner moments. Enhances partner firmness while delivering intense clitoral vibrations controlled via the Satisfyer Connect app.',
    sound: '< 27 dB',
    material: 'Body-Friendly Liquid Silicone',
    battery: 'USB Magnetic Charging',
    waterproof: 'IPX7 Waterproof',
    modes: '10 Preset Modes + Unlimited Custom App Play',
    colors: [{ name: 'Midnight Blue', hex: '#1E293B' }, { name: 'Rose Pink', hex: '#F43F5E' }]
  },
  // 12. The Petite Lipstick Travel Discreet Vibrator
  {
    id: 'petite-lipstick-vibe',
    name: 'The Petite Lipstick Travel Discreet Vibrator',
    pattern: 'The Petite Lipstick',
    category: 'vibrators',
    subcategory: 'Bullet Vibrators',
    price: 1499,
    originalPrice: 2299,
    discount: '35% OFF',
    badge: 'Discreet Disguise',
    stock: 90,
    subtitle: 'Disguised as high-end designer lipstick for total travel discretion',
    description: 'Looks identical to a luxury lipstick tube with a sleek twist cap. Features a beveled silicone tip that delivers surprisingly intense pinpoint clitoral vibrations.',
    sound: '< 25 dB',
    material: 'ABS Gold Plating & Silicone Tip',
    battery: 'AAA Battery / 4 Hours Play',
    waterproof: 'IPX5 Water Resistant',
    modes: '1 Multi-Speed Smooth Dial',
    colors: [{ name: 'Gloss Carmine', hex: '#991B1B' }, { name: 'Rose Gold', hex: '#B76E79' }]
  },
  // 13. The Palm-Grip Ergonomic Body Massager
  {
    id: 'palm-grip-sensual-massager',
    name: 'The Palm-Grip Ergonomic Body Massager',
    pattern: 'The Palm-Grip Ergonomic',
    category: 'vibrators',
    subcategory: 'Wand Vibrators',
    price: 3999,
    originalPrice: 5499,
    discount: '27% OFF',
    badge: 'Ergonomic Choice',
    stock: 38,
    subtitle: 'Fits naturally into palm of hand for effortless pressure control',
    description: 'Pebble-shaped ergonomic massager that nestles naturally in the palm of your hand, allowing intuitive pressure adjustment across sensitive zones.',
    sound: '< 28 dB',
    material: 'Silky Soft-Touch Silicone',
    battery: '90 min USB Rechargeable',
    waterproof: 'IPX7 Waterproof',
    modes: '8 Pulsing Rhythms',
    colors: [{ name: 'Lavender Mist', hex: '#A855F7' }, { name: 'Slate Onyx', hex: '#1E293B' }]
  },
  // 14. The Flexi-Tip Curve 360° Rabbit Vibrator
  {
    id: 'flexi-tip-rabbit-curve',
    name: 'The Flexi-Tip Curve 360° Rabbit Vibrator',
    pattern: 'The Flexi-Tip Curve',
    category: 'vibrators',
    subcategory: 'Rabbit Vibrators',
    price: 5299,
    originalPrice: 6999,
    discount: '24% OFF',
    badge: 'Ultra-Flexible',
    stock: 42,
    subtitle: '360° flexible silicone tip that bends to your exact natural contours',
    description: 'Features a revolutionary flexible inner core that bends smoothly to match your unique internal angle for targeted G-spot stimulation alongside fluttering external ears.',
    sound: '< 29 dB',
    material: '100% Medical Liquid Silicone',
    battery: '120 min USB Fast Charge',
    waterproof: 'IPX7 Submersible',
    modes: '10 Dual Motors Frequencies',
    colors: [{ name: 'Dusky Rose', hex: '#B56571' }, { name: 'Midnight Onyx', hex: '#1C1C1C' }]
  },
  // 15. The Micro-Sonic Finger Vibrator Sleeve
  {
    id: 'micro-sonic-finger-vibe',
    name: 'The Micro-Sonic Finger Vibrator Sleeve',
    pattern: 'The Micro-Sonic Finger',
    category: 'vibrators',
    subcategory: 'Bullet Vibrators',
    price: 1899,
    originalPrice: 2699,
    discount: '30% OFF',
    badge: 'Hands-On Touch',
    stock: 65,
    subtitle: 'Wearable textured silicone finger cot with high-frequency micro-motor',
    description: 'Slips directly onto the index or middle finger with textured nubs to transform natural touch into high-intensity sensual vibrations.',
    sound: '< 26 dB',
    material: 'Ultra-Stretch Platinum Silicone',
    battery: '60 min USB Charge',
    waterproof: 'IPX7 100% Waterproof',
    modes: '7 Vibration Speeds',
    colors: [{ name: 'Blush Pink', hex: '#F43F5E' }, { name: 'Stealth Black', hex: '#1C1C1C' }]
  },
  // 16. The Whisper-Quiet Luxury Wand & Mist Set
  {
    id: 'whisper-luxury-wand-set',
    name: 'The Whisper-Quiet Luxury Wand & Mist Set',
    pattern: 'The Whisper-Quiet Luxury Wand',
    category: 'vibrators',
    subcategory: 'Wand Vibrators',
    price: 3499,
    originalPrice: 4999,
    discount: '30% OFF',
    badge: 'Complete Ritual',
    stock: 50,
    subtitle: 'Includes portable mini wand massager + botanical toy cleaning mist',
    description: 'The ultimate intimate starter kit containing a compact high-power wand massager with flexible neck and 60ml antibacterial organic cleaning mist.',
    sound: '< 27 dB',
    material: 'Silky Silicone & Antibacterial Mist',
    battery: '120 min USB Charge',
    waterproof: 'IPX7 Waterproof',
    modes: '8 Deep Rumble Frequencies',
    colors: [{ name: 'Rose Gold Obsidian', hex: '#1C1C1C' }, { name: 'Champagne Pink', hex: '#F0B8BE' }]
  },
  // 17. The Pure Curve Liquid Silicone Flexible Dildo
  {
    id: 'pure-curve-silicone-dildo',
    name: 'The Pure Curve Liquid Silicone Flexible Dildo',
    pattern: 'The Pure Curve Liquid',
    category: 'dildos-insertables',
    subcategory: 'Silicone Dildos',
    price: 3999,
    originalPrice: 5099,
    discount: '21% OFF',
    badge: 'Body-Safe Choice',
    stock: 55,
    subtitle: 'Flexible, velvety soft textured medical silicone insertable',
    description: 'Silky smooth liquid silicone dildo featuring a gentle upward anatomical curve designed to naturally target and stimulate the anterior G-spot wall.',
    sound: 'Silent (0 dB)',
    material: '100% Medical Grade Silicone',
    battery: 'Manual (No Battery)',
    waterproof: '100% Waterproof & Washable',
    modes: 'Flexible Anatomical Ergonomics',
    colors: [{ name: 'Midnight Plum', hex: '#3E1C4D' }, { name: 'Blush Rose', hex: '#B76E79' }]
  },
  // 18. The Naturalis Realistic Dual-Density Dildo
  {
    id: 'naturalis-dual-density-dildo',
    name: 'The Naturalis Realistic Dual-Density Dildo',
    pattern: 'The Naturalis Realistic',
    category: 'dildos-insertables',
    subcategory: 'Realistic Dildos',
    price: 5399,
    originalPrice: 6699,
    discount: '20% OFF',
    badge: 'Hyper-Realistic',
    stock: 40,
    subtitle: 'Lifelike dual-layer silicone mold designed to mimic natural anatomy',
    description: 'Features a firm internal backbone and velvety soft outer skin that replicates real human anatomy with lifelike veins, glans, and testicles.',
    sound: 'Silent (0 dB)',
    material: 'Dual-Density Platinum Silicone',
    battery: 'Manual (No Battery)',
    waterproof: '100% Boilable & Submersible',
    modes: 'Flexible Ergonomic Thrusting',
    colors: [{ name: 'Caramel Tone', hex: '#C68A4C' }, { name: 'Natural Sand', hex: '#D2A374' }]
  },
  // 19. The Apex Mirror-Polished Stainless Steel Metal Dildo
  {
    id: 'apex-stainless-steel-dildo',
    name: 'The Apex Mirror-Polished Stainless Steel Metal Dildo',
    pattern: 'The Apex Mirror-Polished',
    category: 'dildos-insertables',
    subcategory: 'Metal Dildos',
    price: 6099,
    originalPrice: 7799,
    discount: '22% OFF',
    badge: 'Heavyweight Luxe',
    stock: 20,
    subtitle: 'Heavy, mirror-polished steel insertable delivering deep fullness',
    description: 'Crafted from solid 316L surgical-grade stainless steel weighing 520g for profound internal pressure, instant temperature responsiveness, and effortless glide.',
    sound: 'Silent',
    material: '316L Surgical Stainless Steel',
    battery: 'Manual',
    waterproof: '100% Submersible',
    modes: 'Weighted Pressure Therapy',
    colors: [{ name: 'Mirror Chrome', hex: '#C0C0C0' }, { name: 'Rose Gold Plated', hex: '#B76E79' }]
  },
  // 20. The Prism Handcrafted Borosilicate Glass Dildo
  {
    id: 'prism-borosilicate-glass-dildo',
    name: 'The Prism Handcrafted Borosilicate Glass Dildo',
    pattern: 'The Prism Handcrafted',
    category: 'dildos-insertables',
    subcategory: 'Glass Dildos',
    price: 4699,
    originalPrice: 6099,
    discount: '22% OFF',
    badge: 'Temperature Play',
    stock: 35,
    subtitle: 'Non-porous, hand-blown crystal glass toy that can be heated or cooled',
    description: 'Non-porous, hypoallergenic borosilicate glass with ribbed spiral ripples. Place in warm water for soothing heat or ice water for sensory chills.',
    sound: 'Completely Silent',
    material: 'Hypoallergenic Borosilicate Glass',
    battery: 'Manual',
    waterproof: '100% Dishwasher Safe & Boilable',
    modes: 'Thermal Conduction Warm/Cold',
    colors: [{ name: 'Clear Crystal', hex: '#E6F0FA' }, { name: 'Cobalt Swirl', hex: '#1D3557' }]
  }
];

// In-Memory Sharp Optimization on all files in publicImagesDir
async function optimizeAllFiles() {
  const files = fs.readdirSync(publicImagesDir);
  console.log(`Optimizing ${files.length} images in public/product-images...`);
  for (const f of files) {
    const filePath = path.join(publicImagesDir, f);
    const ext = path.extname(f).toLowerCase();
    try {
      const buffer = fs.readFileSync(filePath);
      let optimized;
      if (ext === '.webp') {
        optimized = await sharp(buffer).resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
      } else if (ext === '.jpg' || ext === '.jpeg') {
        optimized = await sharp(buffer).resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      } else if (ext === '.png') {
        optimized = await sharp(buffer).resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true }).png({ compressionLevel: 9, quality: 85 }).toBuffer();
      } else if (ext === '.avif') {
        optimized = await sharp(buffer).resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true }).avif({ quality: 75 }).toBuffer();
      }
      if (optimized && optimized.length < buffer.length) {
        fs.writeFileSync(filePath, optimized);
      }
    } catch (err) {
      console.warn(`Could not optimize ${f}: ${err.message}`);
    }
  }
}

await optimizeAllFiles();

// Group images for each of the 20 products
const copiedFiles = fs.readdirSync(publicImagesDir);

const FINAL_20_PRODUCTS = PRODUCTS_CONFIG.map(config => {
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
    images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
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
      'Magnetic USB Fast Charger / User Guide',
      'Velvet Travel Pouch',
      'Confidential User Manual'
    ]
  };
});

// Wipe & Insert into SQLite Database
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

insertAll(FINAL_20_PRODUCTS);
const countInDb = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
console.log(`\n✅ Inserted ${countInDb} products into SQLite Database!`);

// Update mockData.js with STITCH_PRODUCTS
const mockDataPath = path.join(__dirname, '../src/data/mockData.js');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
const productsCode = `export const STITCH_PRODUCTS = ${JSON.stringify(FINAL_20_PRODUCTS, null, 2)};`;
mockDataContent = mockDataContent.replace(/export const STITCH_PRODUCTS = \[[\s\S]*?\];/, productsCode);
fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
console.log(`✅ Updated STITCH_PRODUCTS in mockData.js with all 20 products!`);

// Save JSON file
const jsonPath = path.join(__dirname, '../src/data/20_products_with_images.json');
fs.writeFileSync(jsonPath, JSON.stringify(FINAL_20_PRODUCTS, null, 2), 'utf8');

console.log(`\n🎉 Successfully added all 20 products with multi-angle and single images to Midnight Bloom!`);
