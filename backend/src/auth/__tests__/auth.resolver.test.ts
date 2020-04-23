import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import {
  authUserFactory,
  userFactory,
  userLoginInputFactory,
  userRegisterInputFactory,
} from '../../../test/factories/user.factory';

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
      const userRegisterInput = userRegisterInputFactory.buildOne();
      const expected = authUserFactory.buildOne(userRegisterInput);
      jest.spyOn(authService, 'registerUser').mockResolvedValueOnce(expected);

      const result = await resolver.register(userRegisterInput);

      expect(result).toBe(expected);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const userLoginInput = userLoginInputFactory.buildOne();
      const user = userFactory.buildOne(userLoginInput);
      const expected = authUserFactory.buildOne(user);
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user);
      jest.spyOn(authService, 'signToken').mockResolvedValueOnce(expected);

      const result = await resolver.login(userLoginInput);

      expect(result).toBe(expected);
    });
  });
});
