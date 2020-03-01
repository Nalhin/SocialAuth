import {
  mockUserFactory,
  mockUserLoginInputFactory,
  mockUserRegisterInputFactory,
} from '../../fixtures/user/user.fixture';
import { gql } from 'apollo-server-express';
import { INestApplication } from '@nestjs/common';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { Repository } from 'typeorm';
import { User } from '../../../src/user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlTestConfig } from '../graphql.test-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule } from '../../../src/auth/auth.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;
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
    const module: GraphQLModule = moduleFixture.get<GraphQLModule>(
      GraphQLModule,
    );
    apolloClient = createTestClient((module as any).apolloServer);
  });

  describe('register Mutation', () => {
    it('should create user, and then return user Data', async () => {
      const { mutate } = apolloClient;
      const mockRegisterInput = mockUserRegisterInputFactory();
      const mockUser = mockUserFactory(mockRegisterInput);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockUser);

      const result = await mutate({
        mutation: gql`
          mutation register($userInput: UserRegisterInput!) {
            register(userRegisterInput: $userInput) {
              username
              id
              email
              token
            }
          }
        `,
        variables: {
          userInput: mockRegisterInput,
        },
      });

      expect(result.data.register.username).toBe(mockUser.username);
      expect(result.data.register.token).toBeTruthy();
    });
  });

  describe('login Mutation', () => {
    it('should validate login request', async () => {
      const { mutate } = apolloClient;
      const mockLoginInput = mockUserLoginInputFactory();
      const mockUser = mockUserFactory(mockLoginInput);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await mutate({
        mutation: gql`
          mutation register($userInput: UserLoginInput!) {
            login(userLoginInput: $userInput) {
              username
              id
              email
              token
            }
          }
        `,
        variables: {
          userInput: mockLoginInput,
        },
      });

      expect(result.data.login.username).toBe(mockUser.username);
      expect(result.data.login.token).toBeTruthy();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
