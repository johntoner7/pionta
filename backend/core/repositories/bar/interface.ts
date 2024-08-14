import { QueryResult } from 'mysql2/promise';
import mysqlBarRepository from './mysql';


export enum BarRepositoryType {
  MYSQL = 'MYSQL',
}

export const getBarRepository = (type: BarRepositoryType): BarRepository => {
  switch (type) {
    case BarRepositoryType.MYSQL:
      return  mysqlBarRepository;
    default:
      throw new Error('Invalid repository type');
  }
};

export interface BarRepository {
  listBars(): Promise<QueryResult>;
  getBarId(barName: string): Promise<number>;
  addBar(name: string, description: string, latitude: number, longitude: number): Promise<number>;
}

export default BarRepository;