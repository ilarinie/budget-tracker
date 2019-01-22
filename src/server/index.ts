import bodyParser from 'body-parser';
import express from 'express';
import 'reflect-metadata';
import apolloServer from '../graphql';
import { loggerMiddleWare } from '../logger/middleware';
import { handleLogin } from './auth';

/* Setup express */
const app = express();
app.use(bodyParser.json());

/* Set up logging requests */
app.use(loggerMiddleWare);

/* Auth route */
app.post('/login', handleLogin);

/* Setup graphql server */
apolloServer.applyMiddleware({app});

export default app;