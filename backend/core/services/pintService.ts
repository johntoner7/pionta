import config from '../../config/config';
import pool from '../db/pool';
import { getPintRepository, PintRepository } from '../repositories/pint/interface';

interface AddPintResponse {
  message: string;
  pintId: number;
  barId: number;
  price: number;
}

const pintRepository = getPintRepository(config.PINT_REPOSITORY)


export const addPint = async (pintName: string, barId: number, price: number): Promise<AddPintResponse> => {
  let pintId: number | null;

  try {

    pintId = await pintRepository.getPintId(pintName);
    if (!pintId) {
      pintId = await pintRepository.createPint(pintName);
    }

    await pintRepository.addPrice(barId, pintId, price);


    return { message: 'Pint and price added successfully', pintId, barId, price };
  } catch (error) {
    throw error;
  }
};

export const deletePint = async (id: number): Promise<void> => {

  try {

    await pintRepository.deletePint(id);

  } catch (error) {
    throw error;
  }
}

export const deletePrice = async (barId: number, pintId: number, price: number): Promise<void> => {

  try {
    await pintRepository.deletePrice(barId, pintId, price);
  } catch (error) {
    throw error;
  } 
}

export default {
  addPint,
  deletePint,
  deletePrice,
}