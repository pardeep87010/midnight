import fs from 'fs';
import path from 'path';

const catalogCsvPath = 'public/templates/100_verified_luxury_toys_catalog.csv';
const imgDir = 'public/product-images';

const csvLines = fs.readFileSync(catalogCsvPath, 'utf8').trim().split('\n');
const csvHeaders = csvLines[0].split(',');
const products = [];

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

for (let i = 1; i < csvLines.length; i++) {
  const parts = parseCSVLine(csvLines[i]);
  if (parts.length >= 17) {
    products.push({
      name: parts[0],
      category: parts[1],
      subcategory: parts[2],
      price: Number(parts[3]),
      originalPrice: Number(parts[4]),
      discount: parts[5],
      badge: parts[6],
      stock: Number(parts[7]),
      subtitle: parts[8],
      description: parts[9],
      sound: parts[10],
      material: parts[11],
      battery: parts[12],
      waterproof: parts[13],
      modes: parts[14],
      images: parts[15],
      colors: parts[16]
    });
  }
}

console.log(`Loaded ${products.length} products from CSV.`);

const files = fs.readdirSync(imgDir);
const groups = {};

for (const f of files) {
  const m = f.match(/^(.+)_(\d+)\.(webp|jpg|jpeg|png|gif|avif)$/i);
  if (m) {
    const name = m[1].trim();
    const idx = parseInt(m[2], 10);
    if (!groups[name]) groups[name] = [];
    groups[name].push({ file: f, idx, url: `/product-images/${f}` });
  }
}

for (const k in groups) {
  groups[k].sort((a, b) => a.idx - b.idx);
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

console.log('\n--- MATCHING RESULTS ---');
const matchedProductNames = new Set();
let matchedGroupsCount = 0;

for (const gName in groups) {
  const normG = normalize(gName);
  let matchedProd = null;

  for (const p of products) {
    const normP = normalize(p.name);
    if (normP === normG || normP.includes(normG) || normG.includes(normP)) {
      matchedProd = p;
      break;
    }
  }

  if (!matchedProd) {
    // try looser matching
    const gWords = gName.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    for (const p of products) {
      const pLower = p.name.toLowerCase();
      const matchWordCount = gWords.filter(w => pLower.includes(w)).length;
      if (matchWordCount >= 3 && matchWordCount >= gWords.length * 0.6) {
        matchedProd = p;
        break;
      }
    }
  }

  if (matchedProd) {
    matchedGroupsCount++;
    matchedProductNames.add(matchedProd.name);
    console.log(`✅ MATCH: "${gName}" (${groups[gName].length} imgs) -> "${matchedProd.name}"`);
  } else {
    console.log(`❌ NO MATCH (NEW PRODUCT!): "${gName}" (${groups[gName].length} imgs)`);
  }
}

console.log(`\nMatched groups: ${matchedGroupsCount} / ${Object.keys(groups).length}`);
console.log(`Products in catalog with matched local images: ${matchedProductNames.size} / ${products.length}`);
