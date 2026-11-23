import { createClient } from "@supabase/supabase-js";

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
const url = /^https?:\/\//i.test(rawUrl)
  ? rawUrl
  : "https://placeholder.supabase.co";

export const configured = Boolean(
  rawUrl && key && /^https?:\/\//i.test(rawUrl),
);
export const supabase = createClient(url, key || "missing-anon-key", {
  auth: { persistSession: true, autoRefreshToken: true },
});
export const money = (n, c = "KES") =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(n || 0);
export const WHATSAPP = (
  import.meta.env.VITE_WHATSAPP || "254790404260"
).trim();
