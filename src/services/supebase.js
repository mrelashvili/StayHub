import { createClient } from '@supabase/supabase-js';
export const supabaseUrl = 'https://kyeknrmeyfhsxsybkwjj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZWtucm1leWZoc3hzeWJrd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA1OTI0NzksImV4cCI6MjAxNjE2ODQ3OX0.uLzHy9Sc-jU-_cPQjdCHARw9Jd805BTF9tovgUmG-PM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
