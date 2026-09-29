import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImage = 'C:/Users/20092/.gemini/antigravity/brain/e8f01de8-8d5e-4112-84e4-02f1b613f50d/.user_uploaded/media_1790620964632.jpg';
const publicDir = 'public';

if (!fs.existsSync(sourceImage)) {
  console.error(`Source image not found at: ${sourceImage}`);
  process.exit(1);
}

async function generateFavicons() {
  console.log(`Processing source image: ${sourceImage}`);
  const inputBuffer = fs.readFileSync(sourceImage);

  // 1. High-Res Favicon.png (512x512)
  const png512 = await sharp(inputBuffer)
    .resize(512, 512, { fit: 'cover' })
    .png({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'Favicon.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'logo.png'), png512);
  console.log('✅ Generated 512x512 PNGs (Favicon.png, favicon.png, logo.png, android-chrome-512x512.png)');

  // 2. Apple Touch Icon (180x180)
  const png180 = await sharp(inputBuffer)
    .resize(180, 180, { fit: 'cover' })
    .png({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  console.log('✅ Generated 180x180 PNG (apple-touch-icon.png)');

  // 3. Android Chrome 192x192
  const png192 = await sharp(inputBuffer)
    .resize(192, 192, { fit: 'cover' })
    .png({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), png192);
  console.log('✅ Generated 192x192 PNG (android-chrome-192x192.png)');

  // 4. Standard Favicon 32x32
  const png32 = await sharp(inputBuffer)
    .resize(32, 32, { fit: 'cover' })
    .png({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  console.log('✅ Generated 32x32 PNG (favicon-32x32.png)');

  // 5. Standard Favicon 16x16
  const png16 = await sharp(inputBuffer)
    .resize(16, 16, { fit: 'cover' })
    .png({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  console.log('✅ Generated 16x16 PNG (favicon-16x16.png)');

  // 6. ICO file (64x64 / 32x32 PNG structure in .ico container)
  const icoPng = await sharp(inputBuffer)
    .resize(64, 64, { fit: 'cover' })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoPng);
  console.log('✅ Generated favicon.ico');

  console.log('\n🎉 All favicon and logo assets successfully created in /public directory!');
}

generateFavicons().catch(err => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
