import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://caqfsnsmydvkupaxgtsy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcWZzbnNteWR2a3VwYXhndHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMDE4MjIsImV4cCI6MjA1MTU3NzgyMn0.hkZ3Dai9S_mm4rOeu0Fv32GI3-RSuBz5BNYumrbpzMI';

export const supabase = createClient(supabaseUrl, supabaseKey);