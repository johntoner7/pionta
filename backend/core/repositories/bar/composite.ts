import BarCacheRepository from "./cache/interface";
import BarRepository from "./interface";
import { Bar } from '../../../../shared/types/bar';

const compositeBarRepository = (databaseRepository: BarRepository, cacheRepository: BarCacheRepository): BarRepository => {

  return {
    async listBars(): Promise<Bar[]> {
      // Check cache first
      const cachedBars = await cacheRepository.listBars();
      console.log("Cached bars: ", cachedBars);
      if (cachedBars && cachedBars.length > 0) {
        return cachedBars;
      }
      // If not in cache, query the database
      const bars = await databaseRepository.listBars();
      console.log("Bars from database: ", bars);
      // Store the result in cache
      await cacheRepository.addBars(bars);

      return bars;
    },

    async getBarId(barName: string): Promise<number> {
      return databaseRepository.getBarId(barName);
    },

    async addBar(bar: Bar): Promise<number> {
      return databaseRepository.addBar(bar);
    }
  };
};

export default compositeBarRepository;