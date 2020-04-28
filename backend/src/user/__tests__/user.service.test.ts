import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import {
  registerUserInputBuilder,
  userFactory,
} from '../../../test/factories/user.factory';
import { UserRepository } from '../user.repository';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('save', () => {
    it('should save user', async () => {
      const userRegisterInput = registerUserInputBuilder.buildOne();
      const user = userFactory.buildOne(userRegisterInput);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(user);

      const result = await service.save(userRegisterInput);

      expect(result).toBe(user);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = userFactory.buildMany(2);
      jest.spyOn(repository, 'find').mockResolvedValueOnce(users);

      const result = await service.findAll();

      expect(result).toBe(users);
    });
  });

  describe('findOneByUsername', () => {
    it('should return user with given username', async () => {
      const user = userFactory.buildOne();
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
