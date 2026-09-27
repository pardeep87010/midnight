import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const publicImagesDir = path.join(__dirname, '../public/product-images');
const catalogCsvPath = path.join(__dirname, '../public/templates/100_verified_luxury_toys_catalog.csv');
const sampleCsvPath = path.join(__dirname, '../public/templates/midnight_bloom_product_import_sample.csv');
const mockDataPath = path.join(__dirname, '../src/data/mockData.js');
const dbPath = path.join(__dirname, '../database/midnight_bloom.db');

const desktopCsvPath = 'C:\\Users\\20092\\OneDrive\\Desktop\\Midnight_Bloom_100_Products_List.csv';
const desktopDocPath = 'C:\\Users\\20092\\OneDrive\\Desktop\\Midnight_Bloom_100_Products_Document.doc';
const desktopTxtPath = 'C:\\Users\\20092\\OneDrive\\Desktop\\Midnight_Bloom_100_Products_Document.txt';

// Safe file writer helper with retry for OneDrive/Excel locks
function safeWriteFileSync(filePath, content, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`💾 Saved file: ${filePath}`);
      return;
    } catch (err) {
      if (err.code === 'EBUSY' && attempt < retries) {
        console.warn(`⚠️ File ${path.basename(filePath)} busy, retrying in 500ms (attempt ${attempt}/${retries})...`);
        const waitTill = new Date(new Date().getTime() + 500);
        while (waitTill > new Date()) {}
      } else {
        console.warn(`Could not write ${filePath}: ${err.message}`);
        return;
      }
    }
  }
}

