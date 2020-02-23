import { gql } from "apollo-server-express";

export const userTypeDefs=gql`
  type User {
    id:ID!
    name:String
    login:String!
  }
`;







