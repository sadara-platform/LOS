import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function reproduce() {
  const tempSupabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  
  console.log("1. Signing up user...");
  const { data: authData, error: authError } = await tempSupabase.auth.signUp({
    email: `owner_${Date.now()}@test.com`,
    password: "SecurePass123!"
  });

  if (authError) {
    console.error("Auth Error:", authError.message);
    return;
  }

  const newOwnerId = authData.user.id;
  console.log("User created:", newOwnerId);

  console.log("2. Inserting brand via fetch (like AddBrandPage)...");
  const payload = {
    name: "Reproduction Brand",
    slug: `repro-${Date.now()}`,
    owner_id: newOwnerId
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/brands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Fetch Error:", errorData);
  } else {
    const data = await response.json();
    console.log("Success:", data);
  }
}

reproduce();
