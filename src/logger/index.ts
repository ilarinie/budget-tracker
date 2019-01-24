import { processRequest } from 'graphql-upload';
import winston from 'winston';

const getTransports = () => {
  if (process.env.NODE_ENV === 'test') {
    return [
      new winston.transports.File({ filename: 'test.log' })
    ];
  } else if (process.env.NODE_ENV === 'production') {
    return [
      new winston.transports.File({ filename: 'app.log' })
    ];
  } else {
    return [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'app.log' })
    ];
  }
};

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp}  ${info.level}   ${info.message}`;
    })
  ),
  transports: getTransports()
});

export default logger;