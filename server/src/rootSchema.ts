import { makeExecutableSchema } from 'graphql-tools';
import {userTypeDefs} from "./users/user.typeDefs";
import {userResolvers} from "./users/user.resolvers";

const typeDefs = [
  userTypeDefs,
];

const resolvers = [
  userResolvers,
];

export const rootSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
