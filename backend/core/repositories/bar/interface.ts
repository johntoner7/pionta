import { QueryResult } from 'mysql2/promise';
import mysqlBarRepository from './mysql';
import supabaseBarRepository from './supabase';
import {Bar} from './supabase';

export enum BarRepositoryType {
  MYSQL = 'MYSQL',
  SUPABASE = 'SUPABASE',
}

export const getBarRepository = (type: BarRepositoryType): BarRepository => {
  switch (type) {
    case BarRepositoryType.MYSQL:
      return  mysqlBarRepository;
    case BarRepositoryType.SUPABASE:
      return supabaseBarRepository;
    default:
      throw new Error('Invalid repository type');
  }
};

export interface BarRepository {
  listBars(): Promise<Bar[]>;
  getBarId(barName: string): Promise<number>;
  addBar(name: string, description: string, latitude: number, longitude: number): Promise<number>;
}

export default BarRepository;