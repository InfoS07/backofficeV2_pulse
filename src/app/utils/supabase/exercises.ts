import { createClient } from "./client";



export const getExercises = async () => {
    const supabase = createClient();
  const { data, error } = await supabase.from('exercises').select('*');
  if (error) throw error;
  return data;
};

export const addExercise = async (exercise: any) => {
    const supabase = createClient();
  const { data, error } = await supabase.from('exercises').insert([exercise]).select('*').single();
  if (error) throw error;
  return data;
};


export const deleteExerciseById = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('exercises').delete().eq('id', id);
  if (error) {
    console.error('Erreur lors de la suppression du exercice:', error.message);
    return false;
  }
  return true;
};