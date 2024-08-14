import mysqlPintRepository from "./mysql";
export interface PintRepository {
  getPintId(pintName: string): Promise<number | null>;
    createPint(pintName: string): Promise<number>;
    addPrice(barId: number, pintId: number, price: number): Promise<void>;
    deletePint(id: number): Promise<void>;
    deletePrice(barId: number, pintId: number, price: number): Promise<void>;
}

export enum PintRepositoryType {
  MYSQL = 'MYSQL',
}

export const getPintRepository = (type: PintRepositoryType): PintRepository => {
  switch (type) {
    case PintRepositoryType.MYSQL:
      return mysqlPintRepository;
    default:
      throw new Error('Invalid repository type');
  }
};