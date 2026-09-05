#!/usr/bin/env node

/**
 * ==============================================================================
 * Midnight Bloom - Automated Product Bulk Importer CLI Script
 * ==============================================================================
 * 
 * Usage:
 *   node scripts/bulk-import-products.js [path/to/file.csv]
 * 
 * Features:
 *   - Fast batch parsing & input sanitization
 *   - Automatic slug & SKU generation
 *   - Security validation (No script tags, valid price bounds)
 *   - Multi-image and multi-color parsing
 *   - Outputs verified JSON and detailed execution report
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust CSV Line Parser that respects quoted strings containing commas
function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

// Sanitize string to prevent XSS / malicious injection
function sanitize(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function runBulkImport() {
  console.log('\n======================================================');
  console.log(' ✨ MIDNIGHT BLOOM - AUTOMATED BULK IMPORTER ✨ ');
  console.log('======================================================\n');

  const args = process.argv.slice(2);
  const defaultCSV = path.join(__dirname, '../public/templates/products_import_template.csv');
  const targetCSV = args[0] ? path.resolve(args[0]) : defaultCSV;

  if (!fs.existsSync(targetCSV)) {
    console.error(`❌ Error: CSV file not found at path: ${targetCSV}`);
    process.exit(1);
  }

  console.log(`📂 Reading CSV file: ${targetCSV}...`);
  const rawContent = fs.readFileSync(targetCSV, 'utf8');
  const lines = rawContent.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length <= 1) {
    console.error('❌ Error: CSV file is empty or only contains headers.');
    process.exit(1);
  }

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  console.log(`📋 Detected Headers: ${headers.join(', ')}`);

  const importedProducts = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const rowNumber = i + 1;
    const values = parseCSVLine(lines[i]);

    if (values.length < headers.length) {
      errors.push(`Row ${rowNumber}: Incomplete columns (${values.length}/${headers.length}).`);
      continue;
    }

    const rowObj = {};
    headers.forEach((header, idx) => {
      rowObj[header] = values[idx] || '';
    });

    const name = sanitize(rowObj.name);
    if (!name) {
      errors.push(`Row ${rowNumber}: Product name is missing.`);
      continue;
    }

    const price = parseFloat(rowObj.price);
    if (isNaN(price) || price <= 0) {
      errors.push(`Row ${rowNumber}: Invalid price '${rowObj.price}'. Must be a positive number.`);
      continue;
    }

    const originalPrice = parseFloat(rowObj.originalprice) || (price * 1.25);
    const category = sanitize(rowObj.category) || 'vibrators';
    const subcategory = sanitize(rowObj.subcategory) || 'Luxury Instruments';
    const badge = sanitize(rowObj.badge) || 'New Release';
    const discount = sanitize(rowObj.discount) || `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`;
    const subtitle = sanitize(rowObj.subtitle) || 'Luxury body-safe sensual instrument';
    const description = sanitize(rowObj.description) || 'Designed for profound satisfaction with whisper-quiet performance and medical-grade materials.';

    // Parse images (semicolon or pipe separated)
    const rawImages = rowObj.images || '';
    const images = rawImages
      .split(/[;|]/)
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80');
    }

    // Parse color variants (Format: "Rose Gold:#C5A880;Onyx:#1C1C1C")
    const rawColors = rowObj.colors || '';
    const colors = [];
    if (rawColors) {
      rawColors.split(/[;|]/).forEach(pair => {
        const [cName, cHex] = pair.split(':');
        if (cName) {
          colors.push({
            name: cName.trim(),
            hex: (cHex && cHex.trim().startsWith('#')) ? cHex.trim() : '#C5A880'
          });
        }
      });
    }
    if (colors.length === 0) {
      colors.push({ name: 'Midnight Onyx', hex: '#1C1C1C' }, { name: 'Rose Gold', hex: '#C5A880' });
    }

    const productPayload = {
      id: generateSlug(name),
      name,
      category,
      subcategory,
      price,
      originalPrice,
      discount,
      badge,
      subtitle,
      description,
      rating: 5.0,
      reviewsCount: Math.floor(Math.random() * 200) + 15,
      images,
      colors,
      specs: {
        sound: sanitize(rowObj.sound) || '< 29 dB (Whisper Silent)',
        material: sanitize(rowObj.material) || '100% Medical Liquid Silicone',
        battery: sanitize(rowObj.battery) || '120 min Fast USB Charge',
        waterproof: sanitize(rowObj.waterproof) || 'IPX7 100% Waterproof',
        modes: sanitize(rowObj.modes) || '10 Vibration Speeds'
      },
      inTheBox: [
        name,
        'Magnetic Fast Charging USB Cable',
        'Velvet Protective Travel Pouch',
        'Confidential User Manual & 1-Year Warranty'
      ]
    };

    importedProducts.push(productPayload);
  }

  console.log('\n------------------------------------------------------');
  console.log(`✅ Processed Rows: ${lines.length - 1}`);
  console.log(`🎉 Successfully Validated: ${importedProducts.length} Products`);
  if (errors.length > 0) {
    console.log(`⚠️ Warnings / Skipped Rows (${errors.length}):`);
    errors.forEach(err => console.log(`   - ${err}`));
  }
  console.log('------------------------------------------------------\n');

  // Export to output JSON for direct state or DB seeding
  const outputPath = path.join(__dirname, '../public/templates/imported_products.json');
  fs.writeFileSync(outputPath, JSON.stringify(importedProducts, null, 2), 'utf8');
  console.log(`💾 Saved parsed products JSON to: ${outputPath}`);
  console.log('🚀 Ready to import directly into Midnight Bloom state or PostgreSQL!\n');
}

runBulkImport().catch(err => {
  console.error('Fatal Import Error:', err);
  process.exit(1);
});
