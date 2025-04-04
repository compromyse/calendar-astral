import { Tables } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchSubjects(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: Tables<"subjects">[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("user_id", userId);

  return { data, error: error ? error.message : null };
}
