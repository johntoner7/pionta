import dotenv from 'dotenv';
import { BarRepositoryType } from '../core/repositories/bar/interface';
import { LogRepositoryType } from '../core/repositories/log/interface';
import { PintRepositoryType } from '../core/repositories/pint/interface';

dotenv.config();

interface DatabaseConfig {
  DB_HOST: string;
  DB_USER: string;
  DB_NAME: string;
  DB_PASSWORD?: string;
}

interface ServerConfig {
  PORT?: number;
}

interface MapboxConfig {
    MAPBOX_ACCESS_TOKEN: string;
}

interface RepositoryConfig {
  BAR_REPOSITORY: BarRepositoryType;
  LOG_REPOSITORY: LogRepositoryType;
  PINT_REPOSITORY: PintRepositoryType;
}

interface Config extends DatabaseConfig, ServerConfig, MapboxConfig, RepositoryConfig {}

const getDatabaseConfig = (): DatabaseConfig => {
  return {
    DB_HOST: process.env.DB_HOST || '',
    DB_USER: process.env.DB_USER || '',
    DB_NAME: process.env.DB_NAME || 'pionta',
    DB_PASSWORD: process.env.DB_PASSWORD,
  };
};

const getMapboxConfig = (): MapboxConfig => {
    return {
        MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN || '',
    };
}

const getServerConfig = (): ServerConfig => {
  return {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
  };
};

const getRepositoryConfig = (): RepositoryConfig => {
  return {
    BAR_REPOSITORY: process.env.BAR_REPOSITORY as unknown as BarRepositoryType,
    LOG_REPOSITORY: process.env.LOG_REPOSITORY as unknown as LogRepositoryType,
    PINT_REPOSITORY: process.env.PINT_REPOSITORY as unknown as PintRepositoryType,
  };
}

const getConfig = (): Config => {
  return {
    ...getDatabaseConfig(),
    ...getServerConfig(),
    ...getMapboxConfig(),
    ...getRepositoryConfig(),
  };
};

const config = getConfig();

export default config;