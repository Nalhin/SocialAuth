import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import {
  registerUserInputFactory,
  userFactory,
} from '../../../test/factories/user.factory';
import { UserRepository } from '../../user/user.repository';
import { SocialProviderRepository } from '../auth.repository';
import { CredentialsTakenResponse } from '../responses/credentials-taken.response';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [
        AuthService,
        UserService,
        UserRepository,
        SocialProviderRepository,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('validateCredentials', () => {
    it('should return correct values if user with similar password exists', async () => {
      const user = userFactory.buildOne();
      const originalPassword = user.password;
      await user.hashPassword();
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(user);

      const response = await authService.validateCredentials(
        user.username,
        originalPassword,
      );

      expect(response.value).toBe(user);
    });

    it('should return error, if passwords are not equal', async () => {
      const user = userFactory.buildOne();
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(user);

      const response = await authService.validateCredentials(
        user.username,
        user.password,
      );

      expect(response.isError()).toBeTruthy();
      expect(
        ((response.value as unknown) as CredentialsTakenResponse)
          .providedUsername,
      ).toBe(user.username);
    });
  });

  describe('signToken', () => {
    it('should generate auth token', async () => {
      const user = userFactory.buildOne();

      const response = await authService.signToken(user);

      expect(response.token).toBeTruthy();
    });
  });

  describe('registerUser', () => {
    it('should save user', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();
      const user = userFactory.buildOne(registerUserInput);
      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(false);
      jest.spyOn(userService, 'save').mockResolvedValueOnce(user);

      const response = await authService.registerUser(registerUserInput);

      expect(response.value.username).toBe(registerUserInput.username);
    });

    it('should return error, if credentials are already taken', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();

      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(true);

      const response = await authService.registerUser(registerUserInput);

      expect(response.isError()).toBeTruthy();
      expect(response.errorsIfPresent()?.providedUsername).toBe(
        registerUserInput.username,
      );
    });
  });
});
