import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import {
  mockUserFactory,
  mockUserRegisterInputFactory,
} from '../../test/mocks/user/user.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  describe('users', () => {
    it('should return an array of users', async () => {
      const mockUser = mockUserFactory();
      const expected = [mockUser];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expected);

      const result = await resolver.users();

      expect(result).toBe(expected);
    });
  });

  describe('user', () => {
    it('should return given user with given userName', async () => {
      const expected = mockUserFactory();
      jest.spyOn(service, 'findOneByUsername').mockResolvedValueOnce(expected);

      const result = await resolver.user(expected.username);

      expect(result).toBe(expected);
    });
  });

  describe('createUser', () => {
    it('should save user', async () => {
      const mockUserRegisterInput = mockUserRegisterInputFactory();
      const expected = mockUserFactory(mockUserRegisterInput);
      jest.spyOn(service, 'save').mockResolvedValueOnce(expected);

      const result = await resolver.createUser(mockUserRegisterInput);

      expect(result).toBe(expected);
    });
  });

  describe('removeUser', () => {
    it('should removeUser', async () => {
      const expected = mockUserFactory();
      jest.spyOn(service, 'remove').mockResolvedValueOnce(expected);

      const result = await resolver.removeUser(expected.id);

      expect(result).toBe(expected);
    });
  });
});
