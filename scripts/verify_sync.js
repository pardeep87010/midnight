import Database from 'better-sqlite3';
import { STITCH_PRODUCTS } from '../src/data/mockData.js';

const db = new Database('database/midnight_bloom.db');
const dbProds = db.prepare('SELECT * FROM products').all();
console.log('Database total products:', dbProds.length);
console.log('MockData total products:', STITCH_PRODUCTS.length);

const lastProd = dbProds[dbProds.length - 1];
console.log('\n--- 101st Product in DB ---');
console.log('Name:', lastProd.name);
console.log('Category:', lastProd.category, '| Subcategory:', lastProd.subcategory);
console.log('Price: ₹' + lastProd.price, '| MRP: ₹' + lastProd.original_price, '| Discount:', lastProd.discount);
console.log('Images:', JSON.parse(lastProd.images_json));

console.log('\n--- Sample of Products with Multiple Images ---');
dbProds.filter(p => JSON.parse(p.images_json).length > 2).slice(0, 8).forEach(p => {
  const imgs = JSON.parse(p.images_json);
  console.log(`- ${p.name}: ${imgs.length} images -> [${imgs.map(i => i.split('_').pop()).join(', ')}]`);
});
