// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente público — para Server Components y Client Components (respeta RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente admin — SOLO para API Routes (checkout, webhook, descarga)
// NUNCA lo uses en el frontend — bypasea Row Level Security
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
