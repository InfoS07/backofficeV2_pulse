import { createClient } from "./client";

export const getChallenges = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('challenges').select('*');
  if (error) {
    console.error(error);
    return [];
  }
  return data;
};

export const addChallenge = async (challenge: any) => {
    const supabase = createClient();
  const { data, error } = await supabase.from('challenges').insert([challenge]).select('*').single();
  if (error) throw error;
  return data;
};

export const deleteChallengeById = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('challenges').delete().eq('id', id);
  if (error) {
    console.error('Erreur lors de la suppression du exercice:', error.message);
    return false;
  }
  return true;
};

export const getChallengesByInvitedUserId = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('challenges_users').select('*').contains('invites', [userId]);
  if (error) {
    console.error(error);
    return [];
  }
  return data;
};


export const getChallengesByUserId = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('challenges_users').select('*').eq('author_id', userId);
  if (error) {
    console.error(error);
    return [];
  }
  return data;
};