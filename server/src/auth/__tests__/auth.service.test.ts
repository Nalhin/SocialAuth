import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import {
  mockUserFactory,
  mockUserRegisterInputFactory,
} from '../../../test/fixtures/user/user.fixture';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('signToken', () => {
    it('should generate jwt for user', async () => {
      const user = mockUserFactory();

      const response = await authService.signToken(user);

      expect(response.token).toBeTruthy();
    });
  });

  describe('registerUser', () => {
    it('should save user and sign token', async () => {
      const userRegisterInput = mockUserRegisterInputFactory();
      const mockUser = mockUserFactory(userRegisterInput);
      jest.spyOn(userService, 'save').mockResolvedValueOnce(mockUser);

      const response = await authService.registerUser(userRegisterInput);

      expect(response.username).toBe(userRegisterInput.username);
    });
  });

  describe('validateUser', () => {
    it('should check if user with the same password exists', async () => {
      const mockUser = mockUserFactory();
      jest
        .spyOn(userService, 'findOneByUsername')
        .mockResolvedValueOnce(mockUser);

      const response = await authService.validateUser(
        mockUser.username,
        mockUser.password,
      );

      expect(response).toBe(mockUser);
    });
  });
});
