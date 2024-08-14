import config from '../../config/config';

const getMapboxConfig = async (): Promise<string> => {
    return config.MAPBOX_ACCESS_TOKEN
};

export default {
  getMapboxConfig,
};
