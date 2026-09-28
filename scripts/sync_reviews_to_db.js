import Database from 'better-sqlite3';
import { PRODUCT_REVIEWS_MAP } from '../src/data/productReviews.js';

const db = new Database('database/midnight_bloom.db');
db.pragma('journal_mode = WAL');

// Clear existing reviews
db.prepare('DELETE FROM reviews').run();

const insertReview = db.prepare(`
  INSERT INTO reviews (
    id, product_id, author_name, rating, title, content, date, is_verified
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

let totalInserted = 0;

const insertAll = db.transaction(() => {
  for (const [productId, reviewsList] of Object.entries(PRODUCT_REVIEWS_MAP)) {
    for (const r of reviewsList) {
      insertReview.run(
        r.id || `rev-${productId}-${Math.random().toString(36).slice(2, 7)}`,
        productId,
        r.author || r.name || 'Verified Customer',
        r.rating || 5,
        r.title || '',
        r.comment || r.content || '',
        r.date || 'Recent',
        r.verified ? 1 : 1
      );
      totalInserted++;
    }
  }
});

insertAll();

const count = db.prepare('SELECT COUNT(*) as c FROM reviews').get().c;
console.log(`✅ Successfully seeded SQLite 'reviews' table: ${count} total customer reviews live in database!`);
