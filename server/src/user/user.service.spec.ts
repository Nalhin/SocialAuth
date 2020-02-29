import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockUserFactory,
  mockUserRegisterInputFactory,
} from '../../test/mocks/user/user.mock';

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
      const mockRegisterInput = mockUserRegisterInputFactory();
      const mockUser = mockUserFactory(mockRegisterInput);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockUser);

      const result = await service.save(mockRegisterInput);

      expect(result).toBe(mockUser);
    });
  });
  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUser = mockUserFactory();
      const expected = [mockUser];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(expected);

      const result = await service.findAll();

      expect(result).toBe(expected);
    });
  });

  describe('findOneByUsername', () => {
    it('should return user with given username', async () => {
      const mockUser = mockUserFactory();
      const expected = mockUser;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await service.findOneByUsername(mockUser.username);

      expect(result).toBe(expected);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const mockUser = mockUserFactory();
      const expected = mockUser;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(mockUser);

      const result = await service.remove(mockUser.id);

      expect(result).toBe(expected);
    });
  });
});
