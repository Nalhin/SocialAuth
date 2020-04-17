import { Test, TestingModule } from '@nestjs/testing';
import { PostResolver } from '../post.resolver';
import { PostService } from '../post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { Tag } from '../../tag/tag.entity';
import { mockPostFactory } from '../../../test/fixtures/post/post.fixture';
import { mockUserFactory } from '../../../test/fixtures/user/user.fixture';

describe('PostResolver', () => {
  let resolver: PostResolver;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostResolver,
        PostService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<PostResolver>(PostResolver);
    service = module.get<PostService>(PostService);
  });

  describe('posts Query', () => {
    it('should return posts', async () => {
      const posts = [mockPostFactory()];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(posts);

      const result = await service.findAll();

      expect(result).toBe(posts);
    });
  });

  describe('addPost Mutation', () => {
    it('should allow adding post', async () => {
      const post = mockPostFactory();
      const author = mockUserFactory();
      const postWithAuthor = { ...post, author };
      jest.spyOn(service, 'save').mockResolvedValueOnce(postWithAuthor);

      const result = await resolver.addPost(post, author);

      expect(result).toBe(postWithAuthor);
    });
  });

  describe('upvotePost Mutation', () => {
    it('should allow upvoting a post', async () => {
      const post = mockPostFactory();
      const author = mockUserFactory();
      const postWithAuthor = { ...post, author };
      jest.spyOn(service, 'upvote').mockResolvedValueOnce(postWithAuthor);

      const result = await resolver.upvotePost(post.id, author);

      expect(result).toBe(postWithAuthor);
    });
  });
});
