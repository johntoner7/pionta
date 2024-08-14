import { QueryResult } from 'mysql2/promise';
import mysqlLogRepository from './mysql';


export enum LogRepositoryType {
  MYSQL = 'MYSQL',
}

export const getLogRepository = (type: LogRepositoryType): LogRepository => {
  switch (type) {
    case LogRepositoryType.MYSQL:
      return  mysqlLogRepository;
    default:
      throw new Error('Invalid repository type');
  }
};

export interface LogRepository {
  listPintLogs(): Promise<QueryResult>;
  logPint(pintId: number, barId: number, rating?: number, description?: string): Promise<void>;
  deleteLog(logId: number): Promise<void>;
}

export default LogRepository;