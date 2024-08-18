import { createClient } from '@supabase/supabase-js';
import { PintRepository } from './interface';
import supabase from '../../db/supabase/client';

const supabasePintRepository: PintRepository = {
  async getPintId(pintName: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('pints')
      .select('id')
      .eq('name', pintName)
      .single();

    if (error) {
      console.error('Error fetching pint ID:', error);
      return null;
    }

    return data ? data.id : null;
  },

  async createPint(pintName: string): Promise<number> {
    const { error } = await supabase
      .from('pints')
      .insert([{ name: pintName }])
      .single();

    if (error) {
      throw new Error(`Error creating pint: ${error.message}`);
    }
    const {data, error: e} = await supabase
    .from('pints')
    .select('id')
    .eq('name', pintName)
    .single();
    if (e) {
      throw new Error(`Error creating pint: ${e.message}`);
    }


    return data ? data.id : null;
  },

  async addPrice(barId: number, pintId: number, price: number): Promise<void> {
    const { error } = await supabase
      .from('prices')
      .insert([{ barId, pintId, price }]);

    if (error) {
      throw new Error(`Error adding price: ${error.message}`);
    }
  },

  async deletePint(id: number): Promise<void> {
    const { error } = await supabase
      .from('pints')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting pint: ${error.message}`);
    }
  },

  async deletePrice(barId: number, pintId: number, price: number): Promise<void> {
    const { error } = await supabase
      .from('prices')
      .delete()
      .eq('barId', barId)
      .eq('pintId', pintId)
      .eq('price', price);

    if (error) {
      throw new Error(`Error deleting price: ${error.message}`);
    }
  }
};

export default supabasePintRepository;