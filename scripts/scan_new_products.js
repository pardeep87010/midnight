import fs from 'fs';
import path from 'path';

const imgDir = 'public/product-images';
const csvPath = 'public/templates/100_verified_luxury_toys_catalog.csv';

const imgFiles = fs.readdirSync(imgDir);
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.trim().split('\n');

const csvTitles = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  let title = '';
  if (line.startsWith('"')) {
    title = line.substring(1, line.indexOf('"', 1));
  } else {
    title = line.split(',')[0];
  }
  if (title) csvTitles.push(title.trim());
}

console.log('Total Titles in CSV:', csvTitles.length);

const imgProductMap = {};
for (const file of imgFiles) {
  const match = file.match(/^(.+)_(\d+)\.(webp|jpg|jpeg|png)$/i);
  if (match) {
    const prodName = match[1].trim();
    const idx = parseInt(match[2], 10);
    if (!imgProductMap[prodName]) {
      imgProductMap[prodName] = [];
    }
    imgProductMap[prodName].push({ file, idx, path: '/product-images/' + file });
  } else {
    console.log('Unmatched file:', file);
  }
}

for (const k of Object.keys(imgProductMap)) {
  imgProductMap[k].sort((a, b) => a.idx - b.idx);
}

console.log('Total unique products with images:', Object.keys(imgProductMap).length);

const newProductsNotInCSV = [];
for (const prodName of Object.keys(imgProductMap)) {
  const found = csvTitles.find(t => {
    const tClean = t.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pClean = prodName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return tClean === pClean || tClean.includes(pClean) || pClean.includes(tClean);
  });
  if (!found) {
    newProductsNotInCSV.push(prodName);
  }
}

console.log('\n--- NEW PRODUCTS NOT IN CSV ---');
console.log(newProductsNotInCSV);

console.log('\n--- ALL PRODUCTS WITH IMAGE COUNTS ---');
Object.keys(imgProductMap).sort().forEach((name, i) => {
  const inCsv = csvTitles.some(t => {
    const tClean = t.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pClean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return tClean === pClean || tClean.includes(pClean) || pClean.includes(tClean);
  });
  console.log(`${i + 1}. [${inCsv ? 'IN CSV' : '★ NEW'}] ${name} (${imgProductMap[name].length} images): [${imgProductMap[name].map(x => x.idx).join(', ')}]`);
});
