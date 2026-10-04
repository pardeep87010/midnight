/**
 * ==============================================================================
 * Midnight Bloom - CDN Edge & HTTP Cache-Control Strategy
 * ==============================================================================
 * 
 * Headers specification for Cloudflare, CloudFront, Fastly & Browser Caching:
 *   - Static Media (Images, Video, Fonts): 1 Year Immutable Edge Cache
 *   - Product Catalog / Categories API: 1 Hour Edge Cache with 24h Stale-While-Revalidate
 *   - User Cart / Checkout / Admin: Zero Cache (no-store, no-cache, private)
 */

export const CDN_CONFIG = {
  CDN_DOMAIN: 'https://cdn.midnightbloom.com',
  EDGE_CACHE_ENABLED: true,
  
  // Header Sets for server / worker responses
  HEADERS: {
    // 1. Static Assets & Media (Images, Video, CSS, Fonts)
    STATIC_MEDIA: {
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      'X-CDN-Cache': 'HIT-EDGE',
      'Vary': 'Accept-Encoding'
    },

    // 2. Product Catalog API (20-item chunk responses)
    CATALOG_API: {
      'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
      'X-CDN-Cache': 'DYNAMIC-STALE-REVALIDATE',
      'Vary': 'Accept-Encoding, Origin'
    },

    // 3. Sensitive User Checkout, Payment & Admin Console
    PRIVATE_NO_CACHE: {
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    }
  },

  // Helper to optimize image URL through CDN and ensure safe encoding
  getOptimizedImageUrl: (originalUrl, { width = 800, quality = 80 } = {}) => {
    if (!originalUrl || typeof originalUrl !== 'string') {
      return '/placeholder-product.svg';
    }

    let cleanUrl = originalUrl.trim();

    // Map any legacy or raw unencoded special characters
    if (cleanUrl.includes('%') || cleanUrl.includes('+') || cleanUrl.includes('&') || cleanUrl.includes('(')) {
      cleanUrl = cleanUrl
        .replace(/100%/g, '100-Percent')
        .replace(/%/g, 'Percent')
        .replace(/\+/g, 'and')
        .replace(/&/g, 'and')
        .replace(/[()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Absolute URLs from external CDNs/Cloudinary
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    // Relative asset paths: ensure each path segment is cleanly encoded
    try {
      const parts = cleanUrl.split('/');
      return parts.map(part => (part ? encodeURIComponent(part) : '')).join('/');
    } catch (e) {
      return cleanUrl;
    }
  }
};

export const DEFAULT_PRODUCT_PLACEHOLDER = '/placeholder-product.svg';

export const handleImageError = (e, fallback = DEFAULT_PRODUCT_PLACEHOLDER) => {
  if (e && e.currentTarget) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
};
