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
        id
        amount
        description
        categories {
          name
        }
      }
      categories {
        id
        name
      }
    }
  }
`;

/**
 * Adds a purchase, amount: 21, description: "desc"
 */
export const ADD_PURCHASE = gql`
  mutation AddPurchase($amount: Float!, $description: String!, $categories: [String]) {
    addPurchase(amount: $amount, description: $description, categories: $categories) {
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
  mutation AddCategory($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;

export const REMOVE_PURCHASE = gql`
  mutation RemovePurchase($id: ID!) {
    removePurchase(id: $id) {
      success
    }
  }
`;

export const REMOVE_CATEGORY = gql`
  mutation RemoveCategory($id: ID!) {
    removeCategory(id: $id) {
      success
    }
  }
`;