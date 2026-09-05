import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockDataPath = path.join(__dirname, '..', 'src', 'data', 'mockData.js');
let content = fs.readFileSync(mockDataPath, 'utf8');

// Function to convert USD price to clean Indian Rupee (INR)
function toInrPrice(usd) {
  const num = parseFloat(usd);
  if (isNaN(num)) return usd;
  // Multiply by 70 and round to nearest clean 99 or 499
  const raw = Math.round((num * 68) / 100) * 100;
  return Math.max(999, raw - 1); // e.g. 2499, 7999, 14999
}

// Replace price: XX with INR
content = content.replace(/price:\s*(\d+(\.\d+)?)/g, (match, p1) => {
  const inr = toInrPrice(p1);
  return `price: ${inr}`;
});

// Replace originalPrice: XX with INR
content = content.replace(/originalPrice:\s*(\d+(\.\d+)?)/g, (match, p1) => {
  const inr = toInrPrice(p1);
  return `originalPrice: ${inr}`;
});

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log('Successfully updated mockData.js prices to realistic INR values!');
