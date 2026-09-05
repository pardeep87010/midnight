import crypto from 'crypto';

const webhookSecret = 'pay0pro_webhook_secret_2026';
const fakePayload = { order_id: 'MB-999999', status: 'SUCCESS' };
const validSig = crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(fakePayload)).digest('hex');

console.log('Sending Webhook with signature:', validSig);

const res = await fetch('http://localhost:5000/api/pay0pro/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-pay0pro-signature': validSig
  },
  body: JSON.stringify(fakePayload)
});

console.log('Status code:', res.status);
const data = await res.json();
console.log('Response body:', data);
