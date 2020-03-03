import { Test, TestingModule } from '@nestjs/testing';
import { TagResolver } from '../tag.resolver';
import { TagService } from '../tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { mockTagFactory } from '../../../test/fixtures/tag/tag.fixture';
import { mockUserFactory } from '../../../test/fixtures/user/user.fixture';

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
      const tags = [mockTagFactory()];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(tags);

      const result = await service.findAll();

      expect(result).toBe(tags);
    });
  });

  describe('followTag Mutation', () => {
    it('should allow following tag', async () => {
      const user = mockUserFactory();
      const tag = mockTagFactory({ followers: [user] });
      jest.spyOn(service, 'addFollower').mockResolvedValueOnce(tag);

      const result = await service.addFollower(user, tag.id);

      expect(result).toBe(tag);
    });
  });
});
