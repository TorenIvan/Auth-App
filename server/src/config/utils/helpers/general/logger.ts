import pino from 'pino';
import { EnvironmentVariables } from '../../constants/EnvironmentVariables';

export const logger = pino({
  level: EnvironmentVariables.Log_Level || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      // You can add more pretty options here if you want
    },
  },
  redact: ['DATABASE_URL'], // redact sensitive info
});
