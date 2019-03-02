import { removeDirectivesFromDocument } from 'apollo-utilities';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import * as React from 'react';
import { getDataFromTree } from 'react-apollo';
import ReactDOMServer from 'react-dom/server';
import 'reflect-metadata';
import { seedData } from '../db/seed';
import apolloServer from '../graphql';
import { loggerMiddleWare } from '../logger/middleware';
import { checkLogin, handleLogin } from './auth';

/* Setup express */
const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use(cookieParser());

/* Set up logging requests */
app.use(loggerMiddleWare);

/* Auth routes */
app.post('/login', handleLogin);
app.get('/logged_in', checkLogin);

/* Setup graphql server */
apolloServer.applyMiddleware({app});

app.get('/moi', (req, res) => {
  res.send('moi');
});

export default app;