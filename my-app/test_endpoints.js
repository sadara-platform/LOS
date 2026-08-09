import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://azisorrlxthgjkgdhpth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aXNvcnJseHRoZ2prZ2RocHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MDMzMjgsImV4cCI6MjEwMTI3OTMyOH0.hEuSaV4KxnsQTIm6AT6hvsFK-rZQby_1NrLLxu2oLC0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('--- STARTING ENDPOINT TESTS ---');

  // 1. Test Brands Table
  const { error: brandsErr } = await supabase.from('brands').select('id').limit(1);
  if (brandsErr) console.error('❌ Brands Endpoint Failed:', brandsErr.message);
  else console.log('✅ Brands Endpoint OK');

  // 2. Test Codes Table
  const { error: codesErr } = await supabase.from('codes').select('id').limit(1);
  if (codesErr) console.error('❌ Codes Endpoint Failed:', codesErr.message);
  else console.log('✅ Codes Endpoint OK');

  // 3. Test Offers Table
  const { error: offersErr } = await supabase.from('offers').select('id').limit(1);
  if (offersErr) console.error('❌ Offers Endpoint Failed:', offersErr.message);
  else console.log('✅ Offers Endpoint OK');

  // 4. Test XO Matches Table
  const { error: matchesErr } = await supabase.from('xo_matches').select('id').limit(1);
  if (matchesErr) console.error('❌ XO Matches Endpoint Failed:', matchesErr.message);
  else console.log('✅ XO Matches Endpoint OK');

  // 5. Test RPC Function (make_xo_move)
  // We send a fake UUID to see if the RPC is reachable and correctly rejects it.
  const { error: rpcErr } = await supabase.rpc('make_xo_move', {
    p_match_id: '00000000-0000-0000-0000-000000000000',
    p_role: 'X',
    p_index: 0
  });
  
  if (rpcErr && rpcErr.message.includes('Match not found')) {
    console.log('✅ RPC Endpoint (make_xo_move) OK (Correctly validated fake match)');
  } else if (rpcErr) {
    console.error('❌ RPC Endpoint Failed with unexpected error:', rpcErr.message);
  } else {
    console.error('❌ RPC Endpoint Failed: Expected an error but got success.');
  }

  console.log('--- ENDPOINT TESTS COMPLETED ---');
}

runTests();
