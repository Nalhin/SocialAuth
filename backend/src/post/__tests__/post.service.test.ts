import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../post.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { userFactory } from '../../../test/factories/user.factory';
import { postFactory } from '../../../test/factories/post.factory';
import { PostRepository } from '../post.repository';

describe('PostService', () => {
  let service: PostService;
  let postsRepository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, PostRepository],
    }).compile();

    service = module.get<PostService>(PostService);
    postsRepository = module.get<PostRepository>(PostRepository);
  });

  describe('save', () => {
    it('should save post', async () => {
      const user = userFactory.buildOne();
      const post = postFactory.buildOne({ author: user });

      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(post);

      const result = await service.save(post, user);

      expect(result).toBe(post);
    });
  });

  describe('findAll', () => {
    it('should return posts', async () => {
      const expected = postFactory.buildMany(2);
      jest.spyOn(postsRepository, 'find').mockResolvedValueOnce(expected);

      const result = await service.findAll();

      expect(result).toBe(expected);
    });
  });
});
