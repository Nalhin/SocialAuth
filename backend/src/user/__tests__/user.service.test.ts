import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import {
  registerUserInputFactory,
  userFactory,
} from '../../../test/factories/user.factory';
import { UserRepository } from '../user.repository';
import { socialProfileFactory } from '../../../test/factories/auth.factory';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('save', () => {
    it('should save user', async () => {
      const userRegisterInput = registerUserInputFactory.buildOne();
      const user = userFactory.buildOne(userRegisterInput);
      jest.spyOn(userRepository, 'create').mockReturnValueOnce(user);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);

      const result = await userService.save(userRegisterInput);

      expect(result).toBe(user);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = userFactory.buildMany(2);
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);

      const result = await userService.findAll();

      expect(result).toBe(users);
    });
  });

  describe('findOneByUsername', () => {
    it('should return user with given username', async () => {
      const user = userFactory.buildOne();
      jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValueOnce(user);

      const result = await userService.findOneByUsername(user.username);

      expect(result).toBe(user);
    });
  });

  describe('findOneBySocialId', () => {
    it('should return user with given social id', async () => {
      const { id: socialId } = socialProfileFactory.buildOne();
      const user = userFactory.buildOne();
      jest.spyOn(userRepository, 'findOneBySocialId').mockResolvedValueOnce(user);

      const result = await userService.findOneBySocialId(socialId);

      expect(result).toBe(user);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const user = userFactory.buildOne();
      jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValueOnce(user);
      jest.spyOn(userRepository, 'remove').mockResolvedValueOnce(user);

      const result = await userService.remove(user.id);

      expect(result).toBe(user);
    });
  });

  describe('existsByCredentials', () => {
    it('should return if user with given credentials exists', async () => {
      const { username, email } = userFactory.buildOne();
      jest.spyOn(userRepository, 'existsByEmailOrUsername').mockResolvedValueOnce(true);

      const result = await userService.existsByCredentials({username, email});

      expect(result).toBeTruthy();
    });
  });
});
