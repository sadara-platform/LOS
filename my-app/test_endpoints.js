import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runTests() {
  console.log("Starting API Tests...\n");
  let testBrandId = null;
  let testProductId = null;
  let testOfferId = null;

  try {
    // 1. Test Admin: Fetch Brands
    console.log("[TEST] Fetching brands (Admin/Public)...");
    const { data: brands, error: fetchBrandsError } = await supabase.from('brands').select('*').limit(1);
    if (fetchBrandsError) throw new Error("Brands fetch failed: " + fetchBrandsError.message);
    console.log("✅ Brands fetch successful.");

    // 2. Test Admin: Create a Brand (Bypassing Auth for test purposes if RLS allows, or catching RLS)
    console.log("\n[TEST] Creating a test brand...");
    const mockSlug = `test-brand-${Date.now()}`;
    const { data: newBrand, error: insertBrandError } = await supabase.from('brands').insert({
      name: 'Test QA Brand',
      slug: mockSlug,
      theme_mode: 'dark'
    }).select().single();

    if (insertBrandError) {
      console.warn("⚠️ Brand insertion failed (Likely RLS blocking anon insert, this is expected if secured):", insertBrandError.message);
      
      // If we couldn't create one, let's just use the first existing brand for read tests
      if (brands && brands.length > 0) {
         testBrandId = brands[0].id;
         console.log("Using existing brand for further read tests:", testBrandId);
      }
    } else {
      testBrandId = newBrand.id;
      console.log("✅ Test brand created:", testBrandId);
    }

    if (!testBrandId) {
       console.log("❌ No brand ID available to run further tests. Skipping dependent tests.");
       return;
    }

    // 3. Test Brand Owner: Fetch/Create Products
    console.log("\n[TEST] Fetching products for brand...");
    const { data: products, error: fetchProductsError } = await supabase.from('products').select('*').eq('brand_id', testBrandId);
    if (fetchProductsError) {
       console.warn("⚠️ Products fetch failed:", fetchProductsError.message);
    } else {
       console.log(`✅ Products fetch successful. Found ${products.length} products.`);
    }

    console.log("[TEST] Creating a test product...");
    const { data: newProduct, error: insertProductError } = await supabase.from('products').insert({
      brand_id: testBrandId,
      name: 'Test Product',
      sku: `SKU-${Date.now()}`,
      price: 99.99,
      category: 'hardware'
    }).select().single();

    if (insertProductError) {
      console.warn("⚠️ Product insertion failed (Likely RLS):", insertProductError.message);
    } else {
      testProductId = newProduct.id;
      console.log("✅ Test product created:", testProductId);
      
      // Test Delete Product
      console.log("[TEST] Deleting test product...");
      const { error: deleteProductError } = await supabase.from('products').delete().eq('id', testProductId);
      if (deleteProductError) console.warn("⚠️ Product deletion failed:", deleteProductError.message);
      else console.log("✅ Product deletion successful.");
    }

    // 4. Test Brand Owner: Fetch Offers
    console.log("\n[TEST] Fetching offers for brand...");
    const { data: offers, error: fetchOffersError } = await supabase.from('offers').select('*').eq('brand_id', testBrandId);
    if (fetchOffersError) {
       console.warn("⚠️ Offers fetch failed:", fetchOffersError.message);
    } else {
       console.log(`✅ Offers fetch successful. Found ${offers.length} offers.`);
    }

    // 5. Test Brand Owner: Fetch QR Codes
    console.log("\n[TEST] Fetching QR codes for brand...");
    const { data: codes, error: fetchCodesError } = await supabase.from('codes').select('*').eq('brand_id', testBrandId).limit(5);
    if (fetchCodesError) {
       console.warn("⚠️ QR Codes fetch failed:", fetchCodesError.message);
    } else {
       console.log(`✅ QR Codes fetch successful. Found ${codes.length} codes.`);
    }

    // 6. Test CMS Content
    console.log("\n[TEST] Fetching CMS Config for brand (from brands table)...");
    const { data: cmsConfig, error: fetchCmsError } = await supabase.from('brands').select('cms_config').eq('id', testBrandId).single();
    if (fetchCmsError) {
       console.warn("⚠️ CMS Content fetch failed:", fetchCmsError.message);
    } else {
       console.log(`✅ CMS Content fetch successful.`);
    }

    console.log("\n🎉 API Testing Completed.");

  } catch (err) {
    console.error("❌ Test script encountered a critical error:", err);
  }
}

runTests();
