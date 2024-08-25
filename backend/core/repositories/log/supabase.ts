import { PostgrestError } from '@supabase/supabase-js';
import supabase from '../../db/supabase/client';
import { LogRepository } from './interface';
import { QueryResult } from 'mysql2/promise';
import { PintLog, PintLogRequest } from '../../../../shared/types/pintLog';


const supabaseLogRepository: LogRepository = {
  async listPintLogs(): Promise<PintLog[]> {
  const { data, error } = await supabase
    .from('pint_logs')
  .select(`
    id,
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
  console.log(data);
  const transformedData = data.map((log: { id: any; rating: any; description: any; created_at: any; pintName: { name: any; }[]; barName: { name: any; }[]; }) => ({
    id: log.id as number,
pintName: Array.isArray(log.pintName) 
  ? (log.pintName[0] as { name: string }).name 
  : (log.pintName as { name: string }).name,
barName: Array.isArray(log.barName) 
  ? (log.barName[0] as { name: string }).name 
  : (log.barName as { name: string }).name,
    rating: log.rating,
    description: log.description,
    createdAt: log.created_at,
  }));

    return transformedData as PintLog[];
  },

  async logPint(log: PintLogRequest, pintId: number): Promise<void> {
    const { error } = await supabase
      .from('pint_logs')
      .insert([{ pintId, barId: log.barId, rating: log.rating, description: log.description }]);

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