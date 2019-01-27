import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import logger from '../logger';

export const handleLogin = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const user = await User.findOneOrFail({ username: req.body.username });
    const correctPW = await bcrypt.compare(req.body.password, user.password);
    if (correctPW) {
        const token = 'Bearer ' + jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET as string, { expiresIn: 3600 });
        res.setHeader('Authorization', token);
        res.status(200).send({ token });
        return;
    }
  } catch (e) {
    logger.log('info', 'Error in authentication:');
    logger.log('info', e.message);
  }
  res.status(401).send('no bueno');
};

export const checkLogin = async (req: Request, res: Response) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.slice(7, req.headers.authorization.length);
    if (token) {
      let loggedIn;
      try {
        loggedIn = await jwt.verify(token, process.env.JWT_SECRET as string);
      } catch (e) {
        res.status(401).send();
      }
      if (loggedIn) {
        res.status(200).send();
      } else {
        res.status(401).send();
      }
    } else {
      res.status(401).send();
    }
  } else {
    res.status(401).send();
  }
};