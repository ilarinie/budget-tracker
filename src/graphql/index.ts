import { ApolloServer, AuthenticationError, gql } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import logger from '../logger';
import { addCategory, addPurchase, removeCategory, removePurchase, updateCategory, updatePurchase } from './mutations';
import { user } from './queries';
import { typeDefs } from './types';

export const resolvers = {
  Query: {
    user
  },
  Mutation: {
    addCategory,
    addPurchase,
    updateCategory,
    updatePurchase,
    removePurchase,
    removeCategory
  }
};

export const context =  async ({ req }) => {
  const user = extractJWT(req.headers) as User;
  if (user) {
    logger.log('info', `Authorized user: ${user.username}`);
    return { user };
  }
  throw new AuthenticationError('auth failed');
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

const extractJWT = (headers: any) =>  {
  try {
    const token = headers.authorization.slice(7, headers.authorization.length);
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (e) {
    logger.log('error', `Authorization failed ${e}`);
    return null;
  }
};

export default apolloServer;