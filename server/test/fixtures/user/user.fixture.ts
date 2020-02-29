import * as faker from 'faker';
import { User } from '../../../src/user/user.entity';
import { UserLoginInput, UserRegisterInput } from '../../../src/graphql';

export function mockUserFactory(user?: User | any): User {
  return {
    id: faker.random.number(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    ...user,
  };
}

export function mockUserLoginInputFactory(
  userInput?: UserLoginInput | any,
): UserLoginInput {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...userInput,
  };
}

export function mockUserRegisterInputFactory(
  userInput?: UserRegisterInput | any,
): UserRegisterInput {
  return {
    ...mockUserLoginInputFactory(),
    email: faker.internet.email(),
    ...userInput,
  };
}
