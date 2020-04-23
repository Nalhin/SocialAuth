import { gql } from 'apollo-server-express';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../../src/user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { GraphqlConfigService } from '../../../src/config/graphql.config';
import { GraphqlTestConfigService } from '../../config/graphql.config';
import { TypeOrmConfigService } from '../../../src/config/typeorm.config';
import { TypeOrmTestConfigService } from '../../config/typeorm.config';
import { TestUtils } from '../../utils/database.utils';
import { userFactory, userLoginInputFactory, userRegisterInputFactory } from '../../factories/user.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;
  let testUtils: TestUtils;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestUtils],
    })
      .overrideProvider(GraphqlConfigService)
      .useClass(GraphqlTestConfigService)
      .overrideProvider(TypeOrmConfigService)
      .useClass(TypeOrmTestConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    testUtils = moduleFixture.get<TestUtils>(TestUtils);
  });

  describe('register Mutation', () => {
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

      expect(result.body.data.register.username).toBe(userRegisterInput.username);
      expect(result.body.data.register.token).toBeTruthy();
    });
  });

  describe('login Mutation', () => {
    it('should validate login request', async () => {
      const userLoginInput = userLoginInputFactory.buildOne();
      const user = await userFactory.buildOne(userLoginInput);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

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
