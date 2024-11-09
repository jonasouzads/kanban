// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let supabase: SupabaseClient;

// Garantindo que apenas uma instância do Supabase seja criada
if (typeof window === 'undefined') {
  // Instância para o lado do servidor
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Instância para o lado do cliente
  supabase = createClientComponentClient();
}

export { supabase };
