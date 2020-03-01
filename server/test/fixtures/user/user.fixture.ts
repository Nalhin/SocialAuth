import * as faker from 'faker';
import { User } from '../../../src/user/user.entity';
import { UserRegisterInput } from '../../../src/auth/input/user-register.input';
import { UserLoginInput } from '../../../src/auth/input/user-login.input';
import { AuthUser } from '../../../src/auth/types/auth-user';

export function mockAuthUserFactory(user?: Partial<AuthUser>): AuthUser {
  return {
    token: faker.random.uuid(),
    ...mockUserFactory(user),
  };
}

export function mockUserFactory(user?: Partial<User>): User {
  return {
    id: faker.random.number(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    ...user,
  };
}

export function mockUserLoginInputFactory(
  userInput?: Partial<UserLoginInput>,
): UserLoginInput {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...userInput,
  };
}

export function mockUserRegisterInputFactory(
  userInput?: Partial<UserRegisterInput>,
): UserRegisterInput {
  return {
    ...mockUserLoginInputFactory(),
    email: faker.internet.email(),
    ...userInput,
  };
}
