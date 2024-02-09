import { gql } from "@apollo/client";

export const GET_ITEMS = gql`
  query GetItems {
    statuses {
      color
      status
      items {
        id
        title
        status
        content
        date
      }
    }
  }
`;
