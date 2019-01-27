import { ApolloServer, AuthenticationError, gql } from 'apollo-server-express';
import { IResolvers } from 'graphql-tools';
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';
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

export const context =  async ({ req }) => {
  const currentUser = extractJWT(req.headers) as User;
  if (currentUser) {
    logger.log('info', `Authorized user: ${currentUser.username}`);
    return { currentUser };
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