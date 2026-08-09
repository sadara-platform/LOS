-- Migration to add owner_id to brands and link it to Supabase Auth users

-- 1. Add owner_id column
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS owner_id UUID NULL;

-- 2. Add foreign key constraint to auth.users
ALTER TABLE brands
ADD CONSTRAINT fk_brands_owner
FOREIGN KEY (owner_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;

-- 3. (Optional) Create an index for faster lookups when querying by owner_id
CREATE INDEX IF NOT EXISTS idx_brands_owner_id ON brands(owner_id);

-- Note: To assign a brand to an owner, you will update the brand row:
-- UPDATE brands SET owner_id = 'user-uuid-here' WHERE slug = 'brand-slug';
