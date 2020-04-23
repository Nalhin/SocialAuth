import { Factory } from 'factory.io';
import { User } from '../../src/user/user.entity';
import { AuthUser } from '../../src/auth/types/auth-user';
import * as faker from 'faker';
import { UserRegisterInput } from '../../src/auth/input/user-register.input';
import { UserLoginInput } from '../../src/auth/input/user-login.input';

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
  .mixins(userLoginInputFactory)
  .done();

export const authUserFactory = new Factory(AuthUser)
  .props({ token: faker.random.uuid })
  .mixins(userRegisterInputFactory)
  .done();

export const userFactory = new Factory(User)
  .options({ idField: 'id' })
  .mixins(userRegisterInputFactory)
  .props({
    followedTags: [],
    upvotedPosts: [],
  })
  .done();
