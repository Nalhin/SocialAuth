import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserRegisterInput } from './input/user-register.input';
import { AuthUserResponse } from './response/auth-user.response';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateCredentials(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    if (!(await user?.comparePassword(password))) {
      throw new GraphQLError('Invalid credentials provided.');
    }
    return user;
  }

  async signToken(user: User): Promise<AuthUserResponse> {
    const payload = { username: user.username, sub: user.id };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async registerUser(user: UserRegisterInput): Promise<AuthUserResponse> {
    if (await this.userService.existsByCredentials(user)) {
      throw new GraphQLError('Credentials are already taken');
    }

    const returnedUser = await this.userService.save(user);
    return this.signToken(returnedUser);
  }
}
