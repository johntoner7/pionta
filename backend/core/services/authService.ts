import supabase from '../db/supabase/client';

export const signUp = async (email: string, password: string): Promise<any> => {
  try {
    const response = await supabase.auth.signUp({ email, password });
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<any> => {
  try {
    const response = await supabase.auth.signInWithPassword({ email, password });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default {
    signUp,
    login,
};