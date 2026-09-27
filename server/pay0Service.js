import db from './db.js';

/**
 * Resolves active Pay0 Gateway configuration dynamically:
 * Reads from SQLite env_configs table first, then falls back to process.env.
 * Defaults to 'pay0_std' (pay0.shop) if ACTIVE_PAYMENT_GATEWAY is not set.
 */
export function getPay0Config() {
  let activeGateway = 'pay0_std';

  let stdToken = '';
  let stdSecret = '';
  let stdWebhook = '';
  let stdRedirect = '';

  let proToken = '';
  let proSecret = '';
  let proWebhook = '';
  let proRedirect = '';

  // 1. Initial fallbacks from process.env
  const cleanEnv = (v) => (v && !v.includes('*')) ? v.trim() : '';

  const envActiveGateway = cleanEnv(process.env.ACTIVE_PAYMENT_GATEWAY);
  if (envActiveGateway) activeGateway = envActiveGateway.toLowerCase();

  const envStdToken = cleanEnv(process.env.PAY0_STD_USER_TOKEN);
  const envStdSecret = cleanEnv(process.env.PAY0_STD_SECRET_KEY);
  const envProToken = cleanEnv(process.env.PAY0_PRO_USER_TOKEN || process.env.PAY0PRO_API_KEY || process.env.PAY0_USER_TOKEN);
  const envProSecret = cleanEnv(process.env.PAY0_PRO_SECRET_KEY || process.env.PAY0PRO_MERCHANT_ID || process.env.PAY0_SECRET_KEY);

  // 2. Database env_configs take highest precedence (Admin Panel live settings)
  try {
    const rows = db.prepare(`
      SELECT key, value FROM env_configs 
      WHERE key IN (
        'ACTIVE_PAYMENT_GATEWAY',
        'PAY0_STD_USER_TOKEN', 'PAY0_STD_SECRET_KEY', 'PAY0_STD_WEBHOOK_URL', 'PAY0_STD_REDIRECT_URL',
        'PAY0_PRO_USER_TOKEN', 'PAY0_PRO_SECRET_KEY', 'PAY0_PRO_WEBHOOK_URL', 'PAY0_PRO_REDIRECT_URL',
        'PAY0_USER_TOKEN', 'PAY0_SECRET_KEY', 'PAYOPRO_MCH_ID', 'PAYOPRO_SECRET_KEY'
      )
    `).all();

    rows.forEach(r => {
      const val = (r.value || '').trim();
      if (!val || val.includes('*')) return;

      if (r.key === 'ACTIVE_PAYMENT_GATEWAY') activeGateway = val.toLowerCase();

      if (r.key === 'PAY0_STD_USER_TOKEN') stdToken = val;
      if (r.key === 'PAY0_STD_SECRET_KEY') stdSecret = val;
      if (r.key === 'PAY0_STD_WEBHOOK_URL') stdWebhook = val;
      if (r.key === 'PAY0_STD_REDIRECT_URL') stdRedirect = val;

      if (r.key === 'PAY0_PRO_USER_TOKEN') proToken = val;
      if (r.key === 'PAY0_PRO_SECRET_KEY') proSecret = val;
      if (r.key === 'PAY0_PRO_WEBHOOK_URL') proWebhook = val;
      if (r.key === 'PAY0_PRO_REDIRECT_URL') proRedirect = val;

      // Legacy key compatibility
      if (r.key === 'PAY0_USER_TOKEN' || r.key === 'PAYOPRO_MCH_ID') {
        if (!stdToken) stdToken = val;
        if (!proToken) proToken = val;
      }
      if (r.key === 'PAY0_SECRET_KEY' || r.key === 'PAYOPRO_SECRET_KEY') {
        if (!stdSecret) stdSecret = val;
        if (!proSecret) proSecret = val;
      }
    });
  } catch (err) {
    console.warn('[Pay0 Config]: Could not read env_configs from SQLite database:', err.message);
  }

  // Default fallback credentials for pay0.shop Standard
  const STD_FALLBACK_TOKEN = 'e7d3b644cef8f32dec1b8ce4cd5802e3';
  const STD_FALLBACK_SECRET = 'IAvFPh0w1N816336807';

  const finalStdToken = stdToken || envStdToken || STD_FALLBACK_TOKEN;
  const finalStdSecret = stdSecret || envStdSecret || STD_FALLBACK_SECRET;
  const finalProToken = proToken || envProToken;
  const finalProSecret = proSecret || envProSecret;

  let isPro = (activeGateway === 'pay0_pro');

  // Smart fallback: If selected gateway has no credentials, fallback to other gateway
  if (isPro && !finalProToken && finalStdToken) {
    console.warn('[Pay0 Config]: Pay0 Pro selected but has no token. Falling back to Pay0 Standard.');
    isPro = false;
  } else if (!isPro && !finalStdToken && finalProToken) {
    console.warn('[Pay0 Config]: Pay0 Standard selected but has no token. Falling back to Pay0 Pro.');
    isPro = true;
  }

  const userToken = isPro ? finalProToken : finalStdToken;
  const secretKey = isPro ? finalProSecret : finalStdSecret;
  const webhookUrl = isPro ? (proWebhook || stdWebhook) : (stdWebhook || proWebhook);
  const redirectUrl = isPro ? (proRedirect || stdRedirect) : (stdRedirect || proRedirect);

  const createOrderUrl = isPro
    ? 'https://api.pay0.shop/apiv1/create-order'
    : 'https://pay0.shop/api/create-order';

  const checkStatusUrl = isPro
    ? 'https://api.pay0.shop/apiv1/check-order-status'
    : 'https://pay0.shop/api/check-order-status';

  return {
    activeGateway: isPro ? 'pay0_pro' : 'pay0_std',
    gatewayName: isPro ? 'Pay0 Pro (pro.pay0.shop)' : 'Pay0 Standard (pay0.shop)',
    createOrderUrl,
    checkStatusUrl,
    userToken,
    secretKey,
    webhookUrl,
    redirectUrl
  };
}

