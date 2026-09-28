import Database from 'better-sqlite3';

const db = new Database('database/midnight_bloom.db');

async function testPaymentSecurity() {
  console.log('=== RUNNING PAYMENT ANTI-TAMPER & SINGLETON LINK SECURITY TESTS ===\n');

  // Test 1: Price Tampering Defense Test
  console.log('--- Test 1: Price Tampering Defense ---');
  // Client tries to buy LELO Mona Wave (Real DB Price: 12499) for ₹1
  const fakeClientOrder = {
    orderId: `SEC-TEST-${Date.now()}`,
    customerName: 'Security Tester',
    customerEmail: 'tester@test.com',
    customerPhone: '9876543210',
    amount: 1, // Tampered client price!
    totalAmount: 1,
    items: [
      {
        id: 'lelo-mona-wave-dual-motor-g-spot-wand',
        name: 'LELO Mona Wave Dual-Motor G-Spot Wand',
        price: 1, // Tampered unit price!
        quantity: 1
      }
    ]
  };

  try {
    const res = await fetch('http://localhost:5000/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fakeClientOrder)
    });

    const data = await res.json();
    console.log('Client submitted fake price: ₹1');
    console.log('Server response:', data);

    // If Pay0 threw plan expired, verify DB record has authoritative price 12499
    const dbOrder = db.prepare('SELECT total_amount FROM orders WHERE id = ?').get(fakeClientOrder.orderId);
    if (dbOrder && Number(dbOrder.total_amount) === 12499) {
      console.log('✅ PASS: Server stored authoritative DB price (₹12,499) in database! Client price tampering of ₹1 was 100% BLOCKED!');
    } else {
      console.error('❌ FAIL: Database has price:', dbOrder?.total_amount);
    }
  } catch (err) {
    console.error('Test 1 error:', err.message);
  }

  // Test 2: Double Payment Rejection Test
  console.log('\n--- Test 2: Already Paid Order Protection ---');
  const paidOrderId = `PAID-TEST-${Date.now()}`;
  db.prepare(`
    INSERT INTO orders (
      id, customer_name, customer_email, total_amount, payment_mode, status
    ) VALUES (?, 'Test Buyer', 'buyer@test.com', 4999, 'Online Payment', 'Processing')
  `).run(paidOrderId);

  try {
    const res = await fetch('http://localhost:5000/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: paidOrderId,
        items: [{ id: 'aoonice-ai-sync-clitoral-air-pulse-pussy-pump-vibrator', quantity: 1 }]
      })
    });

    const data = await res.json();
    console.log('Response for already paid order:', data);
    if (data.alreadyPaid === true) {
      console.log('✅ PASS: Double payment strictly PREVENTED on already paid order!');
    } else {
      console.error('❌ FAIL: Allowed payment on already paid order!');
    }
  } catch (err) {
    console.error('Test 2 error:', err.message);
  }

  // Test 3: Singleton Payment Link Reuse Test
  console.log('\n--- Test 3: Singleton Payment Link Reuse Test ---');
  const pendingOrderId = `PENDING-TEST-${Date.now()}`;
  const existingPaymentUrl = 'https://pay0.shop/checkout/test_unique_link_12345';
  db.prepare(`
    INSERT INTO orders (
      id, customer_name, customer_email, total_amount, payment_mode, status, payment_url
    ) VALUES (?, 'Test Buyer', 'buyer@test.com', 4999, 'Online Payment', 'Payment Pending', ?)
  `).run(pendingOrderId, existingPaymentUrl);

  try {
    const res = await fetch('http://localhost:5000/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: pendingOrderId,
        items: [{ id: 'aoonice-ai-sync-clitoral-air-pulse-pussy-pump-vibrator', quantity: 1 }]
      })
    });

    const data = await res.json();
    console.log('Response for pending order with existing link:', data);
    if (data.reusedExistingLink === true && data.paymentUrl === existingPaymentUrl) {
      console.log('✅ PASS: Reused exact existing payment link without creating duplicate links!');
    } else {
      console.error('❌ FAIL: Did not reuse link:', data);
    }
  } catch (err) {
    console.error('Test 3 error:', err.message);
  }

  // Clean test records from DB
  db.prepare("DELETE FROM orders WHERE id LIKE 'SEC-TEST-%' OR id LIKE 'PAID-TEST-%' OR id LIKE 'PENDING-TEST-%'").run();
  console.log('\n🧹 Cleaned test orders from database.');
}

testPaymentSecurity();
