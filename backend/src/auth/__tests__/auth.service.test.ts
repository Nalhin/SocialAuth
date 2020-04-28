import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import {
  registerUserInputBuilder,
  userFactory,
} from '../../../test/factories/user.factory';
import { UserRepository } from '../../user/user.repository';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

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
      const registerUserInput = registerUserInputBuilder.buildOne();
      const user = userFactory.buildOne(registerUserInput);
      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(false);
      jest.spyOn(userService, 'save').mockResolvedValueOnce(user);

      const response = await authService.registerUser(registerUserInput);

      expect(response.user.username).toBe(registerUserInput.username);
      expect(response.token).toBeTruthy();
    });

    it('should throw exception, if credentials are already taken', async () => {
      const registerUserInput = registerUserInputBuilder.buildOne();

      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(true);

      await expect(
        authService.registerUser(registerUserInput),
      ).rejects.toThrowError(UnprocessableEntityException);
    });
  });

  describe('validateUser', () => {
    it('should return correct values if user with similar password exists', async () => {
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

    it('should throw exception, if passwords are not equal', async () => {
      const user = userFactory.buildOne();
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(user);

      await expect(
        authService.validateCredentials(user.username, user.password),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
