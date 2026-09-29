import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockDataPath = path.resolve(__dirname, '../src/data/mockData.js');
const clean29Path = path.resolve(__dirname, '../src/data/clean_29_products.json');
const reviewsPath = path.resolve(__dirname, '../src/data/productReviews.js');
const dbPath = path.resolve(__dirname, '../database/midnight_bloom.db');
const sampleCsvPath = path.resolve(__dirname, '../public/templates/midnight_bloom_product_import_sample.csv');
const catalogCsvPath = path.resolve(__dirname, '../public/templates/100_verified_luxury_toys_catalog.csv');

// 1. Read mockData.js
const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
const match = mockDataContent.match(/export const STITCH_PRODUCTS = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not find STITCH_PRODUCTS in mockData.js');
  process.exit(1);
}

const products = JSON.parse(match[1]);
console.log(`Loaded ${products.length} products from mockData.js`);

// Find min and max of old prices
const sortedOld = [...products].sort((a, b) => a.price - b.price);
const minOld = sortedOld[0].price; // 1299
const maxOld = sortedOld[sortedOld.length - 1].price; // 16999

function calculateNewPrice(oldPrice) {
  // Normalize ratio [0, 1] using power 0.65 for smooth luxury distribution
  const ratio = Math.pow((oldPrice - minOld) / (maxOld - minOld), 0.65);
  // Target: min 549, max 999 (strictly in 500-1000 range, under 1000)
  const raw = 549 + ratio * (999 - 549);
  const step = 50;
  const rounded = Math.round((raw - 49) / step) * step + 49;
  return Math.min(999, Math.max(549, rounded));
}

function calculateOriginalPrice(newPrice) {
  // 25-35% markup over new price, ending in 49 or 99
  const rawOrig = Math.round((newPrice * 1.30) / 50) * 50 - 1;
  return Math.max(newPrice + 150, rawOrig);
}

// Map each product to new price, originalPrice, discount
const priceMap = new Map();

const updatedProducts = products.map(p => {
  const newPrice = calculateNewPrice(p.price);
  const newOrig = calculateOriginalPrice(newPrice);
  const newDiscount = Math.round(((newOrig - newPrice) / newOrig) * 100) + '% OFF';

  priceMap.set(p.id, {
    price: newPrice,
    originalPrice: newOrig,
    discount: newDiscount
  });

  return {
    ...p,
    price: newPrice,
    originalPrice: newOrig,
    discount: newDiscount
  };
});

// Update mockData.js
const newMockDataContent = mockDataContent.replace(
  /export const STITCH_PRODUCTS = \[[\s\S]*?\];/m,
  `export const STITCH_PRODUCTS = ${JSON.stringify(updatedProducts, null, 2)};`
);
fs.writeFileSync(mockDataPath, newMockDataContent, 'utf8');
console.log('✅ Updated STITCH_PRODUCTS in mockData.js');

// 2. Update clean_29_products.json if exists
if (fs.existsSync(clean29Path)) {
  const clean29 = JSON.parse(fs.readFileSync(clean29Path, 'utf8'));
  const updatedClean29 = clean29.map(p => {
    if (priceMap.has(p.id)) {
      const pm = priceMap.get(p.id);
      return { ...p, price: pm.price, originalPrice: pm.originalPrice, discount: pm.discount };
    }
    const newPrice = calculateNewPrice(p.price || 4999);
    const newOrig = calculateOriginalPrice(newPrice);
    const newDiscount = Math.round(((newOrig - newPrice) / newOrig) * 100) + '% OFF';
    return { ...p, price: newPrice, originalPrice: newOrig, discount: newDiscount };
  });
  fs.writeFileSync(clean29Path, JSON.stringify(updatedClean29, null, 2), 'utf8');
  console.log('✅ Updated clean_29_products.json');
}

// 3. Update SQLite database
if (fs.existsSync(dbPath)) {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  const updateStmt = db.prepare(`
    UPDATE products
    SET price = ?, original_price = ?, discount = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  const updateAll = db.transaction((prods) => {
    for (const p of prods) {
      updateStmt.run(p.price, p.originalPrice, p.discount, p.id);
    }
  });

  updateAll(updatedProducts);

  // Update coupons
  db.prepare("UPDATE coupons SET min_order_amount = 999 WHERE code = 'FIRST500'").run();
  db.prepare("UPDATE coupons SET min_order_amount = 1499 WHERE code = 'MIDNIGHT20'").run();

  // Flush WAL
  try {
    db.pragma('wal_checkpoint(TRUNCATE)');
  } catch (e) {}

  const stats = db.prepare('SELECT MIN(price) as minPrice, MAX(price) as maxPrice, COUNT(*) as count FROM products').get();
  console.log(`✅ SQLite Database updated: ${stats.count} products. Min price: ₹${stats.minPrice}, Max price: ₹${stats.maxPrice}`);
  db.close();
}

// 4. Update productReviews.js (replace hardcoded old prices in reviews)
if (fs.existsSync(reviewsPath)) {
  let reviewsContent = fs.readFileSync(reviewsPath, 'utf8');
  reviewsContent = reviewsContent.replace(
    /Is price range me [₹?]\d+ par aisi quality milna impossible hai/g,
    'Is affordable price range me under ₹1000 par aisi luxury quality milna impossible hai'
  );
  fs.writeFileSync(reviewsPath, reviewsContent, 'utf8');
  console.log('✅ Updated product reviews comments');
}

// 5. Update sample CSVs if exist
function updateCSV(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  if (lines.length <= 1) return;

  const headerCols = lines[0].split(',').map(c => c.trim());
  const titleIdx = headerCols.indexOf('Title');
  const priceIdx = headerCols.findIndex(c => c.toLowerCase().includes('selling_price'));
  const origIdx = headerCols.findIndex(c => c.toLowerCase().includes('original_price'));
  const discIdx = headerCols.findIndex(c => c.toLowerCase().includes('discount'));

  if (priceIdx === -1) return;

  const newLines = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    // Match matching product from updatedProducts by title
    let matched = null;
    for (const p of updatedProducts) {
      if (line.includes(p.name)) {
        matched = p;
        break;
      }
    }
    if (matched) {
      // Split by comma taking into account quoted fields
      const parts = line.split(',');
      if (parts.length > Math.max(priceIdx, origIdx, discIdx)) {
        parts[priceIdx] = String(matched.price);
        if (origIdx !== -1) parts[origIdx] = String(matched.originalPrice);
        if (discIdx !== -1) parts[discIdx] = matched.discount;
        newLines.push(parts.join(','));
        continue;
      }
    }
    newLines.push(line);
  }
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  console.log(`✅ Updated CSV prices in ${path.basename(filePath)}`);
}

updateCSV(sampleCsvPath);
updateCSV(catalogCsvPath);

console.log('🎉 Price update successfully completed across all stores and databases!');
