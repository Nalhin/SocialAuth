import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { userFactory, userRegisterInputFactory } from '../../../test/factories/user.factory';

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
      const user = userFactory.buildOne();

      const response = await authService.signToken(user);

      expect(response.token).toBeTruthy();
    });
  });

  describe('registerUser', () => {
    it('should save user and sign token', async () => {
      const userRegisterInput = userRegisterInputFactory.buildOne();
      const user = userFactory.buildOne(userRegisterInput);
      jest.spyOn(userService, 'save').mockResolvedValueOnce(user);

      const response = await authService.registerUser(userRegisterInput);

      expect(response.username).toBe(userRegisterInput.username);
    });
  });

  describe('validateUser', () => {
    it('should check if user with the same password exists', async () => {
      const mockUser = userFactory.buildOne();
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
