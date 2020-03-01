import {
  mockUserFactory,
  mockUserLoginInputFactory,
  mockUserRegisterInputFactory,
} from '../../fixtures/user/user.fixture';
import { gql } from 'apollo-server-express';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../../src/user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlTestConfig } from '../graphql.test-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule } from '../../../src/auth/auth.module';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GraphQLModule.forRoot(graphqlTestConfig), AuthModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useClass(Repository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('register Mutation', () => {
    it('should create user, and then return user Data', async () => {
      const mockRegisterInput = mockUserRegisterInputFactory();
      const mockUser = mockUserFactory(mockRegisterInput);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockUser);

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
          userInput: mockRegisterInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(query)
        .expect(200);

      expect(result.body.data.register.username).toBe(mockUser.username);
      expect(result.body.data.register.token).toBeTruthy();
    });
  });

  describe('login Mutation', () => {
    it('should validate login request', async () => {
      const mockLoginInput = mockUserLoginInputFactory();
      const mockUser = mockUserFactory(mockLoginInput);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);

      const query = {
        query: gql`
          mutation register($userInput: UserLoginInput!) {
            login(userLoginInput: $userInput) {
              username
              id
              email
              token
            }
          }
        `.loc.source.body,
        variables: {
          userInput: mockLoginInput,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(query)
        .expect(200);

      expect(result.body.data.login.username).toBe(mockUser.username);
      expect(result.body.data.login.token).toBeTruthy();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
