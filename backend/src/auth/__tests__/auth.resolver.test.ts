import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  loginUserInputFactory,
  registerUserInputFactory,
  userFactory,
} from '../../../test/factories/user.factory';
import { UserRepository } from '../../user/user.repository';
import { CredentialsTakenResponse } from '../responses/credentials-taken.response';
import { AuthUserResponse } from '../responses/auth-user.response';
import { InvalidCredentialsResponse } from '../responses/invalid-credentials.response';
import { SocialProviderRepository } from '../auth.repository';
import { either } from '../../common/utils/either';
import {
  loginSocialInputFactory,
  registerSocialInputFactory,
  socialProfileFactory,
} from '../../../test/factories/auth.factory';
import { SocialNotRegisteredResponse } from '../responses/social-not-registered.response';
import { SocialAlreadyAssignedResponse } from '../responses/social-already-assigned.response';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [
        AuthResolver,
        AuthService,
        UserService,
        UserRepository,
        SocialProviderRepository,
      ],
    }).compile();

    authResolver = module.get(AuthResolver);
    authService = module.get(AuthService);
    jwtService = module.get(JwtService);
  });

  describe('login', () => {
    it('should login user correctly', async () => {
      const loginUserInput = loginUserInputFactory.buildOne();
      const user = userFactory.buildOne(loginUserInput);
      jest
        .spyOn(authService, 'validateCredentials')
        .mockResolvedValueOnce(either.of(user));

      const [result] = (await authResolver.login(loginUserInput)) as [
        AuthUserResponse,
      ];

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result.user).toEqual(user);
      expect(result.token).toBeTruthy();
    });

    it('should return correct result if incorrect credentials are provided', async () => {
      const loginUserInput = loginUserInputFactory.buildOne();
      jest.spyOn(authService, 'validateCredentials').mockResolvedValueOnce(
        either.error(
          new InvalidCredentialsResponse({
            providedUsername: loginUserInput.username,
          }),
        ),
      );

      const [result] = (await authResolver.login(loginUserInput)) as [
        InvalidCredentialsResponse,
      ];

      expect(result).toBeInstanceOf(InvalidCredentialsResponse);
      expect(result.providedUsername).toBe(loginUserInput.username);
    });
  });

  describe('register', () => {
    it('should register user correctly', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();
      const user = userFactory.buildOne(registerUserInput);

      jest
        .spyOn(authService, 'registerUser')
        .mockResolvedValueOnce(either.of(user));

      const [result] = (await authResolver.register(registerUserInput)) as [
        AuthUserResponse,
      ];

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result.user).toEqual(user);
    });

    it('should return response with error if credentials are taken', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();
      jest.spyOn(authService, 'registerUser').mockResolvedValueOnce(
        either.error(
          new CredentialsTakenResponse({
            providedEmail: registerUserInput.email,
            providedUsername: registerUserInput.username,
          }),
        ),
      );

      const [result] = (await authResolver.register(registerUserInput)) as [
        CredentialsTakenResponse,
      ];

      expect(result).toBeInstanceOf(CredentialsTakenResponse);
      expect(result.providedEmail).toBe(registerUserInput.email);
    });
  });

  describe('loginSocial', () => {
    const loginSocialInput = loginSocialInputFactory.buildOne();
    const profile = socialProfileFactory.buildOne();
    it('should login social user correctly', async () => {
      const user = userFactory.buildOne();
      jest
        .spyOn(authService, 'loginSocial')
        .mockResolvedValueOnce(either.of(user));

      const [result] = (await authResolver.loginSocial(
        profile,
        loginSocialInput,
      )) as [AuthUserResponse];

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result.user).toEqual(user);
      expect(result.token).toBeTruthy();
    });

    it('should handle SocialNotRegistered errors correctly', async () => {
      jest.spyOn(authService, 'loginSocial').mockResolvedValueOnce(
        either.error(
          new SocialNotRegisteredResponse({
            provider: loginSocialInput.provider,
          }),
        ),
      );

      const [result] = (await authResolver.loginSocial(
        profile,
        loginSocialInput,
      )) as [SocialNotRegisteredResponse];

      expect(result).toBeInstanceOf(SocialNotRegisteredResponse);
      expect(result.provider).toBe(loginSocialInput.provider);
    });
  });

  describe('registerSocial', () => {
    const registerSocialInput = registerSocialInputFactory.buildOne();
    const profile = socialProfileFactory.buildOne();

    it('should register social user correctly', async () => {
      const user = userFactory.buildOne();
      jest
        .spyOn(authService, 'registerSocial')
        .mockResolvedValueOnce(either.of(user));

      const [result] = (await authResolver.registerSocial(
        profile,
        registerSocialInput,
      )) as [AuthUserResponse];

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result.user).toBe(user);
      expect(result.token).toBeTruthy();
    });

    it('should handle CredentialsTaken errors correctly', async () => {
      jest.spyOn(authService, 'registerSocial').mockResolvedValueOnce(
        either.error(
          new CredentialsTakenResponse({
            providedUsername: registerSocialInput.username,
          }),
        ),
      );

      const [result] = (await authResolver.registerSocial(
        profile,
        registerSocialInput,
      )) as [CredentialsTakenResponse];

      expect(result).toBeInstanceOf(CredentialsTakenResponse);
      expect(result.providedUsername).toBe(registerSocialInput.username);
    });

    it('should handle SocialAlreadyAssigned errors correctly', async () => {
      jest.spyOn(authService, 'registerSocial').mockResolvedValueOnce(
        either.error(
          new SocialAlreadyAssignedResponse({
            provider: registerSocialInput.provider,
          }),
        ),
      );

      const [result] = (await authResolver.registerSocial(
        profile,
        registerSocialInput,
      )) as [SocialAlreadyAssignedResponse];

      expect(result).toBeInstanceOf(SocialAlreadyAssignedResponse);
      expect(result.provider).toBe(registerSocialInput.provider);
    });
  });
});
