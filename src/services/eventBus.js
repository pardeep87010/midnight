/**
 * ==============================================================================
 * Midnight Bloom - Resilient Event Bus & Idempotency Engine
 * ==============================================================================
 * 
 * Features:
 *   - Idempotency Key verification (Zero double-charging / duplicate execution)
 *   - Publish / Subscribe pattern for asynchronous decoupled services
 *   - Automatic Exponential Retry Backoff on transient failures
 *   - Dead Letter Queue (DLQ) for failed/unhandled messages
 *   - Persistent Event Audit Log in localStorage
 */

class EventBus {
  constructor() {
    this.listeners = new Map();
    this.processedIdempotencyKeys = new Set(this.loadProcessedKeys());
    this.eventLogs = this.loadEventLogs();
    this.dlq = this.loadDLQ();
  }

  loadProcessedKeys() {
    try {
      const saved = localStorage.getItem('mb_idempotency_keys');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveProcessedKeys() {
    try {
      localStorage.setItem('mb_idempotency_keys', JSON.stringify(Array.from(this.processedIdempotencyKeys)));
    } catch (e) {}
  }

  loadEventLogs() {
    try {
      const saved = localStorage.getItem('mb_event_bus_logs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveEventLogs() {
    try {
      localStorage.setItem('mb_event_bus_logs', JSON.stringify(this.eventLogs.slice(0, 100)));
    } catch (e) {}
  }

  loadDLQ() {
    try {
      const saved = localStorage.getItem('mb_event_dlq');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveDLQ() {
    try {
      localStorage.setItem('mb_event_dlq', JSON.stringify(this.dlq));
    } catch (e) {}
  }

  // Subscribe a listener to an event topic
  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType) || [];
      this.listeners.set(eventType, callbacks.filter(cb => cb !== callback));
    };
  }

  // Publish an event with optional Idempotency Key
  async publish(eventType, payload, options = {}) {
    const { idempotencyKey = null, maxRetries = 3 } = options;
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    // 1. Check Idempotency (Prevent double execution / double charge)
    if (idempotencyKey) {
      if (this.processedIdempotencyKeys.has(idempotencyKey)) {
        console.warn(`[EventBus] ⚠️ Duplicate event ignored (Idempotency Key: ${idempotencyKey})`);
        this.logEvent({
          eventId,
          eventType,
          idempotencyKey,
          status: 'DUPLICATE_IGNORED',
          timestamp,
          payload
        });
        return { success: true, duplicate: true, eventId };
      }
      this.processedIdempotencyKeys.add(idempotencyKey);
      this.saveProcessedKeys();
    }

    const callbacks = this.listeners.get(eventType) || [];
    let isSuccess = true;
    let executionError = null;

    // 2. Execute subscribers with retry backoff
    for (const callback of callbacks) {
      let attempts = 0;
      let callbackSuccess = false;

      while (attempts < maxRetries && !callbackSuccess) {
        attempts++;
        try {
          await callback(payload, { eventId, eventType, timestamp, idempotencyKey });
          callbackSuccess = true;
        } catch (err) {
          executionError = err;
          console.error(`[EventBus] Error executing handler for '${eventType}' (Attempt ${attempts}/${maxRetries}):`, err);
          if (attempts < maxRetries) {
            // Exponential backoff wait (100ms, 200ms, 400ms in simulation)
            await new Promise(res => setTimeout(res, attempts * 100));
          }
        }
      }

      if (!callbackSuccess) {
        isSuccess = false;
        // Push to Dead Letter Queue (DLQ)
        this.dlq.unshift({
          eventId,
          eventType,
          idempotencyKey,
          payload,
          error: executionError?.message || 'Handler execution failed after retries',
          timestamp
        });
        this.saveDLQ();
      }
    }

    // 3. Log event audit record
    this.logEvent({
      eventId,
      eventType,
      idempotencyKey,
      status: isSuccess ? 'DELIVERED' : 'SENT_TO_DLQ',
      timestamp,
      payload
    });

    return { success: isSuccess, eventId, timestamp };
  }

  logEvent(logItem) {
    this.eventLogs.unshift(logItem);
    if (this.eventLogs.length > 100) this.eventLogs.pop();
    this.saveEventLogs();
  }

  getLogs() {
    return this.eventLogs;
  }

  getDLQ() {
    return this.dlq;
  }

  clearLogs() {
    this.eventLogs = [];
    this.saveEventLogs();
  }
}

// Global Singleton Instance
export const eventBus = new EventBus();
