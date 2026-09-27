import fs from 'fs';
import path from 'path';

const imgDir = 'public/product-images';
const files = fs.readdirSync(imgDir);

const groups = {};
const nonIndexed = [];

for (const f of files) {
  const m = f.match(/^(.+)_(\d+)\.(webp|jpg|jpeg|png|gif|avif)$/i);
  if (m) {
    const name = m[1].trim();
    const idx = parseInt(m[2], 10);
    if (!groups[name]) groups[name] = [];
    groups[name].push({ file: f, idx, ext: m[3] });
  } else {
    nonIndexed.push(f);
  }
}

for (const k in groups) {
  groups[k].sort((a, b) => a.idx - b.idx);
}

console.log('Total unique product groups found:', Object.keys(groups).length);
console.log('Total files processed:', files.length);
if (nonIndexed.length > 0) {
  console.log('Non-indexed files:', nonIndexed);
}

Object.keys(groups).sort().forEach((name, i) => {
  console.log(`${i + 1}. ${name} (${groups[name].length} imgs): [${groups[name].map(g => g.idx).join(', ')}]`);
});
