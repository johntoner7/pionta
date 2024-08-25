import redisClient from '../../../db/redis/client';
import { Bar } from '../../../../../shared/types/bar';
import BarCacheRepository from './interface';

const listBarsCacheKey = 'bars:list';

export const listBars = async (): Promise<Bar[] | null> => {
  const cachedBars = await redisClient.get(listBarsCacheKey);
  if (cachedBars) {
    return JSON.parse(cachedBars) as Bar[];
  }
  return null;
};

export const addBars = async (bars: Bar[]): Promise<void> => {
  await redisClient.set(listBarsCacheKey, JSON.stringify(bars), {
    EX: 10
  });
  };

const redisBarRepository: BarCacheRepository = {
  listBars,
  addBars
};

export default redisBarRepository;