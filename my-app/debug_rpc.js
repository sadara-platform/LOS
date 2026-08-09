import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: matches, error: fetchErr } = await supabase.from('xo_matches').select('*').limit(1);
  if (fetchErr) {
    console.error('Fetch err:', fetchErr);
    return;
  }
  
  if (matches.length > 0) {
    const match = matches[0];
    console.log('Match schema sample:', match);
  }
}

test();
