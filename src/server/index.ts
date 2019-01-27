import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import apolloServer from '../graphql';
import { loggerMiddleWare } from '../logger/middleware';
import { checkLogin, handleLogin } from './auth';

/* Setup express */
const app = express();
app.use(bodyParser.json());

app.use(cors());

/* Set up logging requests */
app.use(loggerMiddleWare);

/* Auth routes */
app.post('/login', handleLogin);
app.get('/logged_in', checkLogin);

/* Setup graphql server */
apolloServer.applyMiddleware({app});

export default app;