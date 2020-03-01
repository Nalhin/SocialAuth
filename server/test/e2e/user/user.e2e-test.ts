import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { mockUserFactory } from '../../fixtures/user/user.fixture';
import { UserModule } from '../../../src/user/user.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/user/user.entity';
import { Repository } from 'typeorm';
import { graphqlTestConfig } from '../graphql.test-config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GraphQLModule.forRoot(graphqlTestConfig), UserModule],
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

  describe('removeUser Mutation', () => {
    it('should remove user, and return removed user', async () => {
      const { mutate } = apolloClient;
      const mockUser = mockUserFactory();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(mockUser);

      const result = await mutate({
        mutation: gql`
          mutation removeUser($id: ID!) {
            removeUser(id: $id) {
              username
              id
              email
            }
          }
        `,
        variables: {
          id: mockUser.id,
        },
      });

      expect(result.data.removeUser.username).toBe(mockUser.username);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
