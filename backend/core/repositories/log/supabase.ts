import { PostgrestError } from '@supabase/supabase-js';
import supabase from '../../db/supabase/client';
import { LogRepository } from './interface';
import { QueryResult } from 'mysql2/promise';


type Log = {
  id: number;
  pintId: number;
  barId: number;
  rating: number;
  description: string;
  created_at: string;
  pintName: {name: string}[]; // Ensure this is not an array
  barName: {name: string}[];  // Ensure this is not an array
};

const supabaseLogRepository: LogRepository = {
  async listPintLogs(): Promise<QueryResult> {
  const { data, error } = await supabase
    .from('pint_logs')
  .select(`
    id,
    pintId,
    barId,
    rating,
    description,
    created_at,
    pintName:pints(name),
    barName:bars(name)
  `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error listing pint logs: ${error.message}`);
  }
const transformedData = data.map((log: Log) => ({
  id: log.id,
  pintId: log.pintId,
  barId: log.barId,
pintName: Array.isArray(log.pintName) 
  ? (log.pintName[0] as { name: string }).name 
  : (log.pintName as { name: string }).name,
barName: Array.isArray(log.barName) 
  ? (log.barName[0] as { name: string }).name 
  : (log.barName as { name: string }).name,
  rating: log.rating,
  description: log.description,
  created_at: log.created_at
}));


    return transformedData as QueryResult;
  },

  async logPint(pintId: number, barId: number, rating?: number, description?: string): Promise<void> {
    const { error } = await supabase
      .from('pint_logs')
      .insert([{ pintId, barId, rating, description }]);

    if (error) {
      throw new Error(`Error logging pint: ${error.message}`);
    }
  },

  async deleteLog(logId: number): Promise<void> {
    const { error } = await supabase
      .from('pint_logs')
      .delete()
      .eq('id', logId);

    if (error) {
      throw new Error(`Error deleting log: ${error.message}`);
    }
  }
};

export default supabaseLogRepository;