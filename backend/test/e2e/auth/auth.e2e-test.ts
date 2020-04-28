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
  loginUserInputBuilder,
  registerUserInputBuilder,
  userFactory,
} from '../../factories/user.factory';
import { GQL } from '../constants';
import { AuthUserResponse } from '../../../src/auth/responses/auth-user.response';
import { InvalidCredentialsResponse } from '../../../src/auth/responses/invalid-credentials.response';
import { InvalidInputResponse } from '../../../src/graphql/response/invalid-input.response';
import { CredentialsTakenResponse } from '../../../src/auth/responses/credentials-taken.response';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let testUtils: TypeOrmTestUtils;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GraphqlConfigService)
      .useClass(GraphqlTestConfigService)
      .overrideProvider(TypeOrmConfigService)
      .useClass(TypeOrmTestConfigService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    testUtils = new TypeOrmTestUtils();
    await testUtils.startServer();
  });

  afterEach(async () => {
    await testUtils.closeServer();
  });

  describe('login mutation', () => {
    const query = gql`
      mutation login($userInput: LoginUserInput!) {
        login(loginUserInput: $userInput) {
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
          ... on InvalidCredentialsResponse {
            providedUsername
            message
          }
        }
      }
    `.loc.source.body;

    it('should login user with correct credentials', async () => {
      const userLoginInput = loginUserInputBuilder.buildOne();
      const user = await userFactory.buildOneAsync(
        testUtils.saveOne,
        userLoginInput,
      );

      const gqlReq = {
        query,
        variables: {
          userInput: userLoginInput,
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
      const userLoginInput = loginUserInputBuilder.buildOne();
      await userFactory.buildOneAsync(testUtils.saveOne, {
        ...userLoginInput,
        password: 'invalid',
      });

      const gqlReq = {
        query,
        variables: {
          userInput: userLoginInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.login;
      expect(response.__typename).toBe(InvalidCredentialsResponse.name);
      expect(response.providedUsername).toBe(userLoginInput.username);
    });
  });

  describe('register mutation', () => {
    const query = gql`
      mutation register($userInput: RegisterUserInput!) {
        register(registerUserInput: $userInput) {
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
          ... on CredentialsTakenResponse {
            providedEmail
            providedUsername
          }
          ... on InvalidInputResponse {
            errors {
              field
              messages
            }
          }
        }
      }
    `.loc.source.body;

    it('should create user, and then return user Data', async () => {
      const registerUserInput = registerUserInputBuilder.buildOne();

      const gqlReq = {
        query,
        variables: {
          userInput: registerUserInput,
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
      const registerUserInput = registerUserInputBuilder.buildOne({
        email: 'invalid',
        password: 'short',
      });

      const gqlReq = {
        query,
        variables: {
          userInput: registerUserInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.register;
      expect(response.__typename).toBe(InvalidInputResponse.name);
      expect(response.errors.length).toBe(2);
    });

    it('should not allow to register if similar user exists', async () => {
      const registerUserInput = registerUserInputBuilder.buildOne();
      await userFactory.buildOneAsync(testUtils.saveOne, registerUserInput);

      const gqlReq = {
        query,
        variables: {
          userInput: registerUserInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      const [response] = result.body.data.register;
      expect(response.__typename).toBe(CredentialsTakenResponse.name);
      expect(response.providedUsername).toBe(registerUserInput.username);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
