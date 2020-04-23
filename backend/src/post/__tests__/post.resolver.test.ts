import { Test, TestingModule } from '@nestjs/testing';
import { PostResolver } from '../post.resolver';
import { PostService } from '../post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { Tag } from '../../tag/tag.entity';
import { postFactory } from '../../../test/factories/post.factory';
import { userFactory } from '../../../test/factories/user.factory';

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
      const posts = postFactory.buildMany(3);
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(posts);

      const result = await service.findAll();

      expect(result).toBe(posts);
    });
  });

  describe('addPost Mutation', () => {
    it('should allow adding post', async () => {
      const author = userFactory.buildOne()
      const post = postFactory.buildOne()
      const postWithAuthor = { ...post, author };
      jest.spyOn(service, 'save').mockResolvedValueOnce(postWithAuthor);

      const result = await resolver.addPost(post, author);

      expect(result).toBe(postWithAuthor);
    });
  });

  describe('upvotePost Mutation', () => {
    it('should allow upvoting a post', async () => {
      const author = userFactory.buildOne()
      const post = postFactory.buildOne({author})
      jest.spyOn(service, 'upvote').mockResolvedValueOnce(post);

      const result = await resolver.upvotePost(post.id, author);

      expect(result).toBe(post);
    });
  });
});
