import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vldmdescviffrcsvunrr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZG1kZXNjdmlmZnJjc3Z1bnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Mjg5MzMsImV4cCI6MjA5OTUwNDkzM30.D2k0BHy-p8hFLYGOR0mkIajAyYBOW79IAK3osjl-DGU";

export const supabase = createClient(supabaseUrl, supabaseKey);