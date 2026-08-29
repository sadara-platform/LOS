import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'c:/Users/AMEER/Desktop/LOS/LOS/my-app/.env' })
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRole = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function checkRedemptions() {
  const { data, error } = await supabase.from('offer_redemptions').select('*')
  console.log("Error:", error)
  console.log("Data:", data)
}

checkRedemptions()
