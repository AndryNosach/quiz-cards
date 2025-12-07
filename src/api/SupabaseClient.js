import { createClient } from "@supabase/supabase-js";


const NEXT_PUBLIC_SUPABASE_URL="https://jvjncmgonsmazmezfqjz.supabase.co";
const NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="sb_publishable_Q8m_iH8pApEyY8akJNAaZA_F3DgpOUO";


export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY);