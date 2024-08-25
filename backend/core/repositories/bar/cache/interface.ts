import { BarRepositoryConfig } from '../../../../config/config';
import { Bar } from '../../../../../shared/types/bar';
import redisBarRepository from './redis';

export enum BarCacheRepositoryType {
  REDIS = 'REDIS',
}

export const getBarCacheRepository = (config: BarRepositoryConfig): BarCacheRepository => {
  switch (config.CACHE_IMPLEMENTATION) {
    case BarCacheRepositoryType.REDIS:
      return redisBarRepository;
    default:
      throw new Error('Invalid repository type');
  }
};

export interface BarCacheRepository {
  listBars(): Promise<Bar[] | null>;
  addBars(bars: Bar[]): Promise<void>;
}

export default BarCacheRepository;