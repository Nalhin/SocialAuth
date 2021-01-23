import { Test, TestingModule } from '@nestjs/testing';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { postFactory } from '../../test/factories/post.factory';
import { userFactory } from '../../test/factories/user.factory';
import { PostRepository } from './post.repository';

describe('PostResolver', () => {
  let resolver: PostResolver;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostResolver, PostService, PostRepository],
    }).compile();

    resolver = module.get<PostResolver>(PostResolver);
    service = module.get<PostService>(PostService);
  });

  describe('posts Query', () => {
    it('should return posts', async () => {
      const posts = postFactory.buildMany(3);
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(posts);

      const result = await service.findAll();

      expect(result).toBe(posts);
    });
  });

  describe('addPost Mutation', () => {
    it('should allow adding post', async () => {
      const author = userFactory.buildOne();
      const post = postFactory.buildOne();
      const postWithAuthor = { ...post, author };
      jest.spyOn(service, 'save').mockResolvedValueOnce(postWithAuthor);

      const result = await resolver.addPost(post, author);

      expect(result).toBe(postWithAuthor);
    });
  });
});
