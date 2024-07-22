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


export const deleteDefisById = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('challenges_users').delete().eq('id', id);
    if (error) {
      console.error('Erreur lors de la suppression du exercice:', error.message);
      return false;
    }
    return true;
  };