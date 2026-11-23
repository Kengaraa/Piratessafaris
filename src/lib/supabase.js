import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const configured = Boolean(url && key)
export const supabase = createClient(url || 'http://localhost', key || 'missing', {
  auth: { persistSession: true, autoRefreshToken: true }
})
export const money = (n, c = 'KES') =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n || 0)
export const WHATSAPP = import.meta.env.VITE_WHATSAPP || '254700000000'
