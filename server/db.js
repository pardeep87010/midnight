import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure database directory exists
const dbDir = path.resolve(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'midnight_bloom.db');
const db = new Database(dbPath);

// Enable WAL mode for ultra-fast concurrent read/write performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize Database Tables
export function initDB() {
  console.log('⚡ Initializing Midnight Bloom SQLite Enterprise Database at:', dbPath);

  // 1. Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      subtitle TEXT,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      category TEXT NOT NULL,
      subcategory TEXT,
      badge TEXT,
      discount TEXT,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 1,
      stock INTEGER DEFAULT 45,
      specs_json TEXT,
      colors_json TEXT,
      in_the_box_json TEXT,
      images_json TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
  `);

  // 2. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT,
      customer_email TEXT,
      customer_city TEXT,
      total_amount REAL NOT NULL,
      payment_mode TEXT,
      packaging TEXT,
      statement_descriptor TEXT DEFAULT 'MB* SERVICES LLC',
      status TEXT DEFAULT 'Processing',
      items_json TEXT,
      idempotency_key TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
    CREATE INDEX IF NOT EXISTS idx_orders_idempotency ON orders(idempotency_key);
  `);

  // 3. VIP Coupons Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_percent REAL,
      discount_amount REAL,
      min_order_amount REAL DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      max_uses INTEGER DEFAULT 1000,
      current_uses INTEGER DEFAULT 0,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
  `);

  // 4. Event Bus Logs Table (ACID Idempotency Store)
  db.exec(`
    CREATE TABLE IF NOT EXISTS event_logs (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      payload_json TEXT,
      idempotency_key TEXT UNIQUE,
      status TEXT DEFAULT 'processed',
      retries INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_event_type ON event_logs(event_type);
  `);

  // 5. Environment & System Configuration Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS env_configs (
      key TEXT PRIMARY KEY,
      value TEXT,
      is_secret INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Customer Reviews Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      author_name TEXT,
      rating INTEGER DEFAULT 5,
      title TEXT,
      content TEXT,
      date TEXT,
      is_verified INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
  `);

  // 7. Confidential Saved Addresses Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      user_email TEXT,
      receiver_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      label TEXT DEFAULT 'Home',
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_addresses_user_email ON addresses(user_email);
  `);

  // Auto-migration for enhanced order address fields in existing database
  try { db.exec("ALTER TABLE orders ADD COLUMN customer_phone TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN shipping_address TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN customer_state TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN customer_pincode TEXT;"); } catch (e) {}

  // Seed default address if empty
  const checkAddresses = db.prepare('SELECT COUNT(*) as count FROM addresses').get();
  if (checkAddresses.count === 0) {
    const insertAddr = db.prepare(`
      INSERT INTO addresses (id, user_email, receiver_name, phone, address_line1, address_line2, city, state, pincode, label, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    insertAddr.run(
      'addr_def_1',
      '20092003pardeep@gmail.com',
      'Pardeep Kumar',
      '',
      'Flat 402, Imperial Heights, Worli Sea Face',
      'Near Coast Guard HQ',
      'Mumbai',
      'Maharashtra',
      '400018',
      'Home'
    );
  }

  // Insert Default VIP Coupons if not exists
  const checkCoupon = db.prepare('SELECT COUNT(*) as count FROM coupons').get();
  if (checkCoupon.count === 0) {
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (id, code, discount_percent, min_order_amount, is_active, max_uses)
      VALUES (?, ?, ?, ?, 1, 1000)
    `);
    insertCoupon.run('cpn-vip10', 'VIP10', 10, 0);
    insertCoupon.run('cpn-midnight20', 'MIDNIGHT20', 20, 2999);
    insertCoupon.run('cpn-first500', 'FIRST500', 15, 1999);
  }

  // Insert Default Environment Keys if not exists
  const checkConfig = db.prepare('SELECT COUNT(*) as count FROM env_configs').get();
  if (checkConfig.count === 0) {
    const insertConfig = db.prepare(`
      INSERT INTO env_configs (key, value, is_secret)
      VALUES (?, ?, ?)
    `);
    insertConfig.run('PAY0PRO_API_KEY', 'pay0pro_live_sk_948192847192', 1);
    insertConfig.run('PAY0PRO_MERCHANT_ID', 'MB_ENTERPRISE_INDIA_01', 0);
    insertConfig.run('RESEND_EMAIL_API_KEY', 're_mb_live_sec_83910284', 1);
    insertConfig.run('CLOUDFLARE_CDN_URL', 'https://cdn.midnightbloom.in', 0);
    insertConfig.run('DISCREET_DESCRIPTOR', 'MB* SERVICES LLC', 0);
  }

  // 8. Users & Authentication Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      phone TEXT DEFAULT '',
      auth_provider TEXT DEFAULT 'email', -- 'email' | 'google'
      avatar TEXT,
      tier TEXT DEFAULT 'Silver Member',
      points INTEGER DEFAULT 200,
      max_points INTEGER DEFAULT 1000,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);
  `);

  // Seed Super Admin in users table if not exists
  const checkAdmin = db.prepare("SELECT * FROM users WHERE email = '20092003pardeep@gmail.com'").get();
  if (!checkAdmin) {
    const adminPassHash = hashPassword('Kumar870');
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, auth_provider, tier, points, max_points, is_admin)
      VALUES (?, ?, ?, ?, '', 'email', 'Super Admin', 9999, 9999, 1)
    `).run('usr_admin_pardeep', 'Pardeep Kumar', '20092003pardeep@gmail.com', adminPassHash);
  }

  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  console.log(`✅ Database Schema Initialized! Live Products: ${prodCount} | Users: ${userCount}`);
}

import crypto from 'crypto';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  try {
    const [salt, key] = storedHash.split(':');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(hash, 'hex'));
  } catch (err) {
    return false;
  }
}

export default db;
