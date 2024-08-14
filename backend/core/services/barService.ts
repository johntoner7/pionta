import { getBarRepository, BarRepositoryType } from '../repositories/bar/interface';
import config from '../../config/config';

const barRepository = getBarRepository(config.BAR_REPOSITORY)

const addBar = async (name: string, description: string, latitude: number, longitude: number): Promise<any> => {

  try {
    const result = await barRepository.addBar(name, description, latitude, longitude);
    return result;
  } catch (error) {
    throw error;
  }
};

const listBars = async (): Promise<any> => {
  const result = await barRepository.listBars();
  return result;
};

export default {
  addBar,
  listBars
};
