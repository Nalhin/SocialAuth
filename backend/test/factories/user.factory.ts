import { Factory } from 'factory.io';
import { User } from '../../src/user/user.entity';
import * as faker from 'faker';
import { LoginUserInput } from '../../src/auth/inputs/login-user.input';
import { RegisterUserInput } from '../../src/auth/inputs/register-user.input';
import { AuthUserResponse } from '../../src/auth/responses/auth-user.response';

export const loginUserInputBuilder = new Factory(LoginUserInput)
  .props({
    username: faker.internet.userName,
    password: faker.internet.password,
  })
  .done();

export const registerUserInputBuilder = new Factory(RegisterUserInput)
  .props({
    email: faker.internet.email,
  })
  .mixins([loginUserInputBuilder])
  .done();

export const userFactory = new Factory(User)
  .options({ idField: 'id' })
  .mixins([registerUserInputBuilder])
  .done();

export const authUserFactory = new Factory(AuthUserResponse)
  .props({ token: faker.random.uuid, user: () => userFactory.buildOne() })
  .done();
