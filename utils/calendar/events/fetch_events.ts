import { SupabaseClient } from "@supabase/supabase-js";
import { Tables } from "@/lib/database.types";

export async function fetchEvents(
  supabase: SupabaseClient,
  user_id: string,
  weekStart: string
): Promise<{ data: Tables<"events">[] | null; error: string | null }> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user_id)
    .gte("date", weekStart)
    .lte("date", weekEnd.toDateString())
    .order("order_index", { ascending: true });

  return { data: data as Tables<"events">[] | null, error: error ? error.message : null };
}
