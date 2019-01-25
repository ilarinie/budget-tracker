import { gql } from 'apollo-server-core';

export const typeDefs = gql`
  type PurchaseCategory {
      id: ID!
      user: User
      name: String
    }

  type Purchase {
    id: ID!
    user: User
    description: String
    amount: Float
    categories: [PurchaseCategory]
    created_at: String
    updated_at: String
  }

  type User {
    id: ID!
    username: String
    displayName: String
    purchases: [Purchase]
    categories: [PurchaseCategory]
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