import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { userFactory, userRegisterInputFactory } from '../../../test/factories/user.factory';
import { UserRepository } from '../../user/user.repository';
import { GraphQLError } from 'graphql';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [AuthService, UserService, UserRepository],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('signToken', () => {
    it('should generate auth token', async () => {
      const user = userFactory.buildOne();

      const response = await authService.signToken(user);

      expect(response.token).toBeTruthy();
    });
  });

  describe('registerUser', () => {
    it('should save user and return auth token', async () => {
      const userRegisterInput = userRegisterInputFactory.buildOne();
      const user = userFactory.buildOne(userRegisterInput);
      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(false);
      jest.spyOn(userService, 'save').mockResolvedValueOnce(user);

      const response = await authService.registerUser(userRegisterInput);

      expect(response.user.username).toBe(userRegisterInput.username);
    });

    it('should throw exceptions, if there already exists user with given credentials', async () => {
      const userRegisterInput = userRegisterInputFactory.buildOne();

      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(true);

      await expect(
        authService.registerUser(userRegisterInput),
      ).rejects.toThrowError(GraphQLError);
    });
  });

  describe('validateUser', () => {
    it('should check if user with the same password exists', async () => {
      const user = userFactory.buildOne();
      const originalPassword = user.password;
      await user.hashPassword();
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(user);

      const response = await authService.validateCredentials(
        user.username,
        originalPassword,
      );

      expect(response).toBe(user);
    });

    it('should throw error if password are not equal', async () => {
      const user = userFactory.buildOne();
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(user);

      await expect(
        authService.validateCredentials(user.username, user.password),
      ).rejects.toThrowError(GraphQLError);
    });
  });
});
