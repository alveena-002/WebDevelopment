// Minimal typed surface for supabase-js generics.
// Regenerate with: npx supabase gen types typescript --project-id <id> > src/types/database.ts
export interface Database {
  public: {
    Tables: Record<string, { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }>;
  };
}
