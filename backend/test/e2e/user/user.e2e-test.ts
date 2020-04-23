import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/user/user.entity';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { gql } from 'apollo-server-express';
import { JwtService } from '@nestjs/jwt';
import { jwtOptions } from '../../../src/auth/jwt.constants';
import { AppModule } from '../../../src/app.module';
import { GraphqlConfigService } from '../../../src/config/graphql.config';
import { GraphqlTestConfigService } from '../../config/graphql.config';
import { TypeOrmConfigService } from '../../../src/config/typeorm.config';
import { TypeOrmTestConfigService } from '../../config/typeorm.config';
import { userFactory } from '../../factories/user.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GraphqlConfigService)
      .useClass(GraphqlTestConfigService)
      .overrideProvider(TypeOrmConfigService)
      .useClass(TypeOrmTestConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('users Query', () => {
    it('should return users', async () => {
      const users = userFactory.buildMany(2)
      jest.spyOn(repository, 'find').mockResolvedValueOnce(users);

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
      const user = userFactory.buildOne()
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

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
          username: user.username,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(query)
        .expect(200);

      expect(result.body.data.user.username).toBe(user.username);
    });
  });

  describe('removeUser Mutation', () => {
    it('should remove user, and return removed user', async () => {
      const user = userFactory.buildOne()
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(user);
      const jwtService = new JwtService(jwtOptions);
      const token = jwtService.sign({...user});

      const query = {
        query: gql`
          mutation remove($input: ID!) {
            removeUser(id: $input) {
              username
            }
          }
        `.loc.source.body,
        variables: {
          input: user.id,
        },
      };

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send(query)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(result.body.data.removeUser.username).toBe(user.username);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
