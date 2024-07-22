import { createClient } from "./client";

export const getUsers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error(error);
    return [];
  }
  return data;
};

export const getUserById = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const getUsersCount = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('users').select('count', { count: 'exact' });
    console.log('data', data);
    if (error) {
        console.log('error', error);
      console.error(error);
      return 0;
    }
    return data;
  };


  export async function createUser(user: {
    
    last_name: string;
    first_name: string;
    profile_photo: string | null;
    email: string;
  }) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('users')
      .insert([user]);
  
    if (error) {
      throw error;
    }
  
    return data;
  }