import pool from '../db/mysql/pool';
import { getLogRepository } from '../repositories/log/interface';
import { getPintRepository } from '../repositories/pint/interface';
import config from '../../config/config';
import {PintLogRequest} from '../../../shared/types/pintLog';

const logRepository = getLogRepository(config.LOG_REPOSITORY)
const pintRepository = getPintRepository(config.PINT_REPOSITORY)


export const logPint = async (log: PintLogRequest) => {
  let pintId: number | null;

    pintId = await pintRepository.getPintId(log.pintName);
    if (!pintId) {
      pintId = await pintRepository.createPint(log.pintName);
    }
    if (log.price) {
      await pintRepository.addPrice(log.barId, pintId, log.price);
    }

    await logRepository.logPint(log, pintId);

    return { message: 'Pint logged successfully: ', log };

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