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

  // Helper to optimize image URL through CDN
  getOptimizedImageUrl: (originalUrl, { width = 800, quality = 80 } = {}) => {
    if (!originalUrl) return '';
    return originalUrl;
  }
};
