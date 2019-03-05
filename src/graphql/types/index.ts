import { gql } from 'apollo-server-core';
import { Purchases } from './purchases';

const types = gql`
  type PurchaseCategory {
      id: ID!
      user: User
      name: String
    }



  type User {
    id: ID!
    usernamse: String
    displayName: String
    purchases: [Purchase]
    monthlyPurchases: [Purchase]
    monthlyTotal: Float
    monthlyExpendableIncome: Float
    monthlyIncome: Float
    monthlyRemaining: Float
    categories: [PurchaseCategory]
    total: Float
  }

  type Response {
    success: Boolean
  }

  type Query {
    user: User
  }

  type Mutation {
    login(username: String!, password: String!): String,
    addCategory(name: String!): PurchaseCategory,
    addPurchase(description: String!, amount: Float!, categories: [String]): Purchase,
    updateCategory(name: String): PurchaseCategory,
    updatePurchase(amount: Float, description: String, categories: [String]): Purchase,
    removePurchase(id: ID!): Response,
    removeCategory(id: ID!): Response,
  }

`;

export class Response {

  constructor (success: boolean) {
    this.success = success;
  }

  success: boolean;
}

export const typeDefs = [ types, Purchases ];
