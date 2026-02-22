const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    login(username: String!, password: String!): AuthPayload
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
  }
`;

module.exports = userTypeDefs;