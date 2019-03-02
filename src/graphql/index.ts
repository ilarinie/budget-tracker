import { ApolloServer, AuthenticationError, gql } from 'apollo-server-express';
import { Request } from 'express';
import { IResolvers } from 'graphql-tools';
import jwt from 'jsonwebtoken';
import { UserAccount } from '../entity/UserAccount';
import logger from '../logger';
import { addCategory, addPurchase, removeCategory, removePurchase, updateCategory, updatePurchase } from './mutations';
import { user } from './queries';
import { typeDefs } from './types';

// @ts-ignore
export const resolvers: IResolvers = {
  Query: {
    user
  },
  // TS ignore here to allow for parameter destructuring on resolvers
  // @ts-ignore
  Mutation: {
    addCategory,
    addPurchase,
    updateCategory,
    updatePurchase,
    removePurchase,
    removeCategory
  }
};

export const context =  async ({ req, res }) => {
  const currentUser = await extractJWT(req.headers) as UserAccount;
  if (currentUser) {
    logger.log('info', `Authorized user: ${currentUser.username}`);
    return { currentUser };
  } else {
    res.redirect('/login');
  }
  throw new AuthenticationError('auth failed');
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  tracing: true,
  introspection: true,
  playground: true
});

const checkCookieAuth = (req: Request) => {
  const { token } = req.cookies;
  if (!token) {
    return extractJWT(req.headers);
  }

  return getUserFromToken(token);
};

const extractJWT = async (headers: any) =>  {
  try {
    const token = headers.authorization.slice(7, headers.authorization.length);
    return await getUserFromToken(token);
  } catch (e) {
    logger.log('error', `Authorization failed ${e}`);
    return null;
  }
};

const getUserFromToken = async (token: string) => {
  try {
    return await jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (e) {
    logger.log('error', `Authorization failed ${e}`);
    return null;
  }
};

export default apolloServer;