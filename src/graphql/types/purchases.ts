import { gql } from 'apollo-server-core';

export const Purchases = gql`
  type Purchase {
    id: ID!
    user: User
    description: String
    amount: Float
    categories: [PurchaseCategory]
    created_at: String
    updated_at: String
  }

  type PurchaseResponse {
    success: Boolean
    purchase: Purchase
    errors: PurchaseErrors
  }

  type PurchaseErrors {
    description: String
    amount: String
  }
`;