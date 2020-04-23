import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from '../tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { HttpException } from '@nestjs/common';
import { tagFactory } from '../../../test/factories/tag.factory';
import { userFactory } from '../../../test/factories/user.factory';

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
      const tags = tagFactory.buildMany(3);
      jest.spyOn(repository, 'find').mockResolvedValueOnce(tags);

      const result = await service.findAll();

      expect(result).toBe(tags);
    });
  });

  describe('addFollower', () => {
    const user = userFactory.buildOne();
    const tag = tagFactory.buildOne();
    const tagWithFollower = tagFactory.buildOne({
      followers: userFactory.buildMany(2),
    });

    it('should allow adding follower', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(tag);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(tagWithFollower);

      const result = await service.addFollower(user, tag.id);

      expect(result).toBe(tagWithFollower);
    });

    it('should throw error, if tag is missing', async () => {
      jest.spyOn(repository, 'findOne').mockImplementation();

      await expect(service.addFollower(user, tag.id)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
