import { Test, TestingModule } from '@nestjs/testing';
import { TagResolver } from '../tag.resolver';
import { TagService } from '../tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { tagFactory } from '../../../test/factories/tag.factory';
import { userFactory } from '../../../test/factories/user.factory';

describe('TagResolver', () => {
  let resolver: TagResolver;
  let service: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagResolver,
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<TagResolver>(TagResolver);
    service = module.get<TagService>(TagService);
  });

  describe('tags Query', () => {
    it('should return tags', async () => {
      const tags = tagFactory.buildMany(3);
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(tags);

      const result = await service.findAll();

      expect(result).toBe(tags);
    });
  });

  describe('followTag Mutation', () => {
    it('should allow following tag', async () => {
      const users = userFactory.buildMany(3);
      const tag = tagFactory.buildOne({ followers: users });
      jest.spyOn(service, 'addFollower').mockResolvedValueOnce(tag);

      const result = await service.addFollower(users[0], tag.id);

      expect(result).toBe(tag);
    });
  });
});
