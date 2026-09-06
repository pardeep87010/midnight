/**
 * ==============================================================================
 * Midnight Bloom - Master Luxury Transactional Email Templates Engine
 * ==============================================================================
 * 
 * Features:
 *   - 100% Bulletproof HTML Table layout (Compatible with Gmail, Apple Mail, Outlook, iOS, Android)
 *   - Obsidian Black (#121316) & Rose Gold (#D98A92) Luxury Aesthetic
 *   - 100% Confidential & Discreet Privacy Standards (Unbranded descriptors)
 *   - Dynamic data interpolation with fallback safety
 */

// Base Container & Header/Footer Layout Wrapper
function wrapEmailLayout(title, preheader, contentHtml) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>${title}</title>
  <style>
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #0A0A0C;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      max-width: 100%;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        padding: 12px !important;
      }
      .responsive-table {
        width: 100% !important;
      }
      .stack-cell {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0C; color: #FAF7F5;">
  <!-- Hidden Preheader Text for Email Clients -->
  <div style="display: none; font-size: 1px; color: #0A0A0C; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader || 'Confidential notification from MB Logistics'}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0A0A0C; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; background-color: #121316; border: 1px solid #2A2426; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
          
          <!-- Top Header / Brand Logo -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.07); background: linear-gradient(180deg, #18191E 0%, #121316 100%);">
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: bold; letter-spacing: 1px; color: #FAF7F5;">
                <span style="color: #D98A92;">Midnight</span> Bloom
              </h1>
              <p style="margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8F8789; font-family: monospace;">
                Discreet Luxury & Sensual Wellness
              </p>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Discreet Trust Badges Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0E0F12; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              
              <!-- Plain Box & Discreet Descriptor Assurance -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td align="center" style="font-size: 11px; color: #A39B9D; font-family: monospace; line-height: 1.6;">
                    🔒 <strong>100% Plain Box Guarantee:</strong> Zero adult labels or logos on exterior packaging.<br>
                    💳 <strong>Billing Descriptor:</strong> MB* SERVICES LLC (Discreet bank statement).
                  </td>
                </tr>
              </table>

              <!-- Copyright & Links -->
              <p style="margin: 0; font-size: 11px; color: #666163; line-height: 1.5;">
                © ${new Date().getFullYear()} Midnight Bloom • Strictly 18+ Adult Sensual Wellness.<br>
                For discreet assistance, reply directly to this email or visit our encrypted portal.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. OTP Verification Email Template
 */
function getOtpEmailTemplate(otp, purpose = 'registration') {
  const isReset = purpose === 'reset';
  const title = isReset ? 'Reset Your Password Code' : 'Verify Your Email Address';
  const heading = isReset ? 'Password Reset Code' : 'Email Verification Code';
  const preheader = `Your 6-digit confidential code is ${otp}. Valid for 5 minutes.`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="margin: 0 0 8px; font-family: Georgia, serif; font-size: 22px; color: #FAF7F5;">${heading}</h2>
      <p style="margin: 0; font-size: 14px; color: #B3AAA8; line-height: 1.6;">
        ${isReset 
          ? 'We received a request to reset your Midnight Bloom account password.' 
          : 'Thank you for joining Midnight Bloom. Please use the verification code below to activate your confidential account:'}
      </p>
    </div>

    <!-- OTP Code Display Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <div style="display: inline-block; background: #1C1D22; border: 2px solid #D98A92; border-radius: 12px; padding: 18px 36px; letter-spacing: 12px; font-size: 32px; font-weight: bold; font-family: 'Courier New', Courier, monospace; color: #FAF7F5; text-indent: 12px; box-shadow: 0 4px 20px rgba(217, 138, 146, 0.15);">
            ${otp}
          </div>
        </td>
      </tr>
    </table>

    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 14px 18px; margin: 24px 0 12px;">
      <p style="margin: 0; font-size: 12px; color: #A39B9D; line-height: 1.5;">
        ⏳ <strong>Security Notice:</strong> This code is valid for <strong>5 minutes</strong>. Never disclose this code to anyone. If you did not initiate this request, you can safely disregard this email.
      </p>
    </div>
  `;

  return wrapEmailLayout(title, preheader, contentHtml);
}

/**
 * 2. Order Confirmation & Plain Invoice Email Template
 */
function getOrderConfirmationTemplate(order) {
  const orderId = order.id || 'MB-000000';
  const customerName = order.customerName || order.name || 'Valued Client';
  const totalAmount = Number(order.totalAmount || 0).toLocaleString('en-IN');
  const paymentMode = order.paymentMode || 'Cash on Delivery (COD)';
  const address = order.shippingAddress || order.address || 'Discreet Domestic Delivery, India';
  const items = Array.isArray(order.items) ? order.items : [];
  const preheader = `Order #${orderId} confirmed (₹${totalAmount}) - Packed in 100% Plain Unmarked Box`;

  const itemsRowsHtml = items.map(item => {
    const itemName = item.name || 'Luxury Sensual Instrument';
    const qty = item.quantity || 1;
    const price = Number(item.price || 0).toLocaleString('en-IN');
    const color = item.color && item.color !== 'Standard' ? `<span style="color: #D98A92; font-size: 11px;"> • ${item.color}</span>` : '';
    return `
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.07);">
        <td style="padding: 12px 0; color: #FAF7F5; font-size: 13px;">
          <strong>${itemName}</strong>${color}
          <div style="font-size: 11px; color: #8F8789; font-family: monospace;">Qty: ${qty}</div>
        </td>
        <td align="right" style="padding: 12px 0; color: #FAF7F5; font-size: 13px; font-weight: bold; font-family: monospace;">
          ₹${price}
        </td>
      </tr>
    `;
  }).join('');

  const contentHtml = `
    <!-- Header Greeting -->
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; background: rgba(217, 138, 146, 0.15); color: #D98A92; border: 1px solid rgba(217, 138, 146, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: monospace; font-weight: bold; text-transform: uppercase;">
        Order Confirmed
      </span>
      <h2 style="margin: 12px 0 6px; font-family: Georgia, serif; font-size: 22px; color: #FAF7F5;">Thank You, ${customerName}</h2>
      <p style="margin: 0; font-size: 13px; color: #B3AAA8; line-height: 1.5;">
        Your order <strong>#${orderId}</strong> has been received and is entering our confidential sterilized packing workflow.
      </p>
    </div>

    <!-- Items Summary Table -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <thead>
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
          <th align="left" style="padding: 10px 0; font-size: 11px; text-transform: uppercase; color: #8F8789; font-family: monospace;">Instrument</th>
          <th align="right" style="padding: 10px 0; font-size: 11px; text-transform: uppercase; color: #8F8789; font-family: monospace;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRowsHtml || `
          <tr>
            <td style="padding: 12px 0; color: #FAF7F5; font-size: 13px;">Curated Intimate Instrument (x1)</td>
            <td align="right" style="padding: 12px 0; color: #FAF7F5; font-size: 13px; font-family: monospace;">₹${totalAmount}</td>
          </tr>
        `}
      </tbody>
      <tfoot>
        <tr>
          <td style="padding: 14px 0 4px; color: #B3AAA8; font-size: 12px;">Payment Mode</td>
          <td align="right" style="padding: 14px 0 4px; color: #FAF7F5; font-size: 12px; font-family: monospace;">${paymentMode}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0 4px; color: #B3AAA8; font-size: 12px;">Discreet Packaging</td>
          <td align="right" style="padding: 4px 0 4px; color: #4ADE80; font-size: 12px; font-family: monospace;">FREE (Plain Box)</td>
        </tr>
        <tr style="border-top: 1px solid rgba(255, 255, 255, 0.15);">
          <td style="padding: 14px 0 0; color: #FAF7F5; font-size: 15px; font-weight: bold;">Grand Total</td>
          <td align="right" style="padding: 14px 0 0; color: #D98A92; font-size: 18px; font-weight: bold; font-family: monospace;">₹${totalAmount}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Discreet Delivery Address Box -->
    <div style="background: #18191E; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 16px; margin: 24px 0 12px;">
      <div style="font-size: 11px; text-transform: uppercase; color: #D98A92; font-family: monospace; font-weight: bold; margin-bottom: 6px;">
        📍 Discreet Delivery Address
      </div>
      <p style="margin: 0; font-size: 13px; color: #E6DFDD; line-height: 1.5;">
        ${address}
      </p>
    </div>
  `;

  return wrapEmailLayout(`Order Confirmation #${orderId} - MB Logistics`, preheader, contentHtml);
}

/**
 * 3. Shipping & Live Tracking Update Email Template
 */
function getShippingUpdateTemplate(order, trackingNumber = 'MB-TRK-984102', courierName = 'BlueDart / BlrExpress', trackingUrl = 'https://midnightbloom.in/profile') {
  const orderId = order.id || 'MB-000000';
  const customerName = order.customerName || 'Valued Client';
  const status = order.status || 'Dispatched';
  const preheader = `Your order #${orderId} has been dispatched. Track with AWB #${trackingNumber}`;

  const contentHtml = `
    <!-- Header -->
    <div style="margin-bottom: 24px; text-align: center;">
      <span style="display: inline-block; background: rgba(74, 222, 128, 0.15); color: #4ADE80; border: 1px solid rgba(74, 222, 128, 0.3); padding: 4px 14px; border-radius: 20px; font-size: 11px; font-family: monospace; font-weight: bold; text-transform: uppercase;">
        🚚 Order ${status}
      </span>
      <h2 style="margin: 14px 0 6px; font-family: Georgia, serif; font-size: 22px; color: #FAF7F5;">Your Package Is On Its Way</h2>
      <p style="margin: 0; font-size: 13px; color: #B3AAA8; line-height: 1.5;">
        Hello ${customerName}, your confidential parcel for order <strong>#${orderId}</strong> has been handed over to our verified express courier partner.
      </p>
    </div>

    <!-- Courier & AWB Details Box -->
    <div style="background: #18191E; border: 1px solid #D98A92; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
      <div style="font-size: 11px; text-transform: uppercase; color: #8F8789; font-family: monospace; margin-bottom: 4px;">Courier Partner</div>
      <div style="font-size: 15px; font-weight: bold; color: #FAF7F5; margin-bottom: 12px;">${courierName} (Express Discreet)</div>

      <div style="font-size: 11px; text-transform: uppercase; color: #8F8789; font-family: monospace; margin-bottom: 4px;">Tracking AWB Number</div>
      <div style="font-size: 18px; font-weight: bold; font-family: monospace; color: #D98A92; letter-spacing: 1px; margin-bottom: 20px;">
        ${trackingNumber}
      </div>

      <!-- Live Track Button -->
      <a href="${trackingUrl}" style="display: inline-block; background: #D98A92; color: #121316; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 14px rgba(217, 138, 146, 0.3);">
        Track Live Shipment
      </a>
    </div>

    <!-- Plain Box Assurance Reminder -->
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 14px 18px;">
      <p style="margin: 0; font-size: 12px; color: #A39B9D; line-height: 1.5;">
        📦 <strong>Discreet Delivery Promise:</strong> The courier delivery agent will only see "MB Logistics • General Merchandise". No adult description will ever appear on the shipping label.
      </p>
    </div>
  `;

  return wrapEmailLayout(`Discreet Shipment Update #${orderId} - MB Logistics`, preheader, contentHtml);
}

/**
 * 4. New Product Launch & VIP Drops Email Template
 */
function getNewProductLaunchTemplate(product = {}, customMessage = '', discountCode = 'VIPDROP15') {
  const name = product.name || 'The Velvet Wand Ultra';
  const subtitle = product.subtitle || 'Whisper-Quiet Dual Motor Luxury Massager';
  const price = Number(product.price || 4999).toLocaleString('en-IN');
  const originalPrice = product.originalPrice ? Number(product.originalPrice).toLocaleString('en-IN') : null;
  const image = product.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80';
  const productUrl = product.url || 'https://midnightbloom.in/catalog';
  const preheader = `New Release: ${name} is now available in confidential limited quantities.`;

  const contentHtml = `
    <!-- Badge & Header -->
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="display: inline-block; background: rgba(217, 138, 146, 0.15); color: #D98A92; border: 1px solid rgba(217, 138, 146, 0.3); padding: 4px 14px; border-radius: 20px; font-size: 10px; font-family: monospace; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
        ✨ Exclusive New Release
      </span>
      <h2 style="margin: 14px 0 6px; font-family: Georgia, serif; font-size: 24px; color: #FAF7F5;">${name}</h2>
      <p style="margin: 0; font-size: 13px; color: #B3AAA8;">${subtitle}</p>
    </div>

    <!-- Product Showcase Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #18191E; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; margin: 20px 0;">
      ${image ? `
        <tr>
          <td align="center" style="padding: 0; background: #0A0A0C;">
            <img src="${image}" alt="${name}" style="width: 100%; max-height: 280px; object-fit: cover; display: block;" />
          </td>
        </tr>
      ` : ''}
      <tr>
        <td style="padding: 24px; text-align: center;">
          <p style="margin: 0 0 16px; font-size: 13px; color: #E6DFDD; line-height: 1.6;">
            ${customMessage || 'Engineered with 100% medical-grade velvet liquid silicone, WhisperQuiet™ acoustic dampening (<35dB), and IPX8 submersible waterproofing.'}
          </p>
          
          <!-- Price Tag -->
          <div style="margin-bottom: 20px;">
            <span style="font-size: 24px; font-weight: bold; color: #D98A92; font-family: monospace;">₹${price}</span>
            ${originalPrice ? `<span style="font-size: 14px; color: #736B6D; text-decoration: line-through; margin-left: 8px; font-family: monospace;">₹${originalPrice}</span>` : ''}
          </div>

          <!-- VIP Coupon Box -->
          ${discountCode ? `
            <div style="display: inline-block; background: #121316; border: 1px dashed #D98A92; border-radius: 8px; padding: 8px 18px; margin-bottom: 20px;">
              <span style="font-size: 11px; color: #B3AAA8;">Use VIP Code: </span>
              <strong style="color: #FAF7F5; font-family: monospace; font-size: 13px; letter-spacing: 1px;">${discountCode}</strong>
            </div>
          ` : ''}

          <div>
            <a href="${productUrl}" style="display: inline-block; background: #D98A92; color: #121316; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; padding: 14px 36px; border-radius: 8px; box-shadow: 0 6px 20px rgba(217, 138, 146, 0.35);">
              Explore Instrument
            </a>
          </div>
        </td>
      </tr>
    </table>
  `;

  return wrapEmailLayout(`VIP Drop: ${name} - Midnight Bloom`, preheader, contentHtml);
}

/**
 * 5. Abandoned Cart Recovery Email Template
 */
function getAbandonedCartTemplate(customerName = 'Valued Member', items = [], discountCode = 'RECOVER10') {
  const preheader = `You left confidential items in your bag. Complete your order with 10% OFF.`;

  const itemsHtml = (items.length > 0 ? items : [{ name: 'The Royale Dual Rabbit Vibrator', price: 4999 }]).map(item => `
    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.07);">
      <td style="padding: 10px 0; color: #FAF7F5; font-size: 13px;">
        <strong>${item.name || 'Luxury Sensual Instrument'}</strong>
      </td>
      <td align="right" style="padding: 10px 0; color: #D98A92; font-size: 13px; font-weight: bold; font-family: monospace;">
        ₹${Number(item.price || 2999).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const contentHtml = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="display: inline-block; background: rgba(217, 138, 146, 0.15); color: #D98A92; border: 1px solid rgba(217, 138, 146, 0.3); padding: 4px 14px; border-radius: 20px; font-size: 10px; font-family: monospace; font-weight: bold; text-transform: uppercase;">
        Confidential Cart Reminder
      </span>
      <h2 style="margin: 14px 0 6px; font-family: Georgia, serif; font-size: 22px; color: #FAF7F5;">Still Contemplating Your Sanctuary?</h2>
      <p style="margin: 0; font-size: 13px; color: #B3AAA8; line-height: 1.5;">
        Hello ${customerName}, your selected instruments are safely reserved in your encrypted cart.
      </p>
    </div>

    <!-- Items List Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #18191E; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Exclusive Coupon Offer -->
    <div style="background: linear-gradient(135deg, #22171A 0%, #1A181F 100%); border: 1px solid #D98A92; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #FAF7F5;">
        Enjoy an exclusive <strong>10% Discount</strong> on your order today:
      </p>
      <div style="display: inline-block; background: #0A0A0C; border: 1px dashed #D98A92; border-radius: 6px; padding: 8px 24px; font-size: 16px; font-family: monospace; font-weight: bold; color: #D98A92; letter-spacing: 2px; margin-bottom: 16px;">
        ${discountCode}
      </div>
      <div>
        <a href="https://midnightbloom.in/cart" style="display: inline-block; background: #D98A92; color: #121316; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 12px 30px; border-radius: 8px;">
          Complete Discreet Purchase
        </a>
      </div>
    </div>
  `;

  return wrapEmailLayout('Your Reserved Instruments - Midnight Bloom', preheader, contentHtml);
}

/**
 * 6. Admin Instant New Order Alert Email Template
 */
function getAdminOrderAlertTemplate(order) {
  const orderId = order.id || 'MB-000000';
  const customerName = order.customerName || 'Aarav Sharma';
  const customerEmail = order.customerEmail || 'customer@example.com';
  const customerPhone = order.customerPhone || 'N/A';
  const totalAmount = Number(order.totalAmount || 0).toLocaleString('en-IN');
  const paymentMode = order.paymentMode || 'COD';
  const city = order.customerCity || order.city || 'India';
  const address = order.shippingAddress || order.address || 'Address provided';
  const items = Array.isArray(order.items) ? order.items : [];
  const preheader = `🚨 NEW ORDER #${orderId}: ₹${totalAmount} via ${paymentMode} from ${city}`;

  const itemsListText = items.map(i => `• ${i.name} (Qty: ${i.quantity || 1}) - ₹${i.price}`).join('<br>');

  const contentHtml = `
    <!-- Header -->
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; background: rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: monospace; font-weight: bold; text-transform: uppercase;">
        🚨 Instant Admin Order Alert
      </span>
      <h2 style="margin: 12px 0 4px; font-family: Georgia, serif; font-size: 22px; color: #FAF7F5;">New Order #${orderId}</h2>
      <p style="margin: 0; font-size: 13px; color: #B3AAA8;">Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    </div>

    <!-- Order Summary Grid -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #18191E; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 16px; margin: 16px 0;">
      <tr>
        <td style="padding: 6px 0; font-size: 12px; color: #8F8789; font-family: monospace;">Amount / Payment:</td>
        <td align="right" style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #D98A92; font-family: monospace;">₹${totalAmount} (${paymentMode})</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 12px; color: #8F8789; font-family: monospace;">Customer Name:</td>
        <td align="right" style="padding: 6px 0; font-size: 13px; color: #FAF7F5;">${customerName}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 12px; color: #8F8789; font-family: monospace;">Email:</td>
        <td align="right" style="padding: 6px 0; font-size: 13px; color: #FAF7F5; font-family: monospace;">${customerEmail}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 12px; color: #8F8789; font-family: monospace;">Phone:</td>
        <td align="right" style="padding: 6px 0; font-size: 13px; color: #FAF7F5; font-family: monospace;">${customerPhone}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 12px; color: #8F8789; font-family: monospace;">Destination City:</td>
        <td align="right" style="padding: 6px 0; font-size: 13px; color: #FAF7F5;">${city}</td>
      </tr>
    </table>

    <!-- Items Ordered -->
    <div style="background: #18191E; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 16px; margin: 16px 0;">
      <div style="font-size: 11px; text-transform: uppercase; color: #D98A92; font-family: monospace; font-weight: bold; margin-bottom: 8px;">Ordered Items:</div>
      <div style="font-size: 13px; color: #E6DFDD; line-height: 1.6;">
        ${itemsListText || '1x Luxury Wellness Instrument'}
      </div>
    </div>

    <!-- Shipping Address -->
    <div style="background: #18191E; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 16px; margin: 16px 0;">
      <div style="font-size: 11px; text-transform: uppercase; color: #D98A92; font-family: monospace; font-weight: bold; margin-bottom: 6px;">Shipping Address:</div>
      <p style="margin: 0; font-size: 13px; color: #E6DFDD; line-height: 1.5;">${address}</p>
    </div>
  `;

  return wrapEmailLayout(`🚨 New Order #${orderId} Alert - Midnight Bloom`, preheader, contentHtml);
}

/**
 * 7. Welcome VIP Member Email Template
 */
function getWelcomeVipTemplate(customerName = 'Valued Member') {
  const preheader = `Welcome to Midnight Bloom. 200 Loyalty Points credited to your account.`;

  const contentHtml = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: rgba(217, 138, 146, 0.15); color: #D98A92; border: 1px solid rgba(217, 138, 146, 0.3); padding: 4px 14px; border-radius: 20px; font-size: 10px; font-family: monospace; font-weight: bold; text-transform: uppercase;">
        👑 Welcome to the Inner Circle
      </span>
      <h2 style="margin: 14px 0 6px; font-family: Georgia, serif; font-size: 24px; color: #FAF7F5;">Welcome, ${customerName}</h2>
      <p style="margin: 0; font-size: 13px; color: #B3AAA8; line-height: 1.6;">
        You are now a registered member of Midnight Bloom India. Enjoy end-to-end encrypted shopping, 100% plain unbranded deliveries, and exclusive member tier benefits.
      </p>
    </div>

    <!-- Rewards Credit Card -->
    <div style="background: linear-gradient(135deg, #1C1D22 0%, #16171B 100%); border: 1px solid #D98A92; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
      <div style="font-size: 11px; text-transform: uppercase; color: #D98A92; font-family: monospace; font-weight: bold; margin-bottom: 4px;">Welcome Reward</div>
      <div style="font-size: 32px; font-weight: bold; font-family: monospace; color: #FAF7F5; margin-bottom: 6px;">+200 Points</div>
      <p style="margin: 0 0 16px; font-size: 12px; color: #B3AAA8;">Automatically credited for checkout discounts.</p>
      
      <div style="display: inline-block; background: #0A0A0C; border: 1px dashed #D98A92; border-radius: 6px; padding: 8px 20px; margin-bottom: 18px;">
        <span style="font-size: 11px; color: #B3AAA8;">First Order Promo: </span>
        <strong style="color: #FAF7F5; font-family: monospace; font-size: 13px;">FIRST500</strong>
      </div>

      <div>
        <a href="https://midnightbloom.in/catalog" style="display: inline-block; background: #D98A92; color: #121316; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 12px 32px; border-radius: 8px;">
          Explore Luxury Collection
        </a>
      </div>
    </div>
  `;

  return wrapEmailLayout('Welcome to Midnight Bloom - Confidential Intimate Wellness', preheader, contentHtml);
}

export {
  wrapEmailLayout,
  getOtpEmailTemplate,
  getOrderConfirmationTemplate,
  getShippingUpdateTemplate,
  getNewProductLaunchTemplate,
  getAbandonedCartTemplate,
  getAdminOrderAlertTemplate,
  getWelcomeVipTemplate
};

export default {
  wrapEmailLayout,
  getOtpEmailTemplate,
  getOrderConfirmationTemplate,
  getShippingUpdateTemplate,
  getNewProductLaunchTemplate,
  getAbandonedCartTemplate,
  getAdminOrderAlertTemplate,
  getWelcomeVipTemplate
};
