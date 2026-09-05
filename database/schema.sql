-- ==============================================================================
-- MIDNIGHT BLOOM - ENTERPRISE POSTGRESQL DATABASE SCHEMA (START TO END)
-- Version: 1.0.0 Production DDL
-- Features: Strict ACID compliance, UUID PKs, GIN Full-Text Indexes, JSONB Specs
-- ==============================================================================

-- Enable UUID and Cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing tables in reverse dependency order
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS processed_events CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS bundle_items CASCADE;
DROP TABLE IF EXISTS bundles CASCADE;
DROP TABLE IF EXISTS product_specs CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS user_addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_encrypted BYTEA, -- Encrypted via AES-256 (pgp_sym_encrypt)
    is_age_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);

-- ==========================================
-- 2. USER ADDRESSES TABLE
-- ==========================================
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_pincode ON user_addresses(pincode);

-- ==========================================
-- 3. CATEGORIES TABLE (8 Departments)
-- ==========================================
CREATE TABLE categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    tagline TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. PRODUCTS TABLE (50 Certified Items)
-- ==========================================
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    category_id VARCHAR(100) REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    subcategory VARCHAR(100) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price > 0),
    original_price NUMERIC(10, 2),
    discount_text VARCHAR(50),
    badge VARCHAR(50),
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    rating_avg NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Full-Text Search GIN Index (Zero-delay Search Bar)
CREATE INDEX idx_products_fts ON products USING GIN (
    to_tsvector('english', name || ' ' || COALESCE(subtitle, '') || ' ' || COALESCE(description, '') || ' ' || subcategory)
);
CREATE INDEX idx_products_category_active ON products(category_id, is_active) WHERE is_active = true;

-- ==========================================
-- 5. PRODUCT VARIANTS (Colors & Finishes)
-- ==========================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    stock_quantity INT DEFAULT 100 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ==========================================
-- 6. PRODUCT IMAGES TABLE
-- ==========================================
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT false
);
CREATE INDEX idx_product_images_product ON product_images(product_id, display_order);

-- ==========================================
-- 7. PRODUCT SPECS & UNBOXING TABLE
-- ==========================================
CREATE TABLE product_specs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    sound_level VARCHAR(100),
    material VARCHAR(150),
    battery_life VARCHAR(150),
    waterproof_rating VARCHAR(100),
    modes_count VARCHAR(150),
    dimensions VARCHAR(100),
    in_the_box JSONB DEFAULT '[]'::jsonb,
    custom_attributes JSONB DEFAULT '{}'::jsonb
);
CREATE INDEX idx_specs_custom_jsonb ON product_specs USING GIN (custom_attributes);

-- ==========================================
-- 8. BUNDLES & FREQUENTLY BOUGHT TOGETHER
-- ==========================================
CREATE TABLE bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    primary_product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    bundle_price NUMERIC(10, 2) NOT NULL,
    bundle_original_price NUMERIC(10, 2) NOT NULL,
    savings_text VARCHAR(50),
    is_active BOOLEAN DEFAULT true
);

-- ==========================================
-- 9. CARTS & CART ITEMS TABLE
-- ==========================================
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE,
    packaging_preference VARCHAR(50) DEFAULT 'plain-box',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    color_name VARCHAR(100) DEFAULT 'Standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 10. ORDERS TABLE (Idempotency & Zero Leak)
-- ==========================================
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. MB-849201
    idempotency_key VARCHAR(255) UNIQUE, -- Zero double-charge
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    shipping_address JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    payment_mode VARCHAR(50) NOT NULL,
    packaging_type VARCHAR(100) DEFAULT '100% Plain Unbranded Box',
    statement_descriptor VARCHAR(100) DEFAULT 'MB* SERVICES LLC',
    status VARCHAR(50) DEFAULT 'Processing' CHECK (status IN ('Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders USING BRIN (created_at);

-- ==========================================
-- 11. ORDER ITEMS TABLE
-- ==========================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    price_snapshot NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    color_variant VARCHAR(100)
);

-- ==========================================
-- 12. PAYMENTS TABLE (Pay0pro.shop / UPI / COD)
-- ==========================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    gateway VARCHAR(50) DEFAULT 'Pay0pro.shop',
    transaction_id VARCHAR(255) UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 13. REVIEWS & TESTIMONIALS TABLE
-- ==========================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(100) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_verified_buyer BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 14. PROCESSED EVENTS TABLE (Event Bus Deduplication)
-- ==========================================
CREATE TABLE processed_events (
    event_id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'DELIVERED',
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-update Triggers
CREATE TRIGGER trigger_update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER trigger_update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
