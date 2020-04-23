import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userFactory, userRegisterInputFactory } from '../../../test/factories/user.factory';


describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('save', () => {
    it('should save user', async () => {
      const userRegisterInput = userRegisterInputFactory.buildOne();
      const user = userFactory.buildOne(userRegisterInput);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(user);

      const result = await service.save(userRegisterInput);

      expect(result).toBe(user);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = userFactory.buildMany(2)
      jest.spyOn(repository, 'find').mockResolvedValueOnce(users);

      const result = await service.findAll();

      expect(result).toBe(users);
    });
  });

  describe('findOneByUsername', () => {
    it('should return user with given username', async () => {
      const user = userFactory.buildOne()
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findOneByUsername(user.username);

      expect(result).toBe(user);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const user = userFactory.buildOne();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(user);

      const result = await service.remove(user.id);

      expect(result).toBe(user);
    });
  });
});
