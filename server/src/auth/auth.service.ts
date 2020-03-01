import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserRegisterInput } from './input/user-register.input';
import { AuthUser } from './types/auth-user';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    if (user?.password === password) {
      return user;
    }
    return null;
  }

  async signToken(user: User): Promise<AuthUser> {
    const payload = { username: user.username, sub: user.id };
    return {
      ...user,
      token: this.jwtService.sign(payload),
    };
  }

  async registerUser(user: UserRegisterInput): Promise<AuthUser> {
    const returnedUser = await this.userService.save(user);
    return this.signToken(returnedUser);
  }
}
