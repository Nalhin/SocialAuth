import { E2EApp, initializeApp } from '../test-utils/initialize-app';
import { gql } from 'apollo-server-express';
import { userFactory } from '../../factories/user.factory';
import { postFactory } from '../../factories/post.factory';
import * as request from 'supertest';
import { GQL } from '../constants';
import { authHeaderFactory } from '../../factories/auth.factory';

describe('PostModule (e2e)', () => {
  let e2e: E2EApp;

  beforeEach(async () => {
    e2e = await initializeApp();
  });

  afterEach(async () => {
    await e2e.cleanup();
  });

  describe('posts query', () => {
    const gqlReq = gql`
      query {
        posts {
          author {
            username
          }
          id
          content
        }
      }
    `.loc?.source.body;

    it('should return a list of posts', async () => {
      const author = await e2e.dbTestUtils.saveOne(userFactory.buildOne());
      await e2e.dbTestUtils.saveMany(postFactory.buildMany(2, {
        partial: {
          author,
          content: 'example',
        },
      }));

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send({ query: gqlReq })
        .set('Authorization', authHeaderFactory(author))
        .expect(200);

      const posts = result.body.data.posts;
      expect(posts).toHaveLength(2);
      expect(posts[0].author.username).toBe(author.username);
    });
  });


  describe('addPost mutation', () => {
    const query = gql`
      mutation addPost($input: AddPostInput!) {
        addPost(input: $input){
          __typename,
          content,
          author {
            username
          }
        }
      }
    `.loc?.source.body;

    const gqlReq = {
      query,
      variables: {
        input: {
          content: 'content',
        },
      },
    };

    it('should reject when user is not authenticated', async () => {
      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .expect(200);

      expect(result.body.errors).toHaveLength(1);
    });

    it('should allow to add a post', async () => {
      const user = await e2e.dbTestUtils.saveOne(userFactory.buildOne());

      const result = await request(e2e.app.getHttpServer())
        .post(GQL)
        .send(gqlReq)
        .set('Authorization', authHeaderFactory(user))
        .expect(200);

      expect(result.body.data.addPost.content).toBe('content');
      expect(result.body.data.addPost.author.username).toBe(user.username);
    });
  });
});