/**
 * Creates an outbound checkout order with the active Pay0 gateway.
 */
export async function createPay0Order({
  orderId,
  amount,
  customerName = 'Valued Client',
  customerPhone = '9999999999',
  customerEmail = 'customer@example.com',
  reqHost = '',
  reqProtocol = 'http'
}) {
  const cfg = getPay0Config();

  if (!cfg.userToken) {
    throw new Error('Pay0 gateway is not configured. Missing user token.');
  }

  // Clean customer phone (10-digit standard Indian mobile)
  let cleanMobile = String(customerPhone).replace(/\D/g, '');
  if (cleanMobile.length > 10) cleanMobile = cleanMobile.slice(-10);
  if (cleanMobile.length < 10) cleanMobile = '9999999999';

  // Dynamic host fallback if webhook/redirect URL not explicitly configured
  const hostBase = reqHost ? `${reqProtocol}://${reqHost}` : '';
  const finalWebhookUrl = cfg.webhookUrl || (hostBase ? `${hostBase}/api/payment/webhook` : '');
  const finalRedirectUrl = cfg.redirectUrl || (hostBase ? `${hostBase}/cart?payment=success&order_id=${encodeURIComponent(orderId)}` : '');

  const formData = new URLSearchParams();
  formData.append('customer_mobile', cleanMobile);
  formData.append('customer_name', customerName.slice(0, 50));
  formData.append('customer_email', customerEmail.slice(0, 70));
  formData.append('user_token', cfg.userToken);
  formData.append('amount', String(amount));
  formData.append('order_id', orderId);
  formData.append('redirect_url', finalRedirectUrl);
  if (finalWebhookUrl) {
    formData.append('webhook_url', finalWebhookUrl);
  }

  console.log(`[Pay0 Outbound] Calling ${cfg.gatewayName} for Order #${orderId} (₹${amount}) -> ${cfg.createOrderUrl}`);

  const response = await fetch(cfg.createOrderUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9'
    },
    body: formData.toString()
  });

  const rawText = await response.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (err) {
    console.error(`[Pay0 Raw Error Response]: ${rawText}`);
    throw new Error(`Pay0 gateway returned non-JSON response (HTTP ${response.status})`);
  }

  if (data && (data.status === true || data.status === 'success' || data.success === true)) {
    const paymentUrl = data.result?.payment_url || data.payment_url || data.result?.url;
    if (paymentUrl) {
      console.log(`[Pay0 Success] Payment URL generated for Order #${orderId}`);
      return {
        success: true,
        orderId,
        paymentUrl,
        amount,
        gateway: cfg.activeGateway,
        gatewayName: cfg.gatewayName
      };
    }
  }

  console.error('[Pay0 Order Creation Failed]:', data);
  throw new Error(data.message || data.error || 'Failed to create payment order on Pay0 gateway');
}

/**
 * Verifies live order status with Pay0 server (Anti-Fraud check).
 */
export async function verifyPay0OrderStatus(orderId) {
  const cfg = getPay0Config();
  if (!cfg.userToken) return { verified: false, error: 'User token missing' };

  try {
    const formData = new URLSearchParams();
    formData.append('user_token', cfg.userToken);
    formData.append('order_id', orderId);

    const res = await fetch(cfg.checkStatusUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      body: formData.toString()
    });

    const data = await res.json();
    console.log(`[Pay0 Status Verification] Order #${orderId}:`, data);

    const resultStatus = (data.result?.status || data.status || '').toUpperCase();
    const isPaid = (resultStatus === 'SUCCESS' || resultStatus === 'COMPLETED' || resultStatus === 'PAID');

    return {
      verified: true,
      isPaid,
      status: resultStatus,
      utr: data.result?.utr || data.result?.utr_number || data.utr || null,
      amount: data.result?.amount || data.amount,
      raw: data
    };
  } catch (err) {
    console.error(`[Pay0 Status Check Failed] Order #${orderId}:`, err.message);
    return { verified: false, error: err.message };
  }
}
