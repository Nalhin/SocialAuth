import * as request from 'supertest';
import { userFactory } from '../../factories/user.factory';
import { gql } from 'apollo-server-express';
import { GQL } from '../constants';
import { authHeaderFactory } from '../../factories/auth.factory';
import { E2EApp, initializeApp } from '../test-utils/initialize-app';

describe('UserModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('users query', () => {
    const query = gql`
      query {
        users {
          username
          id
          email
        }
      }
    `.loc?.source.body;

    it('should return users', async () => {
      const users = await e2e.dbTestUtils.saveMany(userFactory.buildMany(2));

      const gqlReg = {
        query,
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .expect(200);

      expect(result.body.data.users.length).toBe(users.length);
    });
  });

  describe('user query', () => {
    const query = gql`
      query user($username: String!) {
        user(username: $username) {
          username
          id
          email
        }
      }
    `.loc?.source.body;

    it('should return user with given username', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReg = {
        query,
        variables: {
          username: user.username,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReg)
        .expect(200);

      expect(result.body.data.user.username).toBe(user.username);
    });
  });

  describe('removeUser mutation', () => {
    const query = gql`
      mutation remove($input: ID!) {
        removeUser(id: $input) {
          username
        }
      }
    `.loc?.source.body;

    it('should remove user, and return removed user', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const gqlReq = {
        query,
        variables: {
          input: user.id,
        },
      };

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.data.removeUser.username).toBe(user.username);
    });
  });
});
