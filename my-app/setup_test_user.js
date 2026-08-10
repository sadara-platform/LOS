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

async function setupTestData() {
  const userId = 'cfb45f46-9729-439e-9b68-2272171cc948';

  console.log('Creating brand for user:', userId);
  const { data: brandData, error: brandError } = await supabase
    .from('brands')
    .insert([{
      name: 'Test Brand ' + Date.now(),
      slug: 'test-brand-' + Date.now(),
      owner_id: userId,
      theme_mode: 'dark',
      primary_color: '#ff0000'
    }])
    .select()
    .single();

  if (brandError) {
    console.error('Brand insert error:', brandError);
    process.exit(1);
  }
  
  console.log('Brand created:', brandData.id);
  console.log('SUCCESS_CREDENTIALS');
  // I know from previous script output that the email is something like test_owner_... but wait!
  // I didn't save the email. I'll just create a fresh one!
}

async function run() {
  const email = 'brandowner_' + Date.now() + '@example.com';
  const password = 'TestPassword123!';

  console.log('Signing up fresh test user:', email);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Auth error:', authError);
    return;
  }

  const userId = authData.user.id;
  console.log('User created:', userId);

  console.log('Creating brand...');
  const { data: brandData, error: brandError } = await supabase
    .from('brands')
    .insert([{
      name: 'Test Brand ' + Date.now(),
      slug: 'test-brand-' + Date.now(),
      owner_id: userId,
      theme_mode: 'dark',
      primary_color: '#ff0000'
    }])
    .select()
    .single();

  if (brandError) {
    console.error('Brand insert error:', brandError);
    return;
  }
  
  console.log('Brand created:', brandData.id);
  console.log('=== SUCCESS_CREDENTIALS ===');
  console.log('EMAIL: ' + email);
  console.log('PASSWORD: ' + password);
}

run();