// Helper to parse CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });
    rows.push(obj);
  }
  return { headers, rows };
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function escapeCSV(val) {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// 1. Read existing CSV
const { headers, rows } = parseCSV(fs.readFileSync(catalogCsvPath, 'utf8'));
console.log(`📊 Found ${rows.length} existing products in CSV.`);

// 2. Scan public/product-images
const imgFiles = fs.readdirSync(publicImagesDir);
const imgGroups = {};

for (const f of imgFiles) {
  const m = f.match(/^(.+)_(\d+)\.(webp|jpg|jpeg|png|gif|avif)$/i);
  if (m) {
    const prodName = m[1].trim();
    const idx = parseInt(m[2], 10);
    if (!imgGroups[prodName]) imgGroups[prodName] = [];
    imgGroups[prodName].push({ file: f, idx, url: `/product-images/${f}` });
  }
}

// Sort each image group by index 0, 1, 2, ...
for (const k in imgGroups) {
  imgGroups[k].sort((a, b) => a.idx - b.idx);
}

console.log(`🖼️ Scanned ${Object.keys(imgGroups).length} unique product image sets in public/product-images.`);

// 3. Define New 101st Product
const NEW_101_PRODUCT = {
  Title: 'Aoonice AI-Sync Clitoral Air-Pulse & Pussy Pump Vibrator',
  Department_Category: 'air-pressure-suction',
  Subcategory: 'Womanizer Air-Wave',
  Selling_Price_INR: '4999',
  Original_Price_INR: '6999',
  Discount_Tag: '28% OFF',
  Badge_Tag: 'AI Pleasure Sync',
  Stock_Units: '50',
  Subtitle: 'AI-synchronized touchless air-pulse suction and clitoral vacuum pump',
  Description: 'Engineered with responsive AI-sync technology that adapts pulsation rhythms to natural arousal cues. Combines targeted touchless air-pulse clitoral resonance with gentle vacuum suction for deep, multi-layered orgasms.',
  Sound_Level: '< 28 dB (Whisper Silent)',
  Material: '100% US FDA-Grade Liquid Silicone & Rose Gold ABS Alloy',
  Battery_Life: '120 min Runtime / Magnetic USB Fast Charge',
  Waterproof_Rating: 'IPX7 100% Submersible',
  Modes_Count: '10 Sensation Frequencies + Intelligent AI Sync Mode',
  Image_URLs_Semicolon_Separated: '',
  Colors_Name_Hex_Pairs: 'Velvet Rose:#B56571, Obsidian Onyx:#1C1C1C, Pearl Blush:#F0B8BE'
};

// Check if new product is already in rows
const newIndex = rows.findIndex(r => normalize(r.Title).includes('aoonice') || normalize(r.Title).includes('pussypump'));
if (newIndex === -1) {
  rows.push(NEW_101_PRODUCT);
  console.log(`➕ Appended 101st product: "${NEW_101_PRODUCT.Title}"`);
} else {
  rows[newIndex] = NEW_101_PRODUCT;
}

// 4. Map images to all products
const ALL_PRODUCTS = [];
let localImageCount = 0;
const matchedImageKeys = new Set();

rows.forEach((r, idx) => {
  const normTitle = normalize(r.Title);
  let matchedGroupKey = null;

  // Direct match or substring match
  for (const gKey in imgGroups) {
    const normG = normalize(gKey);
    if (normTitle === normG || normTitle.includes(normG) || normG.includes(normTitle)) {
      matchedGroupKey = gKey;
      break;
    }
  }

  // Keyword match fallback
  if (!matchedGroupKey) {
    const words = r.Title.toLowerCase().split(/[\s\-&+,]+/).filter(w => w.length > 2);
    let bestScore = 0;
    for (const gKey in imgGroups) {
      const gLower = gKey.toLowerCase();
      const matchWords = words.filter(w => gLower.includes(w)).length;
      const score = matchWords / words.length;
      if (score > 0.4 && matchWords >= 2 && score > bestScore) {
        bestScore = score;
        matchedGroupKey = gKey;
      }
    }
  }

  let finalImages = [];
  if (matchedGroupKey && imgGroups[matchedGroupKey].length > 0) {
    finalImages = imgGroups[matchedGroupKey].map(x => x.url);
    matchedImageKeys.add(matchedGroupKey);
    localImageCount++;
  } else if (r.Image_URLs_Semicolon_Separated) {
    finalImages = r.Image_URLs_Semicolon_Separated.split(';').map(s => s.trim()).filter(Boolean);
  }

  if (finalImages.length === 0) {
    finalImages = ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'];
  }

  // Parse colors
  let colors = [];
  if (r.Colors_Name_Hex_Pairs) {
    colors = r.Colors_Name_Hex_Pairs.split(',').map(c => {
      const [name, hex] = c.trim().split(':');
      return { name: name?.trim() || 'Standard', hex: hex?.trim() || '#B76E79' };
    });
  }
  if (colors.length === 0) {
    colors = [{ name: 'Velvet Rose', hex: '#B76E79' }, { name: 'Midnight Onyx', hex: '#1C1C1C' }];
  }

  // Parse specs
  const specs = {
    sound: r.Sound_Level || '< 28 dB (Whisper Silent)',
    material: r.Material || '100% Medical Liquid Silicone',
    battery: r.Battery_Life || '120 min USB Rechargeable',
    waterproof: r.Waterproof_Rating || 'IPX7 100% Waterproof',
    modes: r.Modes_Count || '10 Sensation Frequencies'
  };

  const id = r.Title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const inTheBox = [
    `${r.Title} Main Unit`,
    'Magnetic USB Fast Charger / User Guide',
    'Velvet Travel Pouch',
    'Confidential User Manual & Warranty Card'
  ];

  ALL_PRODUCTS.push({
    id,
    name: r.Title,
    slug: id,
    category: r.Department_Category,
    subcategory: r.Subcategory,
    price: Number(r.Selling_Price_INR) || 2999,
    originalPrice: Number(r.Original_Price_INR) || 3999,
    discount: r.Discount_Tag || '25% OFF',
    badge: r.Badge_Tag || 'Best Seller',
    stock: Number(r.Stock_Units) || 50,
    subtitle: r.Subtitle || '',
    description: r.Description || '',
    sound: specs.sound,
    material: specs.material,
    battery: specs.battery,
    waterproof: specs.waterproof,
    modes: specs.modes,
    specs,
    colors,
    inTheBox,
    images: finalImages,
    rating: 5.0,
    reviewsCount: Math.floor(Math.random() * 120) + 40
  });

  // Update row for CSV export
  r.Image_URLs_Semicolon_Separated = finalImages.join(';');
});

console.log(`✅ Processed all ${ALL_PRODUCTS.length} products. Local image sets linked: ${localImageCount}/${ALL_PRODUCTS.length} (Image Groups mapped: ${matchedImageKeys.size}/${Object.keys(imgGroups).length})`);

// 5. Update SQLite Database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

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
      p.slug,
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

insertAll(ALL_PRODUCTS);
const dbCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
console.log(`💾 SQLite Database Synchronized: ${dbCount} products now in database/midnight_bloom.db!`);

// 6. Update src/data/mockData.js
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
const productsCode = `export const STITCH_PRODUCTS = ${JSON.stringify(ALL_PRODUCTS, null, 2)};`;
mockDataContent = mockDataContent.replace(/export const STITCH_PRODUCTS = \[[\s\S]*?\];/, productsCode);
fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
console.log(`⚡ Updated STITCH_PRODUCTS in src/data/mockData.js with ${ALL_PRODUCTS.length} products!`);

// 7. Generate CSV Files
const csvHeaderLine = [
  'Title',
  'Department_Category',
  'Subcategory',
  'Selling_Price_INR',
  'Original_Price_INR',
  'Discount_Tag',
  'Badge_Tag',
  'Stock_Units',
  'Subtitle',
  'Description',
  'Sound_Level',
  'Material',
  'Battery_Life',
  'Waterproof_Rating',
  'Modes_Count',
  'Image_URLs_Semicolon_Separated',
  'Colors_Name_Hex_Pairs'
].map(h => `"${h}"`).join(',');

const csvLines = [csvHeaderLine];
for (const p of ALL_PRODUCTS) {
  const imagesStr = p.images.join(';');
  const colorsStr = p.colors.map(c => `${c.name}:${c.hex}`).join(',');
  const row = [
    escapeCSV(p.name),
    escapeCSV(p.category),
    escapeCSV(p.subcategory),
    p.price,
    p.originalPrice,
    escapeCSV(p.discount),
    escapeCSV(p.badge),
    p.stock,
    escapeCSV(p.subtitle),
    escapeCSV(p.description),
    escapeCSV(p.sound),
    escapeCSV(p.material),
    escapeCSV(p.battery),
    escapeCSV(p.waterproof),
    escapeCSV(p.modes),
    escapeCSV(imagesStr),
    escapeCSV(colorsStr)
  ];
  csvLines.push(row.join(','));
}

const csvOutput = csvLines.join('\n');
safeWriteFileSync(catalogCsvPath, csvOutput);
safeWriteFileSync(sampleCsvPath, csvOutput);
safeWriteFileSync(desktopCsvPath, csvOutput);

// 8. Generate Desktop Text and Word (.doc) Catalog Documents
const textLines = [
  `MIDNIGHT BLOOM - ${ALL_PRODUCTS.length} VERIFIED LUXURY PRODUCTS CATALOG`,
  `====================================================\n`
];

ALL_PRODUCTS.forEach((p, i) => {
  textLines.push(`${i + 1}. ${p.name}`);
  textLines.push(`   - Category: ${p.category} (${p.subcategory})`);
  textLines.push(`   - Selling Price: INR ${p.price} (MRP: INR ${p.originalPrice} | ${p.discount})`);
  textLines.push(`   - Subtitle: ${p.subtitle}`);
  textLines.push(`   - Description: ${p.description}`);
  textLines.push(`   - Specifications: Sound: ${p.sound} | Material: ${p.material} | Battery: ${p.battery} | Waterproof: ${p.waterproof} | Modes: ${p.modes}`);
  textLines.push(`   - Images (${p.images.length}): ${p.images.join(' | ')}`);
  textLines.push(``);
});

const textContent = textLines.join('\n');
safeWriteFileSync(desktopTxtPath, textContent);

// Rich HTML-based .doc format for Microsoft Word
const htmlDocContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Midnight Bloom - Luxury Products Catalog</title>
<style>
  body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; line-height: 1.6; color: #1e293b; background: #ffffff; padding: 20px; }
  h1 { color: #831843; font-size: 24pt; border-bottom: 2px solid #f43f5e; padding-bottom: 8px; margin-bottom: 20px; }
  .summary-box { background-color: #fdf2f8; border-left: 4px solid #db2777; padding: 12px 16px; margin-bottom: 24px; }
  .product-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fafafa; }
  .product-title { font-size: 14pt; font-weight: bold; color: #0f172a; margin-top: 0; }
  .badge { display: inline-block; background: #db2777; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 9pt; font-weight: bold; }
  .price-tag { font-size: 11pt; color: #059669; font-weight: bold; }
  .mrp-tag { color: #64748b; text-decoration: line-through; font-size: 10pt; }
  .discount-tag { color: #e11d48; font-weight: bold; font-size: 10pt; }
  .meta-label { font-weight: bold; color: #475569; }
  .spec-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .spec-table td { padding: 4px 8px; border: 1px solid #e2e8f0; font-size: 9.5pt; }
  .spec-table td.label { background: #f1f5f9; font-weight: 600; width: 25%; }
  .images-list { font-size: 8.5pt; color: #64748b; word-break: break-all; margin-top: 6px; }
</style>
</head>
<body>
  <h1>Midnight Bloom — ${ALL_PRODUCTS.length} Luxury Wellness Products Catalog</h1>
  <div class="summary-box">
    <strong>Catalog Overview:</strong> Total ${ALL_PRODUCTS.length} Verified Luxury Intimate Wellness Products | Complete Pricing in INR | High-Resolution Local & Studio Images Linked.
  </div>

  ${ALL_PRODUCTS.map((p, idx) => `
    <div class="product-card">
      <div class="product-title">${idx + 1}. ${p.name} <span class="badge">${p.badge}</span></div>
      <p style="margin: 4px 0 8px 0; color: #475569; font-style: italic;">${p.subtitle}</p>
      
      <p style="margin: 4px 0 12px 0;">
        <span class="price-tag">₹${p.price.toLocaleString('en-IN')}</span> 
        <span class="mrp-tag">₹${p.originalPrice.toLocaleString('en-IN')}</span> 
        <span class="discount-tag">(${p.discount})</span>
        &nbsp;|&nbsp; <span class="meta-label">Category:</span> ${p.category} (${p.subcategory})
        &nbsp;|&nbsp; <span class="meta-label">Stock:</span> ${p.stock} units
      </p>

      <p style="margin: 6px 0; font-size: 10pt;">${p.description}</p>

      <table class="spec-table">
        <tr>
          <td class="label">Sound Level</td>
          <td>${p.sound}</td>
          <td class="label">Material</td>
          <td>${p.material}</td>
        </tr>
        <tr>
          <td class="label">Battery Life</td>
          <td>${p.battery}</td>
          <td class="label">Waterproof Rating</td>
          <td>${p.waterproof}</td>
        </tr>
        <tr>
          <td class="label">Modes / Speeds</td>
          <td>${p.modes}</td>
          <td class="label">Available Colors</td>
          <td>${p.colors.map(c => c.name).join(', ')}</td>
        </tr>
      </table>

      <div class="images-list">
        <strong>Linked Product Images (${p.images.length}):</strong><br>
        ${p.images.map(img => `• ${img}`).join('<br>')}
      </div>
    </div>
  `).join('')}

</body>
</html>`;

safeWriteFileSync(desktopDocPath, htmlDocContent);

console.log(`\n🎉 SYNC COMPLETED SUCCESSFULLY!`);
console.log(`- Total Products: ${ALL_PRODUCTS.length}`);
console.log(`- New Product: Aoonice AI-Sync Clitoral Air-Pulse & Pussy Pump Vibrator (5 images linked: _0 to _4)`);
console.log(`- Total Local Multi-Image Sets Mapped: ${matchedImageKeys.size}/${Object.keys(imgGroups).length}`);
console.log(`- Desktop Word Doc: ${desktopDocPath}`);
console.log(`- Desktop Text Doc: ${desktopTxtPath}`);
console.log(`- Desktop CSV: ${desktopCsvPath}`);
