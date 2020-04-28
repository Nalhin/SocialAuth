import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import {
  authUserFactory,
  loginUserInputBuilder,
  registerUserInputBuilder,
  userFactory,
} from '../../../test/factories/user.factory';
import { UserRepository } from '../../user/user.repository';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CredentialsTakenResponse } from '../responses/credentials-taken.response';
import { AuthUserResponse } from '../responses/auth-user.response';
import { InvalidCredentialsResponse } from '../responses/invalid-credentials.response';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [AuthResolver, AuthService, UserService, UserRepository],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should login user correctly', async () => {
      const loginUserInput = loginUserInputBuilder.buildOne();
      const user = userFactory.buildOne(loginUserInput);
      const expected = authUserFactory.buildOne({ user });
      jest
        .spyOn(authService, 'validateCredentials')
        .mockResolvedValueOnce(user);
      jest.spyOn(authService, 'signToken').mockResolvedValueOnce(expected);

      const [result] = await authResolver.login(loginUserInput);

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result).toBe(expected);
    });

    it('should return correct result if incorrect credentials are provided', async () => {
      const loginUserInput = loginUserInputBuilder.buildOne();
      jest
        .spyOn(authService, 'validateCredentials')
        .mockRejectedValueOnce(new UnauthorizedException());

      const [result] = (await authResolver.login(loginUserInput)) as [
        InvalidCredentialsResponse,
      ];

      expect(result).toBeInstanceOf(InvalidCredentialsResponse);
      expect(result.providedUsername).toBe(loginUserInput.username);
    });
  });

  describe('register', () => {
    it('should register user correctly', async () => {
      const registerUserInput = registerUserInputBuilder.buildOne();
      const user = userFactory.buildOne(registerUserInput);
      const expected = authUserFactory.buildOne({ user });
      jest.spyOn(authService, 'registerUser').mockResolvedValueOnce(expected);

      const [result] = await authResolver.register(registerUserInput);

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result).toBe(expected);
    });
    it('should return correct result if credentials are taken', async () => {
      const registerUserInput = registerUserInputBuilder.buildOne();
      jest
        .spyOn(authService, 'registerUser')
        .mockRejectedValueOnce(new UnprocessableEntityException());

      const [result] = (await authResolver.register(registerUserInput)) as [
        CredentialsTakenResponse,
      ];

      expect(result).toBeInstanceOf(CredentialsTakenResponse);
      expect(result.providedEmail).toBe(registerUserInput.email);
    });
  });
});
