import { createClient } from '@supabase/supabase-js';
import { BarRepository } from './interface';
import { QueryResult } from 'mysql2/promise';
import supabase from '../../db/supabase/client';

export interface Bar {
  id: number;
  longitude: number;
  latitude: number;
  name: string;
  description: string;
  pintPrices: {
    id: number;
    name: string;
    price: number;
  }[];
}

const supabaseBarRepository: BarRepository = {
  async listBars(): Promise<Bar[]> {
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

  async addBar(name: string, description: string, latitude: number, longitude: number): Promise<number> {
    const { data, error } = await supabase
      .from('bars')
      .insert([{ name, description, latitude, longitude }])
      .single();

    if (error) {
      throw new Error(`Error adding bar: ${error.message}`);
    }

    return 0;
  }
};

export default supabaseBarRepository;