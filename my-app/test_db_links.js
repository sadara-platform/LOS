import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '.env');

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('--- STARTING DATABASE LINKING TESTS ---');

  // 1. Fetch a Brand
  console.log('\n[1] Testing Brands table...');
  const { data: brands, error: brandError } = await supabase.from('brands').select('*').limit(1);
  if (brandError) {
    console.error('❌ Error fetching brand:', brandError.message);
  } else if (!brands || brands.length === 0) {
    console.warn('⚠️ No brands found to test linking.');
    return;
  } else {
    console.log('✅ Brands table accessible. Found brand:', brands[0].name);
  }

  const testBrand = brands[0];

  // 2. Test Brand -> Products Link
  console.log('\n[2] Testing Brand -> Products foreign key...');
  const { data: products, error: productError } = await supabase.from('products').select('*').eq('brand_id', testBrand.id);
  if (productError) {
    console.error('❌ Error fetching products:', productError.message);
  } else {
    console.log(`✅ Products linking valid. Found ${products.length} products for this brand.`);
  }

  // 3. Test Brand -> Offers Link
  console.log('\n[3] Testing Brand -> Offers foreign key...');
  const { data: offers, error: offerError } = await supabase.from('offers').select('*').eq('brand_id', testBrand.id);
  if (offerError) {
    console.error('❌ Error fetching offers:', offerError.message);
  } else {
    console.log(`✅ Offers linking valid. Found ${offers ? offers.length : 0} offers for this brand.`);
  }

  // 4. Test Invalid Foreign Key (Should Fail)
  console.log('\n[4] Testing Foreign Key Enforcement (Inserting Product with invalid brand_id)...');
  const { error: invalidInsertError } = await supabase.from('products').insert([{
    brand_id: '00000000-0000-0000-0000-000000000000', // Fake UUID
    name: 'Ghost Product',
    sku: 'GHOST',
    price: 999,
    category: 'TEST'
  }]);
  
  if (invalidInsertError) {
    console.log('✅ Foreign Key Enforced! Database correctly blocked invalid brand_id.');
    console.log(`   (Error: ${invalidInsertError.message})`);
  } else {
    console.error('❌ DANGER: Database allowed inserting a product with an invalid brand_id. Foreign key is missing!');
  }

  // 5. Check Codes Linking
  console.log('\n[5] Testing Codes -> Brand Linking...');
  const { data: codes, error: codesError } = await supabase.from('codes').select('*').eq('brand_id', testBrand.id);
  if (codesError) {
    console.error('❌ Error fetching codes:', codesError.message);
  } else {
    console.log(`✅ Codes table accessible and linking valid. Found ${codes ? codes.length : 0} codes.`);
  }

  console.log('\n--- TESTS COMPLETED ---');
}

runTests();
