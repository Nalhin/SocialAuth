import { gql } from 'apollo-server-express';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { GraphqlConfigService } from '../../../src/config/graphql.config';
import { GraphqlTestConfigService } from '../../config/graphql.config';
import { TypeOrmConfigService } from '../../../src/config/typeorm.config';
import { TypeOrmTestConfigService } from '../../config/typeorm.config';
import { TypeOrmTestUtils } from '../../utils/typeorm-test.utils';
import {
  loginUserInputFactory,
  registerUserInputFactory,
  userFactory,
} from '../../factories/user.factory';
import { GQL } from '../constants';
import { AuthUserResponse } from '../../../src/auth/responses/auth-user.response';
import { InvalidCredentialsError } from '../../../src/auth/responses/invalid-credentials.error';
import { InvalidInputError } from '../../../src/graphql/responses/invalid-input.error';
import { CredentialsTakenError } from '../../../src/auth/responses/credentials-taken.error';
import {
  loginSocialInputFactory,
  registerSocialInputFactory,
  socialProfileFactory,
  socialProviderFactory,
} from '../../factories/auth.factory';
import { SocialNotRegisteredError } from '../../../src/auth/responses/social-not-registered.error';
import { SocialProviderTypes } from '../../../src/auth/auth.entity';
import { Profile } from 'passport';
import { SocialAlreadyAssignedError } from '../../../src/auth/responses/social-already-assigned.error';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let testUtils: TypeOrmTestUtils;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmTestUtils],
    })
      .overrideProvider(GraphqlConfigService)
      .useClass(GraphqlTestConfigService)
      .overrideProvider(TypeOrmConfigService)
      .useClass(TypeOrmTestConfigService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    testUtils = app.get(TypeOrmTestUtils);
    await testUtils.startServer();
  });

  afterEach(async () => {
    await testUtils.closeServer();
  });

  describe('login mutation', () => {
    const query = gql`
      mutation login($input: LoginUserInput!) {
        login(input: $input) {
          __typename
          ... on ErrorResponse {
            message
          }
          ... on AuthUserResponse {
            user {
              username
              id
              email
            }
            token
          }
          ... on InvalidCredentialsError {
            providedUsername
            message
          }
        }
      }
    `.loc?.source.body;

    it('should login user with correct credentials', async () => {
      const userLoginInput = loginUserInputFactory.buildOne();
      const user = await userFactory.buildOneAsync(
        testUtils.saveOne,
        userLoginInput,
      );

      const gqlReq = {
        query,
        variables: {
          input: userLoginInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.login;
      expect(response.__typename).toBe(AuthUserResponse.name);
      expect(response.user.username).toBe(user.username);
      expect(response.token).toBeTruthy();
    });

    it('should reject if password is invalid', async () => {
      const userLoginInput = loginUserInputFactory.buildOne();
      await userFactory.buildOneAsync(testUtils.saveOne, {
        ...userLoginInput,
        password: 'invalid',
      });

      const gqlReq = {
        query,
        variables: {
          input: userLoginInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.login;
      expect(response.__typename).toBe(InvalidCredentialsError.name);
      expect(response.providedUsername).toBe(userLoginInput.username);
    });
  });

  describe('register mutation', () => {
    const query = gql`
      mutation register($input: RegisterUserInput!) {
        register(input: $input) {
          __typename
          ... on ErrorResponse {
            message
          }
          ... on AuthUserResponse {
            user {
              username
              id
              email
            }
            token
          }
          ... on CredentialsTakenError {
            providedEmail
            providedUsername
          }
          ... on InvalidInputError {
            errors {
              field
              messages
            }
          }
        }
      }
    `.loc?.source.body;

    it('should create user, and then return user Data', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();

      const gqlReq = {
        query,
        variables: {
          input: registerUserInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.register;
      expect(response.__typename).toBe(AuthUserResponse.name);
      expect(response.user.username).toBe(registerUserInput.username);
      expect(response.token).toBeTruthy();
    });

    it('should return inputs errors if inputs is invalid', async () => {
      const registerUserInput = registerUserInputFactory.buildOne({
        email: 'invalid',
        password: 'short',
      });

      const gqlReq = {
        query,
        variables: {
          input: registerUserInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.register;
      expect(response.__typename).toBe(InvalidInputError.name);
      expect(response.errors.length).toBe(2);
    });

    it('should not allow to register if similar user exists', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();
      await userFactory.buildOneAsync(testUtils.saveOne, registerUserInput);

      const gqlReq = {
        query,
        variables: {
          input: registerUserInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.register;
      expect(response.__typename).toBe(CredentialsTakenError.name);
      expect(response.providedUsername).toBe(registerUserInput.username);
    });
  });

  describe.each(Object.values(SocialProviderTypes))(
    `SocialAuth %s`,
    (provider: SocialProviderTypes) => {
      let socialProfile: Profile;
      const providerEnum = provider.toUpperCase();

      beforeEach(async () => {
        socialProfile = socialProfileFactory.buildOne({ provider });
        const strategyImport = await require(`../../../src/auth/strategy/${provider}.strategy`);
        const Strategy = await app.get(Object.keys(strategyImport)[0]);
        jest
          .spyOn(Strategy, 'userProfile')
          .mockImplementation((token: any, func: any) => {
            return func(null, socialProfile);
          });
      });

      describe(`loginSocial ${provider}`, () => {
        const query = gql`
          mutation loginSocial($input: LoginSocialInput!) {
            loginSocial(input: $input) {
              __typename
              ... on ErrorResponse {
                message
              }
              ... on AuthUserResponse {
                user {
                  username
                  id
                  email
                }
                token
              }
              ... on SocialNotRegisteredError {
                provider
              }
            }
          }
        `.loc?.source.body;

        const loginSocialInput = loginSocialInputFactory.buildOne({
          provider,
        });

        const gqlReq = {
          query,
          variables: {
            input: {
              ...loginSocialInput,
              provider: providerEnum,
            },
          },
        };

        it(`should login ${provider} social account correctly`, async () => {
          const user = await userFactory.buildOneAsync(testUtils.saveOne);
          await socialProviderFactory.buildOneAsync(testUtils.saveOne, {
            ...loginSocialInput,
            socialId: socialProfile.id,
            user,
          });

          const result = await request(app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.loginSocial;

          expect(response.__typename).toBe(AuthUserResponse.name);
          expect(response.user.username).toBe(user.username);
          expect(response.token).toBeTruthy();
        });

        it(`should return errors if ${provider} social account is not registered`, async () => {
          const result = await request(app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.loginSocial;
          expect(response.__typename).toBe(SocialNotRegisteredError.name);
          expect(response.provider).toBe(providerEnum);
        });

        it(`should return errors, if ${provider} authentication is not successful`, async () => {
          socialProfile = null as any;
          const result = await request(app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const response = result.body.errors;

          expect(response.length).toBe(1);
        });
      });

      describe(`registerSocial ${provider}`, () => {
        const query = gql`
          mutation registerSocial($input: RegisterSocialInput!) {
            registerSocial(input: $input) {
              __typename
              ... on ErrorResponse {
                message
              }
              ... on AuthUserResponse {
                user {
                  username
                  id
                  email
                }
                token
              }
              ... on CredentialsTakenError{
                providedEmail
                providedUsername
              }
              ... on SocialAlreadyAssignedError {
                provider
              }
            }
          }
        `.loc?.source.body;

        const registerSocialInput = registerSocialInputFactory.buildOne({
          provider,
        });

        const gqlReq = {
          query,
          variables: {
            input: {
              ...registerSocialInput,
              provider: providerEnum,
            },
          },
        };

        it(`should register ${provider} social account correctly`, async () => {
          const result = await request(app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.registerSocial;

          expect(response.__typename).toBe(AuthUserResponse.name);
          expect(response.user.username).toBe(registerSocialInput.username);
          expect(response.token).toBeTruthy();
        });

        it(`should return error if ${provider} account is already assigned`, async () => {
          await socialProviderFactory.buildOneAsync(testUtils.saveOne, {
            socialId: socialProfile.id,
          });

          const result = await request(app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.registerSocial;

          expect(response.__typename).toBe(SocialAlreadyAssignedError.name);
          expect(response.provider).toBe(providerEnum);
        });

        it(`should return error if ${provider} credentials are already taken`, async () => {
          await userFactory.buildOneAsync(testUtils.saveOne, {
            username: registerSocialInput.username,
          });

          const result = await request(app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.registerSocial;

          expect(response.__typename).toBe(CredentialsTakenError.name);
          expect(response.providedUsername).toBe(registerSocialInput.username);
        });

        it(`should return errors, if ${provider} authentication is not successful`, async () => {
          socialProfile = null as any;
          const result = await request(app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const response = result.body.errors;

          expect(response.length).toBe(1);
        });
      });
    },
  );

  afterAll(async () => {
    await app.close();
  });
});
