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
import { userFactory, userLoginInputFactory, userRegisterInputFactory } from '../../factories/user.factory';

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

  describe('register mutation', () => {
    it('should create user, and then return user Data', async () => {
      const userRegisterInput = userRegisterInputFactory.buildOne();

      const query = {
        query: gql`
          mutation register($userInput: UserRegisterInput!) {
            register(userRegisterInput: $userInput) {
              username
              id
              email
              token
            }
          }
        `.loc.source.body,
        variables: {
          userInput: userRegisterInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(query)
        .expect(200);

      expect(result.body.data.register.username).toBe(
        userRegisterInput.username,
      );
      expect(result.body.data.register.token).toBeTruthy();
    });
  });

  describe('login mutation', () => {
    it('should validate login request', async () => {
      const userLoginInput = userLoginInputFactory.buildOne();
      const user = await userFactory.buildOneAsync(testUtils.saveOne, userLoginInput);

      const query = {
        query: gql`
          mutation login($userInput: UserLoginInput!) {
            login(userLoginInput: $userInput) {
              username
              id
              email
              token
            }
          }
        `.loc.source.body,
        variables: {
          userInput: userLoginInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(query)
        .expect(200);

      expect(result.body.data.login.username).toBe(user.username);
      expect(result.body.data.login.token).toBeTruthy();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
