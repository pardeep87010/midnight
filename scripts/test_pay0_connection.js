import { createPay0Order, verifyPay0OrderStatus, getPay0Config } from '../server/pay0Service.js';

async function testPay0() {
  console.log('=== TESTING PAY0.SHOP GATEWAY CONNECTION ===');
  const cfg = getPay0Config();
  console.log('Configured Gateway:', cfg.gatewayName);
  console.log('Target Endpoint:', cfg.createOrderUrl);
  console.log('User Token:', cfg.userToken);

  const testOrderId = `TEST-${Date.now()}`;
  const testAmount = 10; // ₹10 test order

  try {
    const res = await createPay0Order({
      orderId: testOrderId,
      amount: testAmount,
      customerName: 'Test Buyer',
      customerPhone: '9876543210',
      customerEmail: 'test@example.com',
      reqHost: 'localhost:5000',
      reqProtocol: 'http'
    });

    console.log('\n✅ Pay0 Order Created Successfully!');
    console.log('Response Details:', res);

    console.log('\n--- Checking Order Status via API ---');
    const statusRes = await verifyPay0OrderStatus(testOrderId);
    console.log('Status Check Result:', statusRes);

  } catch (err) {
    console.error('\n❌ Pay0 Test Failed:', err.message);
  }
}

testPay0();
