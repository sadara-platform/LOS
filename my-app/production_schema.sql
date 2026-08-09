-- ==========================================
-- LOS Production Database Schema & RLS
-- ==========================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT,
    price NUMERIC,
    category TEXT,
    image_url TEXT,
    description TEXT,
    specs JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Performance Indexes (Fastest Queries)
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_codes_brand_id ON codes(brand_id);
CREATE INDEX IF NOT EXISTS idx_codes_code ON codes(code);
CREATE INDEX IF NOT EXISTS idx_offers_brand_id ON offers(brand_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for `brands`
DROP POLICY IF EXISTS "Public can view brands" ON brands;
CREATE POLICY "Public can view brands" ON brands
    FOR SELECT USING (true);
    
DROP POLICY IF EXISTS "Anyone can create brands" ON brands;
CREATE POLICY "Anyone can create brands" ON brands
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Brand Owner can update their brand" ON brands;
CREATE POLICY "Brand Owner can update their brand" ON brands
    FOR UPDATE USING (auth.uid() = owner_id);

-- 5. RLS Policies for `products`
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Brand Owner can manage products" ON products;
CREATE POLICY "Brand Owner can manage products" ON products
    FOR ALL USING (
        auth.uid() IN (
            SELECT owner_id FROM brands WHERE id = products.brand_id
        )
    );

-- 6. RLS Policies for `offers`
DROP POLICY IF EXISTS "Public can view offers" ON offers;
CREATE POLICY "Public can view offers" ON offers
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Brand Owner can manage offers" ON offers;
CREATE POLICY "Brand Owner can manage offers" ON offers
    FOR ALL USING (
        auth.uid() IN (
            SELECT owner_id FROM brands WHERE id = offers.brand_id
        )
    );

-- 7. RLS Policies for `codes`
DROP POLICY IF EXISTS "Brand Owner can manage codes" ON codes;
CREATE POLICY "Brand Owner can manage codes" ON codes
    FOR ALL USING (
        auth.uid() IN (
            SELECT owner_id FROM brands WHERE id = codes.brand_id
        )
    );

DROP POLICY IF EXISTS "Public can view or claim codes" ON codes;
CREATE POLICY "Public can view or claim codes" ON codes
    FOR SELECT USING (status = 'active' OR user_id = auth.uid());

DROP POLICY IF EXISTS "Public can update unassigned codes" ON codes;
CREATE POLICY "Public can update unassigned codes" ON codes
    FOR UPDATE USING (status = 'active');
