import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { AuthUserResponse } from './responses/auth-user.response';
import { RegisterUserInput } from './inputs/register-user.input';
import { Profile } from 'passport';
import { AuthProvidersRepository } from './auth.repository';
import { SocialAuthProviders } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly authProvidersRepository: AuthProvidersRepository,
  ) {}

  async validateCredentials(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    if (!(await user?.comparePassword(password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async signToken(user: User): Promise<AuthUserResponse> {
    const payload = { username: user.username, sub: user.id };
    return new AuthUserResponse({
      user,
      token: this.jwtService.sign(payload),
    });
  }

  async registerUser(user: RegisterUserInput): Promise<AuthUserResponse> {
    if (await this.userService.existsByCredentials(user)) {
      throw new UnprocessableEntityException();
    }

    const returnedUser = await this.userService.save(user);
    return this.signToken(returnedUser);
  }

  async registerSocial(profile: Profile, username: string) {
    const email = profile.emails[0].value;
    if (
      await this.userService.existsByCredentials({
        email,
        username,
      })
    ) {
      throw new UnprocessableEntityException();
    }
    const socialId = profile.id;
    const oldProfile = await this.authProvidersRepository.findOne({
      socialId,
    });
    if (!oldProfile) {
      throw new UnprocessableEntityException();
    }
    const user = await this.userService.save({ username, email });
    await this.authProvidersRepository.save({
      user,
      provider: profile.provider as SocialAuthProviders,
      socialId,
    });

    return this.signToken(user);
  }

  async loginSocial(profile: Profile) {
    const user = await this.authProvidersRepository.findUserBySocialId(
      profile.id,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signToken(user);
  }
}
