import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { STITCH_PRODUCTS } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure database directory exists (Supports persistent volume mount via DATA_DIR)
const dbDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Backup Ledger directory for zero data loss protection across deployments
const backupDir = path.resolve(__dirname, 'data_backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dbDir, 'midnight_bloom.db');
const db = new Database(dbPath);

// Synchronize all orders and users to persistent JSON ledger
export function syncPersistentBackup() {
  try {
    const allOrders = db.prepare('SELECT * FROM orders ORDER BY created_at ASC').all();
    const ordersFormatted = allOrders.map(o => ({
      id: o.id,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      customerPhone: o.customer_phone || '',
      customerCity: o.customer_city,
      customerState: o.customer_state || '',
      customerPincode: o.customer_pincode || '',
      shippingAddress: o.shipping_address,
      totalAmount: Number(o.total_amount),
      paymentMode: o.payment_mode,
      packaging: o.packaging,
      statementDescriptor: o.statement_descriptor,
      status: o.status,
      items: o.items_json ? JSON.parse(o.items_json) : [],
      idempotencyKey: o.idempotency_key,
      createdAt: o.created_at
    }));
    fs.writeFileSync(path.join(backupDir, 'seed_orders.json'), JSON.stringify(ordersFormatted, null, 2), 'utf8');

    const allUsers = db.prepare('SELECT id, name, email, phone, auth_provider, tier, points, max_points, is_admin, created_at, updated_at FROM users').all();
    const usersFormatted = allUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      authProvider: u.auth_provider,
      tier: u.tier,
      points: u.points,
      maxPoints: u.max_points,
      isAdmin: u.is_admin,
      createdAt: u.created_at,
      updatedAt: u.updated_at
    }));
    fs.writeFileSync(path.join(backupDir, 'seed_users.json'), JSON.stringify(usersFormatted, null, 2), 'utf8');
  } catch (err) {
    console.warn('⚠️ Backup sync notice:', err.message);
  }
}

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

  // Auto-migration for enhanced order address & payment gateway fields in existing database
  try { db.exec("ALTER TABLE orders ADD COLUMN customer_phone TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN shipping_address TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN customer_state TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN customer_pincode TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN payment_url TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN pay0_order_id TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN utr_number TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE orders ADD COLUMN payment_gateway TEXT;"); } catch (e) {}

  // Auto-clean any dummy seed addresses from database
  try {
    db.prepare("DELETE FROM addresses WHERE id = 'addr_def_1'").run();
  } catch (e) {}

  // Insert Default VIP Coupons if not exists
  const checkCoupon = db.prepare('SELECT COUNT(*) as count FROM coupons').get();
  if (checkCoupon.count === 0) {
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (id, code, discount_percent, min_order_amount, is_active, max_uses, current_uses)
      VALUES (?, ?, ?, ?, 1, 1000, 0)
    `);
    insertCoupon.run('cpn-vip10', 'VIP10', 10, 0);
    insertCoupon.run('cpn-midnight20', 'MIDNIGHT20', 20, 1499);
    insertCoupon.run('cpn-first500', 'FIRST500', 15, 999);
  }

  // Ensure real database usage count (no hardcoded/fake mock counts)
  try {
    db.prepare("UPDATE coupons SET current_uses = 0 WHERE current_uses > 50 AND id LIKE 'cpn-%'").run();
  } catch (e) {}

  // Auto-clean placeholder dummy or expired keys from database
  try {
    db.prepare("DELETE FROM env_configs WHERE value LIKE '%re_mb_live_sec%' OR value LIKE '%pay0pro_live_sk%' OR value = 're_gY8nmMMg_5PEg23HkG6MMEahdqeHmQ4Sy'").run();
  } catch (e) {}

  // Seed Default Domain configs if not set
  try {
    const upsertConfig = db.prepare(`
      INSERT INTO env_configs (key, value, is_secret, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);
    const checkDomain = db.prepare("SELECT value FROM env_configs WHERE key = 'RESEND_DOMAIN'").get();
    if (!checkDomain) {
      upsertConfig.run('RESEND_DOMAIN', 'playnixclub.bet', 0);
    }
    const checkFromEmail = db.prepare("SELECT value FROM env_configs WHERE key = 'FROM_EMAIL'").get();
    if (!checkFromEmail) {
      upsertConfig.run('FROM_EMAIL', 'Midnight Bloom <orders@playnixclub.bet>', 0);
    }

    // Seed Pay0 Dual Gateway Defaults if not already set
    const checkActiveGateway = db.prepare("SELECT value FROM env_configs WHERE key = 'ACTIVE_PAYMENT_GATEWAY'").get();
    if (!checkActiveGateway) {
      upsertConfig.run('ACTIVE_PAYMENT_GATEWAY', 'pay0_std', 0);
    }
    const checkStdToken = db.prepare("SELECT value FROM env_configs WHERE key = 'PAY0_STD_USER_TOKEN'").get();
    if (!checkStdToken) {
      upsertConfig.run('PAY0_STD_USER_TOKEN', 'e7d3b644cef8f32dec1b8ce4cd5802e3', 1);
    }
    const checkStdSecret = db.prepare("SELECT value FROM env_configs WHERE key = 'PAY0_STD_SECRET_KEY'").get();
    if (!checkStdSecret) {
      upsertConfig.run('PAY0_STD_SECRET_KEY', 'IAvFPh0w1N816336807', 1);
    }
  } catch (e) {}

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

  // Auto-synchronize products table strictly with the 69 verified real products
  const currentProds = db.prepare('SELECT id, name, price, images_json FROM products').all();
  const hasDummy = currentProds.some(p => 
    !p.images_json || 
    p.images_json.includes('unsplash') || 
    p.name.includes('Velvet Silicone Butt Plug') ||
    p.name.includes('Graduated Anal Beads')
  );
  const hasOldPrice = currentProds.some(p => p.price >= 1000);

  if (currentProds.length !== STITCH_PRODUCTS.length || hasDummy || hasOldPrice) {
    console.log(`🔄 Auto-syncing products catalog: Database had ${currentProds.length} items (dummy: ${hasDummy}, old price >= 1000: ${hasOldPrice}). Locking to strictly ${STITCH_PRODUCTS.length} verified real products...`);
    db.prepare('DELETE FROM products').run();
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, name, slug, subtitle, description, price, original_price,
        category, subcategory, badge, discount, rating, reviews_count,
        stock, specs_json, colors_json, in_the_box_json, images_json, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    const insertAll = db.transaction((items) => {
      for (const p of items) {
        insertProd.run(
          p.id,
          p.name,
          p.slug || p.id,
          p.subtitle || '',
          p.description || '',
          p.price,
          p.originalPrice || null,
          p.category,
          p.subcategory || '',
          p.badge || null,
          p.discount || null,
          p.rating || 5.0,
          p.reviewsCount || 1,
          p.stock || 45,
          JSON.stringify(p.specs || {}),
          JSON.stringify(p.colors || []),
          JSON.stringify(p.inTheBox || []),
          JSON.stringify(p.images || [])
        );
      }
    });
    insertAll(STITCH_PRODUCTS);
    console.log(`✅ Database synchronized: Exactly ${STITCH_PRODUCTS.length} verified real products are now live!`);
  }

  // 9. Auto-Restore Users from Persistent Ledger if missing
  try {
    const seedUsersFile = path.join(backupDir, 'seed_users.json');
    if (fs.existsSync(seedUsersFile)) {
      const usersData = JSON.parse(fs.readFileSync(seedUsersFile, 'utf8'));
      if (Array.isArray(usersData)) {
        for (const u of usersData) {
          const exists = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(u.email);
          if (!exists) {
            db.prepare(`
              INSERT INTO users (id, name, email, phone, auth_provider, tier, points, max_points, is_admin, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              u.id || `usr_${Date.now()}`,
              u.name,
              u.email.toLowerCase(),
              u.phone || '',
              u.authProvider || 'email',
              u.tier || 'Silver Member',
              u.points || 200,
              u.maxPoints || 1000,
              u.isAdmin ? 1 : 0,
              u.createdAt || new Date().toISOString(),
              u.updatedAt || u.createdAt || new Date().toISOString()
            );
            console.log(`🛡️ [LEDGER RECOVERY] Restored member ${u.email} (${u.name}) into database.`);
          }
        }
      }
    }
  } catch (e) {
    console.warn('⚠️ User seed restore notice:', e.message);
  }

  // 10. Auto-Restore Orders from Persistent Ledger if missing
  try {
    const seedOrdersFile = path.join(backupDir, 'seed_orders.json');
    if (fs.existsSync(seedOrdersFile)) {
      const ordersData = JSON.parse(fs.readFileSync(seedOrdersFile, 'utf8'));
      if (Array.isArray(ordersData)) {
        for (const ord of ordersData) {
          const exists = db.prepare('SELECT id FROM orders WHERE id = ?').get(ord.id);
          if (!exists) {
            db.prepare(`
              INSERT INTO orders (
                id, customer_name, customer_email, customer_phone, customer_city, customer_state, customer_pincode,
                shipping_address, total_amount, payment_mode, packaging, statement_descriptor, status, items_json, idempotency_key, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              ord.id,
              ord.customerName,
              ord.customerEmail,
              ord.customerPhone || '',
              ord.customerCity || '',
              ord.customerState || '',
              ord.customerPincode || '',
              ord.shippingAddress || '',
              ord.totalAmount,
              ord.paymentMode || 'Cash on Delivery (COD)',
              ord.packaging || '100% Plain Unbranded Box',
              ord.statementDescriptor || 'MB* SERVICES LLC',
              ord.status || 'Processing',
              JSON.stringify(ord.items || []),
              ord.idempotencyKey || `idemp_${Date.now()}`,
              ord.createdAt || new Date().toISOString()
            );
            console.log(`🛡️ [LEDGER RECOVERY] Restored order #${ord.id} (${ord.customerEmail}) into database.`);
          }
        }
      }
    }
  } catch (e) {
    console.warn('⚠️ Order seed restore notice:', e.message);
  }

  // 11. Self-Healing Customer Reconciliation:
  // Every customer who placed an order MUST have a corresponding record in the `users` table
  try {
    const customerOrders = db.prepare(`
      SELECT customer_name, customer_email, customer_phone, customer_city, customer_state, customer_pincode, shipping_address, created_at
      FROM orders 
      WHERE customer_email IS NOT NULL AND customer_email != ''
      GROUP BY LOWER(customer_email)
    `).all();

    for (const cust of customerOrders) {
      const cleanEmail = cust.customer_email.trim().toLowerCase();
      const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
      if (!existing) {
        const newId = `usr_ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        db.prepare(`
          INSERT INTO users (id, name, email, phone, auth_provider, tier, points, max_points, is_admin, created_at, updated_at)
          VALUES (?, ?, ?, ?, 'order_checkout', 'Silver Member', 200, 1000, 0, ?, ?)
        `).run(newId, cust.customer_name || 'Customer', cleanEmail, cust.customer_phone || '', cust.created_at, cust.created_at);
        console.log(`🛡️ [SELF-HEALING] Reconciled and auto-created member account for buyer: ${cleanEmail}`);
      }

      // Also ensure address exists in addresses table
      const addrCheck = db.prepare('SELECT id FROM addresses WHERE LOWER(user_email) = ?').get(cleanEmail);
      if (!addrCheck && cust.shipping_address) {
        db.prepare(`
          INSERT INTO addresses (id, user_email, receiver_name, phone, address_line1, address_line2, city, state, pincode, label, is_default, created_at)
          VALUES (?, ?, ?, ?, ?, '', ?, ?, ?, 'Home', 1, ?)
        `).run(
          `addr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          cleanEmail,
          cust.customer_name || 'Customer',
          cust.customer_phone || '',
          cust.shipping_address,
          cust.customer_city || '',
          cust.customer_state || '',
          cust.customer_pincode || '',
          cust.created_at
        );
      }
    }
  } catch (e) {
    console.warn('⚠️ Customer reconciliation notice:', e.message);
  }

  // Keep persistent backup synchronized
  try {
    syncPersistentBackup();
  } catch (e) {}

  // Force checkpoint to flush WAL into the .db file on disk
  try {
    db.pragma('wal_checkpoint(TRUNCATE)');
  } catch (e) {}

  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  console.log(`✅ Database Schema Initialized! Live Products: ${prodCount} | Users: ${userCount} | Orders: ${orderCount}`);
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
