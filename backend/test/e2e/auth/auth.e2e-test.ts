import { gql } from 'apollo-server-express';
import * as request from 'supertest';
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
import { E2EApp, initializeApp } from '../utils/initialize-app';

describe('AuthModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
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
      const user = await e2e.dbTestUtils.saveOne(
        userFactory.buildOne(userLoginInput),
      );

      const gqlReq = {
        query,
        variables: {
          input: userLoginInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
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
      await e2e.dbTestUtils.saveOne(
        userFactory.buildOne({
          ...userLoginInput,
          password: 'invalid',
        }),
      );

      const gqlReq = {
        query,
        variables: {
          input: userLoginInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
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

      const result = await request(e2e.app.getHttpServer())
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

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.register;
      expect(response.__typename).toBe(InvalidInputError.name);
      expect(response.errors.length).toBe(2);
    });

    it('should not allow to register if similar user exists', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();
      await e2e.dbTestUtils.saveOne(userFactory.buildOne(registerUserInput));

      const gqlReq = {
        query,
        variables: {
          input: registerUserInput,
        },
      };

      const result = await request(e2e.app.getHttpServer())
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
        const Strategy = await e2e.app.get(Object.keys(strategyImport)[0]);
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
          const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
          await e2e.dbTestUtils.saveOne(
            socialProviderFactory.buildOne({
              ...loginSocialInput,
              socialId: socialProfile.id,
              user,
            }),
          );

          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.loginSocial;

          expect(response.__typename).toBe(AuthUserResponse.name);
          expect(response.user.username).toBe(user.username);
          expect(response.token).toBeTruthy();
        });

        it(`should return errors if ${provider} social account is not registered`, async () => {
          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.loginSocial;
          expect(response.__typename).toBe(SocialNotRegisteredError.name);
          expect(response.provider).toBe(providerEnum);
        });

        it(`should return errors, if ${provider} authentication is not successful`, async () => {
          socialProfile = null as any;
          const result = await request(e2e.app.getHttpServer())
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
              ... on CredentialsTakenError {
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
          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.registerSocial;

          expect(response.__typename).toBe(AuthUserResponse.name);
          expect(response.user.username).toBe(registerSocialInput.username);
          expect(response.token).toBeTruthy();
        });

        it(`should return error if ${provider} account is already assigned`, async () => {
          await e2e.dbTestUtils.saveOne(
            socialProviderFactory.buildOne({
              socialId: socialProfile.id,
            }),
          );

          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.registerSocial;

          expect(response.__typename).toBe(SocialAlreadyAssignedError.name);
          expect(response.provider).toBe(providerEnum);
        });

        it(`should return error if ${provider} credentials are already taken`, async () => {
          await e2e.dbTestUtils.saveOne(
            userFactory.buildOne({
              username: registerSocialInput.username,
            }),
          );

          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const [response] = result.body.data.registerSocial;

          expect(response.__typename).toBe(CredentialsTakenError.name);
          expect(response.providedUsername).toBe(registerSocialInput.username);
        });

        it(`should return errors, if ${provider} authentication is not successful`, async () => {
          socialProfile = null as any;
          const result = await request(e2e.app.getHttpServer())
            .post(GQL)
            .send(gqlReq)
            .expect(200);

          const response = result.body.errors;

          expect(response.length).toBe(1);
        });
      });
    },
  );
});
