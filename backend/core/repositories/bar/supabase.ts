import { BarRepository } from './interface';
import supabase from '../../db/supabase/client';
import { Bar, NewBar } from '../../../../shared/types/bar';

const supabaseBarRepository: BarRepository = {
  async listBars(): Promise<Bar[]> {
    console.log('Listing bars');
    const { data, error } = await supabase
      .from('bars')
      .select(`
        id,
        longitude,
        latitude,
        name,
        description,
        pintPrices:prices (
          id,
          name:pints(name),
          price
        )
      `)
      .order('name', { ascending: true });
  
    if (error) {
      throw new Error(`Error listing bars: ${error.message}`);
    }
    const transformedData = data.map((bar: any) => ({
      id: bar.id,
      longitude: bar.longitude,
      latitude: bar.latitude,
      name: bar.name,
      description: bar.description,
      pintPrices: bar.pintPrices.map((price: any) => ({
        id: price.id,
        name: price.name.name,
        price: price.price
      })
      )
    }));

    return transformedData as Bar[];
  },
  async getBarId(barName: string): Promise<number> {
    const { data, error } = await supabase
      .from('bars')
      .select('id')
      .eq('name', barName)
      .single();

    if (error) {
      throw new Error(`Error fetching bar ID: ${error.message}`);
    }

    return data ? data.id : null;
  },

  async addBar(bar: NewBar): Promise<number> {
    const { data, error } = await supabase
      .from('bars')
      .insert([{ 
        name: bar.name, 
        description: bar.description,
        latitude: bar.latitude,
        longitude: bar.longitude 
      }])
      .single();

    if (error) {
      throw new Error(`Error adding bar: ${error.message}`);
    }

    return 0;
  }
};

export default supabaseBarRepository;