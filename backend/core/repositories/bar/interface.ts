import { QueryResult } from 'mysql2/promise';
import mysqlBarRepository from './mysql';
import supabaseBarRepository from './supabase';
import { Bar, NewBar } from '../../../../shared/types/bar';
import { BarRepositoryConfig } from '../../../config/config';
import compositeBarRepository from './composite';
import { getBarCacheRepository } from './cache/interface';

export enum BarRepositoryType {
  DATABASE = 'DATABASE',
  COMPOSITE = 'COMPOSITE',
}

export enum BarDatabaseRepositoryType {
  MYSQL = 'MYSQL',
  SUPABASE = 'SUPABASE',
}

export enum BarCacheRepositoryType {
  REDIS = 'REDIS',
}

const getBarDatabaseRepository = (config: BarRepositoryConfig): BarRepository => {
  switch (config.DATABASE_IMPLEMENTATION) {
    case BarDatabaseRepositoryType.MYSQL:
      return mysqlBarRepository;
    case BarDatabaseRepositoryType.SUPABASE:
      return supabaseBarRepository;
    default:
      throw new Error('Invalid database repository type');
  }
}


export const getBarRepository = (config: BarRepositoryConfig): BarRepository => {
  switch (config.REPOSITORY_TYPE) {
    case BarRepositoryType.DATABASE:
      return getBarDatabaseRepository(config);
    case BarRepositoryType.COMPOSITE:
      return compositeBarRepository(getBarDatabaseRepository(config), getBarCacheRepository(config));
    default:
      throw new Error('Invalid repository type');
  }
};

export interface BarRepository {
  listBars(): Promise<Bar[]>;
  getBarId(barName: string): Promise<number>;
  addBar(bar: NewBar): Promise<number>;
}

export default BarRepository;