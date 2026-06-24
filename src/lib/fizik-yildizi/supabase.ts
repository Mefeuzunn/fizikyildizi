import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cehrbbuaoywzynelkfos.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaHJiYnVhb3l3enluZWxrZm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjk3MTAsImV4cCI6MjA5Nzg0NTcxMH0.ZoVfPyR1_3GgxygfAD84cf0hK6kATUDVoeqfVcgavjw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
