import { getBarRepository, BarRepositoryType } from '../repositories/bar/interface';
import config from '../../config/config';
import { wss } from '../../server'; // Import the WebSocket server
import { NewBar } from '../../../shared/types/bar';

const barRepository = getBarRepository(config.BAR_REPOSITORY);

const addBar = async (bar: NewBar): Promise<any> => {
  try {
    const result = await barRepository.addBar(bar);

    // Broadcast the new bar addition to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ event: 'newBar', data: result }));
      }
    });

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