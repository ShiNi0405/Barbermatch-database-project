import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://obnuowxdwnojnropwyks.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnVvd3hkd25vam5yb3B3eWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzI0MDcsImV4cCI6MjA3MjE0ODQwN30.QyEIWD9hWaauBGE-Hvcwyzavr0V687fm6t8A0YvYCKo';
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});