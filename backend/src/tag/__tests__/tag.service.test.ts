import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from '../tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { mockTagFactory } from '../../../test/fixtures/tag/tag.fixture';
import { mockUserFactory } from '../../../test/fixtures/user/user.fixture';
import { HttpException } from '@nestjs/common';

describe('TagService', () => {
  let service: TagService;
  let repository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    repository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  describe('findAll', () => {
    it('should return tags', async () => {
      const tags = [mockTagFactory()];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(tags);

      const result = await service.findAll();

      expect(result).toBe(tags);
    });
  });

  describe('addFollower', () => {
    const user = mockUserFactory();
    const tag = mockTagFactory();
    const tagWithAuthor = { ...tag, authors: [user] };

    it('should allow adding follower', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(tag);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(tagWithAuthor);

      const result = await service.addFollower(user, tag.id);

      expect(result).toBe(tagWithAuthor);
    });

    it('should throw error, if tag is missing', async () => {
      jest.spyOn(repository, 'findOne').mockImplementation();

      await expect(service.addFollower(user, tag.id)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
