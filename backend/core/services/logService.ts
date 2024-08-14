import pool from '../db/pool';
import { getLogRepository } from '../repositories/log/interface';
import { getPintRepository } from '../repositories/pint/interface';
import config from '../../config/config';

const logRepository = getLogRepository(config.LOG_REPOSITORY)
const pintRepository = getPintRepository(config.PINT_REPOSITORY)


export const logPint = async (pintName: string, barId: number, rating?: number, description?: string, price?: number) => {
  let pintId: number | null;

    pintId = await pintRepository.getPintId(pintName);
    if (!pintId) {
      pintId = await pintRepository.createPint(pintName);
    }
    if (price) {
      await pintRepository.addPrice(barId, pintId, price);
    }

    await logRepository.logPint(pintId, barId, rating, description);

    return { message: 'Pint logged successfully', pintId, barId, rating, description };

};

export const listPintLogs = async () => {
    return await logRepository.listPintLogs();

};

export const deleteLog = async (logId: number) => {
    return await logRepository.deleteLog(logId);
}

export default {
  logPint,
  listPintLogs,
  deleteLog,
}