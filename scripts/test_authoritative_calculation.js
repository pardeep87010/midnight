import Database from 'better-sqlite3';

const db = new Database('database/midnight_bloom.db');

function findDbProduct(item) {
  const pId = String(item.id || item.slug || '').trim();
  const pName = String(item.name || '').trim();
  const normId = pId.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normName = pName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Direct match
  let prod = db.prepare('SELECT * FROM products WHERE id = ? OR slug = ? OR name = ? LIMIT 1').get(pId, pId, pName);
  if (prod) return prod;

  // 2. Like match
  if (pId.length >= 4) {
    prod = db.prepare('SELECT * FROM products WHERE id LIKE ? OR slug LIKE ? LIMIT 1').get(`%${pId}%`, `%${pId}%`);
    if (prod) return prod;
  }

  // 3. Normalized full scan
  const all = db.prepare('SELECT * FROM products').all();
  for (const p of all) {
    const pNormId = p.id.replace(/[^a-z0-9]/g, '');
    const pNormName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (pNormId === normId || pNormId.includes(normId) || normId.includes(pNormId) ||
        (normName && (pNormName === normName || pNormName.includes(normName) || normName.includes(pNormName)))) {
      return p;
    }
  }

  return null;
}

function calculateAuthoritativeOrderTotal(items, promoCode) {
  const rawItems = Array.isArray(items) && items.length > 0 ? items : [];
  if (rawItems.length === 0) {
    throw new Error('Order must contain at least 1 valid item in cart');
  }

  let serverSubtotal = 0;
  const verifiedItems = [];

  for (const item of rawItems) {
    const qty = Math.max(1, Math.min(99, parseInt(item.quantity, 10) || 1));
    const dbProduct = findDbProduct(item);

    if (!dbProduct || !dbProduct.price) {
      throw new Error(`Invalid item in cart: "${item.name || item.id || item.slug}" is not available`);
    }

    const realPrice = Number(dbProduct.price);
    const lineTotal = realPrice * qty;
    serverSubtotal += lineTotal;

    verifiedItems.push({
      id: dbProduct.id,
      name: dbProduct.name,
      quantity: qty,
      price: realPrice,
      lineTotal,
      color: item.color || 'Standard',
      image: item.image || ''
    });
  }

  // Shipping calculation (Free over 1999)
  const shipping = serverSubtotal >= 1999 ? 0 : 199;

  // Promo code validation
  let serverDiscount = 0;
  let appliedPromo = null;

  if (promoCode && typeof promoCode === 'string') {
    const cleanCode = promoCode.trim().toUpperCase();
    const dbCoupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = ? AND is_active = 1 LIMIT 1').get(cleanCode);

    if (dbCoupon) {
      const minAmount = Number(dbCoupon.min_order_amount) || 0;
      if (serverSubtotal >= minAmount) {
        if (dbCoupon.discount_percent) {
          serverDiscount = Math.round((serverSubtotal * dbCoupon.discount_percent) / 100);
        } else if (dbCoupon.discount_amount) {
          serverDiscount = Math.min(serverSubtotal, Math.round(dbCoupon.discount_amount));
        }
        appliedPromo = cleanCode;
      }
    }
  }

  const finalAuthoritativeTotal = Math.max(1, Math.round(serverSubtotal + shipping - serverDiscount));

  return {
    subtotal: serverSubtotal,
    shipping,
    discount: serverDiscount,
    appliedPromo,
    authoritativeTotal: finalAuthoritativeTotal,
    verifiedItems
  };
}

// Test Case 1: Tampered item price (User sends ₹1 for LELO Mona Wave ₹12,499)
const testTampered = [{ id: 'lelo-mona-wave', name: 'LELO Mona Wave Dual-Motor G-Spot Wand', price: 1, quantity: 1 }];
const res1 = calculateAuthoritativeOrderTotal(testTampered, null);
console.log('Test 1 (Tampered unit price ₹1):');
console.log('Result Authoritative Total:', res1.authoritativeTotal, '(Expected: 12499)');
if (res1.authoritativeTotal === 12499) console.log('✅ PASS: Real DB Price (₹12,499) enforced! Price tampering impossible!');

// Test Case 2: Free Shipping over 1999 vs Under 1999
const testSmall = [{ id: 'aoonice-ai-sync-clitoral-air-pulse-pussy-pump-vibrator', quantity: 1 }]; // ₹4,999
const res2 = calculateAuthoritativeOrderTotal(testSmall, null);
console.log('\nTest 2 (Order ₹4,999 >= 1999):');
console.log('Shipping:', res2.shipping, '(Expected: 0)');
console.log('Total:', res2.authoritativeTotal, '(Expected: 4999)');
if (res2.authoritativeTotal === 4999 && res2.shipping === 0) console.log('✅ PASS: Free delivery verified!');

// Test Case 3: Promo code VIP10 (10% off on 4999 = 500 off)
const res3 = calculateAuthoritativeOrderTotal(testSmall, 'VIP10');
console.log('\nTest 3 (VIP10 Promo Code):');
console.log('Discount:', res3.discount, '(Expected: 500)');
console.log('Final Total:', res3.authoritativeTotal, '(Expected: 4499)');
if (res3.authoritativeTotal === 4499 && res3.discount === 500) console.log('✅ PASS: VIP10 coupon verified!');
