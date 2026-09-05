import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/product-images');

async function optimizeAllImages() {
  const files = fs.readdirSync(imagesDir).filter(f => !f.startsWith('_temp_'));
  console.log(`Starting in-memory buffer optimization for ${files.length} images...`);

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;
    totalOriginalBytes += originalSize;

    const ext = path.extname(file).toLowerCase();

    try {
      const inputBuffer = fs.readFileSync(filePath);
      let outputBuffer;

      if (ext === '.webp') {
        outputBuffer = await sharp(inputBuffer)
          .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toBuffer();
      } else if (ext === '.png') {
        outputBuffer = await sharp(inputBuffer)
          .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
          .png({ compressionLevel: 9, quality: 85 })
          .toBuffer();
      } else if (ext === '.jpg' || ext === '.jpeg') {
        outputBuffer = await sharp(inputBuffer)
          .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
      } else {
        continue;
      }

      const newSize = outputBuffer.length;
      if (newSize < originalSize) {
        fs.writeFileSync(filePath, outputBuffer);
        totalOptimizedBytes += newSize;
        const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
        console.log(`✓ ${file}: ${(originalSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (${reduction}% reduced)`);
      } else {
        totalOptimizedBytes += originalSize;
        console.log(`- ${file}: ${(originalSize / 1024).toFixed(1)} KB (already optimal)`);
      }
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err.message);
      totalOptimizedBytes += originalSize;
    }
  }

  const savedMB = ((totalOriginalBytes - totalOptimizedBytes) / (1024 * 1024)).toFixed(2);
  const totalReductionPercent = (((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1);

  console.log(`\n🎉 In-Memory Image Compression Complete!`);
  console.log(`- Before: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`- After: ${(totalOptimizedBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`- Saved: ${savedMB} MB (${totalReductionPercent}% smaller!)`);
}

optimizeAllImages().catch(console.error);
