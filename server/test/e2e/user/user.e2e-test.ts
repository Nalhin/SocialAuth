import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { GraphQLConfig } from '../../../src/gqlConfig';
import {
  mockUserFactory,
  mockUserRegisterInputFactory,
} from '../../fixtures/user/user.fixture';
import { UserModule } from '../../../src/user/user.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/user/user.entity';
import { Repository } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GraphQLModule.forRoot(GraphQLConfig), UserModule],
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

  describe('users Query', () => {
    it('should return users', async () => {
      const { query } = apolloClient;
      const mockedValue = [mockUserFactory(), mockUserFactory()];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(mockedValue);

      const result = await query({
        query: gql`
          query {
            users {
              username
              id
              email
            }
          }
        `,
      });

      expect(result.data.users.length).toBe(2);
    });
  });

  describe('user Query', () => {
    it('should return user with given username', async () => {
      const { query } = apolloClient;
      const mockUser = mockUserFactory();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await query({
        query: gql`
          query user($username: String!) {
            user(username: $username) {
              username
              id
              email
            }
          }
        `,
        variables: {
          username: mockUser.username,
        },
      });

      expect(result.data.user.username).toBe(mockUser.username);
    });
  });

  describe('createUser Mutation', () => {
    it('should create user, and then return', async () => {
      const { mutate } = apolloClient;
      const mockRegisterInput = mockUserRegisterInputFactory();
      const mockUser = mockUserFactory(mockRegisterInput);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockUser);

      const result = await mutate({
        mutation: gql`
          mutation createUser($user: UserRegisterInput!) {
            createUser(input: $user) {
              username
              id
              email
            }
          }
        `,
        variables: {
          user: mockRegisterInput,
        },
      });

      expect(result.data.createUser.username).toBe(mockUser.username);
    });
  });

  describe('removeUser Mutation', () => {
    it('should remove user, and return removed user', async () => {
      const { mutate } = apolloClient;
      const mockUser = mockUserFactory();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(mockUser);

      const result = await mutate({
        mutation: gql`
          mutation removeUser($username: String!) {
            removeUser(username: $username) {
              username
              id
              email
            }
          }
        `,
        variables: {
          username: mockUser.username,
        },
      });

      expect(result.data.removeUser.username).toBe(mockUser.username);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
