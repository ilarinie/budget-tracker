import { gql } from 'apollo-server-core';

/**
 * Gets user: username, id; purchases: amount, description; categories: name
 */
export const GET_USER = gql`
  {
    user {
      username
      id
      purchases {
        amount
        description
      }
      categories {
        name
      }
    }
  }
`;

/**
 * Adds a purchase, amount: 21, description: "desc"
 */
export const ADD_PURCHASE = gql`
  mutation  {
    addPurchase(amount: 21, description: "desc") {
      id
      amount
      description
      user {
        id
      }
    }
  }
`;

/**
 * Adds a category with the name "cat1"
 */
export const ADD_CATEGORY = gql`
  mutation {
    addCategory(name: "cat1") {
      id
      name
    }
  }
`;