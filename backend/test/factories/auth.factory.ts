import { User } from '../../src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../src/config/jwt.config';
import { Factory } from 'factory.io';
import { Profile } from 'passport';
import * as faker from 'faker';
import {
  SocialProvider,
  SocialProviderTypes,
} from '../../src/auth/auth.entity';
import { LoginSocialInput } from '../../src/auth/inputs/login-social.input';
import { RegisterSocialInput } from '../../src/auth/inputs/register-social.input';

const jwtService = new JwtService(jwtConfig());

export function tokenFactory(user: Partial<User>) {
  return jwtService.sign({ ...user });
}

export function authHeaderFactory(user: Partial<User>) {
  const token = tokenFactory(user);
  return `Bearer ${token}`;
}

export const loginSocialInputFactory = new Factory(LoginSocialInput)
  .props({
    accessToken: faker.random.uuid,
    provider: faker.random.arrayElement(Object.values(SocialProviderTypes)),
  })
  .done();

export const registerSocialInputFactory = new Factory(RegisterSocialInput)
  .mixins([loginSocialInputFactory])
  .props({ username: faker.internet.userName })
  .done();

const emailFactory = new Factory<Email>()
  .props({ value: faker.internet.email })
  .done();

export const socialProfileFactory = new Factory<Profile>()
  .props({
    provider: faker.random.arrayElement(Object.values(SocialProviderTypes)),
    id: faker.random.uuid,
    displayName: faker.internet.userName,
    emails: emailFactory.buildMany(2),
  })
  .done();

interface Email {
  value: string;
}

export const socialProviderFactory = new Factory(SocialProvider)
  .props({
    provider: faker.random.arrayElement(Object.values(SocialProviderTypes)),
    socialId: faker.random.uuid,
    created: faker.date.future,
  })
  .done();
