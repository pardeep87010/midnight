import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allProductsJsonPath = path.join(__dirname, '../src/data/all_products_with_images.json');
const allProducts = JSON.parse(fs.readFileSync(allProductsJsonPath, 'utf8'));

// Filter ONLY products that have local downloaded images (starting with /product-images/)
const ONLY_USER_PRODUCTS = allProducts.filter(p => 
  Array.isArray(p.images) && p.images.length > 0 && p.images[0].startsWith('/product-images/')
);

console.log(`🔒 Found ${ONLY_USER_PRODUCTS.length} user products with real downloaded multi-angle images.`);

// 1. Wipe SQLite database and insert strictly the 29 products
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

insertAll(ONLY_USER_PRODUCTS);
const countInDb = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
console.log(`✅ SQLite Database now contains strictly ${countInDb} real downloaded products.`);

// 2. Build Category objects with real cover images from the 29 products
const CATEGORIES_FOR_USER_PRODUCTS = [
  {
    id: 'vibrators',
    name: 'Vibrators',
    subtitle: 'Wands, Rabbits, Bullets & Wearables',
    tagline: 'Precision engineered vibrators for clitoral, G-spot, and all-over body stimulation with whisper-quiet motors.',
    image: '/product-images/LELO%20Mona%20Wave%20Dual-Motor%20G-Spot%20Wand_0.webp',
    subcategories: ['G-Spot Vibrators', 'Bullet Vibrators', 'Rabbit Vibrators', 'Wand Vibrators', 'Panty Vibrators', 'Egg Vibrators', 'Couples Vibrators'],
    keywords: ['vibrators', 'bullet vibrator', 'rabbit vibrator', 'wand vibrator', 'panty vibrator', 'sex toys', 'sex toys india']
  },
  {
    id: 'dildos-insertables',
    name: 'Dildos & Insertables',
    subtitle: 'Silicone, Glass, Metal & Thrusting',
    tagline: 'Sensual insertable art pieces crafted from non-porous borosilicate glass, medical liquid silicone, and stainless steel.',
    image: '/product-images/The%20Apex%20Mirror-Polished%20Stainless%20Steel%20Metal%20Dildo_0.webp',
    subcategories: ['Realistic Dildos', 'Glass Dildos', 'Metal Dildos', 'Silicone Dildos', 'Thrusting Dildos', 'Double Dildos', 'Suction-Cup Dildos', 'Articulating Dildos', 'Harness Dildos'],
    keywords: ['dildos', 'glass dildo', 'metal dildo', 'silicone dildo', 'thrusting dildo', 'double dildo', 'sex toys']
  }
];

// 3. Update mockData.js
const mockDataPath = path.join(__dirname, '../src/data/mockData.js');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Replace STITCH_CATEGORIES
mockDataContent = mockDataContent.replace(
  /export const STITCH_CATEGORIES = \[[\s\S]*?\];/m,
  `export const STITCH_CATEGORIES = ${JSON.stringify(CATEGORIES_FOR_USER_PRODUCTS, null, 2)};`
);

// Replace STITCH_PRODUCTS
mockDataContent = mockDataContent.replace(
  /export const STITCH_PRODUCTS = \[[\s\S]*?\];/m,
  `export const STITCH_PRODUCTS = ${JSON.stringify(ONLY_USER_PRODUCTS, null, 2)};`
);

fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
console.log(`✅ Updated STITCH_PRODUCTS & STITCH_CATEGORIES in mockData.js!`);

// Save clean 29 products JSON
const cleanJsonPath = path.join(__dirname, '../src/data/clean_29_products.json');
fs.writeFileSync(cleanJsonPath, JSON.stringify(ONLY_USER_PRODUCTS, null, 2), 'utf8');

console.log(`🎉 Database and mockData locked to strictly ${ONLY_USER_PRODUCTS.length} real products.`);
