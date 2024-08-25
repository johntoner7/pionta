import { Request, Response } from 'express';
import logger from '../../logger';
import authService from '../services/authService';

export const signUp = async (req: Request, res: Response): Promise<void> => {  
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return
    }
    try {
        const result = await authService.signUp(email, password);
        res.json({ message: 'Signed up successfully', userId: result });
    } catch (error) {
        logger.error((error as Error).message);
        res.status(500).json({ error: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return
    }
    try {
        const result = await authService.login(email, password);
        res.json({ message: 'Logged in successfully', session: result });
    }
    catch (error) {
        logger.error((error as Error).message);
        res.status(500).json({ error: (error as Error).message });
    }
};

export default {
    signUp,
    login,
}