import { createClient } from "./client";

export const getDefis = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('challenges_users').select('*');
  if (error) {
    console.error(error);
    return [];
  }
  return data;
};
