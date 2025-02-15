import { SeqTransport } from '@datalust/winston-seq';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.add(new SeqTransport({
  serverUrl: "http://localhost:5341",
  apiKey: "IyHOpcyUhq34S108KJxL",
  onError: ((e: unknown) => { console.error(e) }),
}));

logger.info('Hello, Winston!');