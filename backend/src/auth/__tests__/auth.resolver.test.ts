import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import {
  mockAuthUserFactory,
  mockUserFactory,
  mockUserLoginInputFactory,
  mockUserRegisterInputFactory,
} from '../../../test/fixtures/user/user.fixture';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [
        AuthResolver,
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('register', () => {
    it('should register user', async () => {
      const mockUserRegisterInput = mockUserRegisterInputFactory();
      const expected = mockAuthUserFactory(mockUserRegisterInput);
      jest.spyOn(authService, 'registerUser').mockResolvedValueOnce(expected);

      const result = await resolver.register(mockUserRegisterInput);

      expect(result).toBe(expected);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const mockUserLoginInput = mockUserLoginInputFactory();
      const mockUser = mockUserFactory(mockUserLoginInput);
      const expected = mockAuthUserFactory(mockUser);
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(mockUser);
      jest.spyOn(authService, 'signToken').mockResolvedValueOnce(expected);

      const result = await resolver.login(mockUserLoginInput);

      expect(result).toBe(expected);
    });
  });
});
