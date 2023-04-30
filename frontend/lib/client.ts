import { GraphQLClient } from "graphql-request";

export const gqlClient = new GraphQLClient(
  'http://localhost:4000/graphql',
  { fetch }
);