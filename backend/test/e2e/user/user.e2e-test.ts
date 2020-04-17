import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { mockUserFactory } from '../../fixtures/user/user.fixture';
import { UserModule } from '../../../src/user/user.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/user/user.entity';
import { Repository } from 'typeorm';
import { graphqlTestConfig } from '../graphql.test-config';
import * as request from 'supertest';
import { gql } from 'apollo-server-express';
import { JwtService } from '@nestjs/jwt';
import { jwtOptions } from '../../../src/auth/jwt.constants';
import { JwtStrategy } from '../../../src/auth/jwt.strategy';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GraphQLModule.forRoot(graphqlTestConfig), UserModule],
      providers: [JwtStrategy],
    })
      .overrideProvider(getRepositoryToken(User))
      .useClass(Repository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('users Query', () => {
    it('should return users', async () => {
      const mockedValue = [mockUserFactory(), mockUserFactory()];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(mockedValue);

      const query = {
        query: gql`
          query {
            users {
              username
              id
              email
            }
          }
        `.loc.source.body,
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(query)
        .expect(200);

      expect(result.body.data.users.length).toBe(2);
    });
  });

  describe('user Query', () => {
    it('should return user with given username', async () => {
      const mockUser = mockUserFactory();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);

      const query = {
        query: gql`
          query user($username: String!) {
            user(username: $username) {
              username
              id
              email
            }
          }
        `.loc.source.body,
        variables: {
          username: mockUser.username,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(query)
        .expect(200);

      expect(result.body.data.user.username).toBe(mockUser.username);
    });
  });

  describe('removeUser Mutation', () => {
    it('should remove user, and return removed user', async () => {
      const mockUser = mockUserFactory();
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(mockUser);
      const jwtService = new JwtService(jwtOptions);
      const token = jwtService.sign(mockUser);

      const query = {
        query: gql`
          mutation remove($input: ID!) {
            removeUser(id: $input) {
              username
            }
          }
        `.loc.source.body,
        variables: {
          input: mockUser.id,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(query)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(result.body.data.removeUser.username).toBe(mockUser.username);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
