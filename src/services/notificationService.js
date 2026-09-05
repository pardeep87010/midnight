import { eventBus } from './eventBus';

/**
 * ==============================================================================
 * Midnight Bloom - Confidential Notification Service
 * ==============================================================================
 * 
 * Features:
 *   - Auto-subscribes to Event Bus topics ('order.placed', 'payment.succeeded', 'order.status_updated')
 *   - Formats 100% Plain Confidential Transactional Emails (No explicit logos)
 *   - Sender Name: "MB Logistics"
 *   - Statement Descriptor: "MB* SERVICES LLC"
 *   - Persists sent notification receipts for audit & admin viewing
 */

class NotificationService {
  constructor() {
    this.sentNotifications = this.loadNotifications();
    this.initEventListeners();
  }

  loadNotifications() {
    try {
      const saved = localStorage.getItem('mb_sent_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveNotifications() {
    try {
      localStorage.setItem('mb_sent_notifications', JSON.stringify(this.sentNotifications.slice(0, 50)));
    } catch (e) {}
  }

  initEventListeners() {
    // 1. Listen for Order Placed
    eventBus.subscribe('order.placed', async (payload, meta) => {
      await this.sendCustomerOrderEmail(payload);
      await this.sendAdminOrderAlert(payload);
    });

    // 2. Listen for Payment Succeeded
    eventBus.subscribe('payment.succeeded', async (payload, meta) => {
      await this.sendPaymentReceiptEmail(payload);
    });

    // 3. Listen for Order Status Updates (Dispatch / Delivery)
    eventBus.subscribe('order.status_updated', async (payload, meta) => {
      await this.sendShippingUpdateEmail(payload);
    });
  }

  // Customer Confidential Order Confirmation Email
  async sendCustomerOrderEmail(order) {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const emailData = {
      id: notificationId,
      type: 'EMAIL_ORDER_CONFIRMATION',
      recipient: order.customerEmail || 'customer@example.com',
      recipientName: order.customerName || 'Valued Customer',
      sender: 'orders@mb-logistics.com (MB Logistics)',
      subject: `Order Confirmation #${order.id} - MB Logistics`,
      date: new Date().toLocaleString(),
      packaging: order.packaging || '100% Plain Unbranded Cardboard Box',
      statementDescriptor: 'MB* SERVICES LLC',
      orderSummary: {
        orderId: order.id,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentMode: order.paymentMode,
        city: order.customerCity || 'India'
      },
      contentHtml: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333333; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #111111; margin-top: 0;">Order Confirmation #${order.id}</h2>
          <p>Hello ${order.customerName || 'Customer'},</p>
          <p>Thank you for your order with <strong>MB Logistics</strong>. Your package is currently being prepared for dispatch.</p>
          
          <div style="background: #f7f7f7; padding: 16px; border-radius: 6px; margin: 18px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #555;"><strong>Packaging Guarantee:</strong> ${order.packaging}</p>
            <p style="margin: 0; font-size: 13px; color: #555;"><strong>Billing Descriptor:</strong> MB* SERVICES LLC</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #dddddd; text-align: left; font-size: 13px;">
                <th style="padding: 8px 0;">Item Description</th>
                <th style="padding: 8px 0; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(order.items || []).map(i => `
                <tr style="border-bottom: 1px solid #eeeeee; font-size: 13px;">
                  <td style="padding: 10px 0;">${i.name} (x${i.quantity})</td>
                  <td style="padding: 10px 0; text-align: right;">$${(i.price * i.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; font-size: 14px;">
                <td style="padding: 12px 0;">Total Amount Paid (${order.paymentMode})</td>
                <td style="padding: 12px 0; text-align: right; color: #A38059;">$${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <p style="font-size: 12px; color: #777777; margin-top: 24px; border-top: 1px solid #eeeeee; padding-top: 12px;">
            This is an automated confidential order receipt. Shipped via MB Logistics Express. Zero adult logos or markings.
          </p>
        </div>
      `
    };

    this.sentNotifications.unshift(emailData);
    this.saveNotifications();
    console.log(`[NotificationService] ✉️ Dispatched Confidential Email to ${emailData.recipient} for Order ${order.id}`);
    return emailData;
  }

  // Admin Instant Order Notification
  async sendAdminOrderAlert(order) {
    const notificationId = `admin_${Date.now()}`;
    const alertData = {
      id: notificationId,
      type: 'ADMIN_INSTANT_ALERT',
      recipient: 'admin@midnightbloom.com',
      subject: `🚨 New Order ${order.id} ($${order.totalAmount}) - ${order.customerCity}`,
      date: new Date().toLocaleString(),
      orderId: order.id,
      amount: order.totalAmount
    };
    this.sentNotifications.unshift(alertData);
    this.saveNotifications();
    return alertData;
  }

  // Shipping Update Email
  async sendShippingUpdateEmail(payload) {
    const { orderId, newStatus, customerEmail = 'customer@example.com' } = payload;
    const notificationId = `track_${Date.now()}`;
    const trackingData = {
      id: notificationId,
      type: 'SHIPPING_UPDATE',
      recipient: customerEmail,
      subject: `Discreet Shipment Update: Order #${orderId} is now ${newStatus}`,
      date: new Date().toLocaleString(),
      orderId,
      status: newStatus
    };
    this.sentNotifications.unshift(trackingData);
    this.saveNotifications();
    return trackingData;
  }

  getNotifications() {
    return this.sentNotifications;
  }
}

// Global Singleton Instance
export const notificationService = new NotificationService();
