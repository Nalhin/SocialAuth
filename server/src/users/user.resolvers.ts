import {userTypeDefs as User} from "./user.typeDefs";


export const userResolvers = {
  Query: {
    me: User,
  },
  User: {}
};
