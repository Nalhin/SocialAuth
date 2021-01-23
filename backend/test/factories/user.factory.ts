import { User } from '../../src/user/user.entity';
import * as faker from 'faker';
import { LoginUserInput } from '../../src/auth/inputs/login-user.input';
import { RegisterUserInput } from '../../src/auth/inputs/register-user.input';
import { FactoryBuilder } from 'factory.io';

export const loginUserInputFactory = FactoryBuilder.of(LoginUserInput)
  .props({
    username: faker.internet.userName,
    password: faker.internet.password,
  })
  .build();

export const registerUserInputFactory = FactoryBuilder.of(RegisterUserInput)
  .props({
    email: faker.internet.email,
  })
  .mixins([loginUserInputFactory])
  .build();

export const userFactory = FactoryBuilder.of(User)
  .options({ sequenceField: 'id' })
  .mixins([registerUserInputFactory])
  .build();
