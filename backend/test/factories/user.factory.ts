import { Factory } from 'factory.io';
import { User } from '../../src/user/user.entity';
import * as faker from 'faker';
import { UserRegisterInput } from '../../src/auth/input/user-register.input';
import { UserLoginInput } from '../../src/auth/input/user-login.input';
import { AuthUserResponse } from '../../src/auth/response/auth-user.response';

export const userLoginInputFactory = new Factory(UserLoginInput)
  .props({
    username: faker.internet.userName,
    password: faker.internet.password,
  })
  .done();

export const userRegisterInputFactory = new Factory(UserRegisterInput)
  .props({
    email: faker.internet.email,
  })
  .mixins([userLoginInputFactory])
  .done();

export const userFactory = new Factory(User)
  .options({ idField: 'id' })
  .mixins([userRegisterInputFactory])
  .done();

export const authUserFactory = new Factory(AuthUserResponse)
  .props({ token: faker.random.uuid, user: () => userFactory.buildOne() })
  .done();
