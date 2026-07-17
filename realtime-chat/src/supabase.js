import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vldmdescviffrcsvunrr.supabase.co";
const supabaseKey = "sb_publishable_7VVCMBUVa2xCi5l_t5dK-g_ykvfHEZT";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);