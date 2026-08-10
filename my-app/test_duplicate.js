import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function testDuplicateSlug() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  const payload = {
    name: "Duplicate Test",
    slug: "repro-1786394753705", // Existing slug from previous test
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

testDuplicateSlug();
