import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { Tag } from '../../tag/tag.entity';
import { mockPostFactory } from '../../../test/fixtures/post/post.fixture';
import { HttpException } from '@nestjs/common';
import { mockUserFactory } from '../../../test/fixtures/user/user.fixture';

describe('PostService', () => {
  let service: PostService;
  let postsRepository: Repository<Post>;
  let tagsRepository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<PostService>(PostService);
    postsRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    tagsRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  describe('save', () => {
    it('should save post', async () => {
      const user = mockUserFactory();
      const post = mockPostFactory({ author: user });

      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(post);

      const result = await service.save(post, user);

      expect(result).toBe(post);
    });
  });

  describe('upvote', () => {
    const user = mockUserFactory();
    const post = mockPostFactory();
    const upvotedPost = { ...post, upvotedBy: [user] };

    it('should allow upvoting post', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(post);
      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(upvotedPost);

      const result = await service.upvote(post.id, user);

      expect(result).toBe(upvotedPost);
    });

    it('should throw error, if post is missing', async () => {
      jest.spyOn(postsRepository, 'findOne').mockImplementation();

      await expect(service.upvote(post.id, user)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return posts', async () => {
      const expected = [mockPostFactory()];
      jest.spyOn(postsRepository, 'find').mockResolvedValueOnce(expected);

      const result = await service.findAll();

      expect(result).toBe(expected);
    });
  });
});
