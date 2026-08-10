import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars are missing. Copy .env.example to .env and fill in your project values."
  );
}

// NOTE: Not using the generic `createClient<Database>()` here on purpose — the
// bundled Database type in `types/database.ts` is a placeholder until you run
// `npx supabase gen types typescript` against your real project. Once you do,
// swap this back to `createClient<Database>(...)` for full query type-safety.
export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
