import { NextFunction, Request, Response } from 'express';
import logger from '.';

export const loggerMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  logger.log('info', `${req.method} ${req.path} `);
  req.body && logger.log('info', `Body:\n${JSON.stringify(req.body, null, 2)}`);
  next();
};