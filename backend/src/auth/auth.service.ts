import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { AuthUserResponse } from './responses/auth-user.response';
import { RegisterUserInput } from './inputs/register-user.input';
import { Profile } from 'passport';
import { SocialAuthProviderTypes } from './auth.entity';
import { SocialAuthProviderRepository } from './auth.repository';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { CredentialsTakenResponse } from './responses/credentials-taken.response';
import { InvalidCredentialsResponse } from './responses/invalid-credentials.response';
import { Either, either } from '../common/utils/either';
import { SocialAlreadyAssignedResponse } from './responses/social-already-assigned.response';
import { SocialNotRegisteredResponse } from './responses/social-not-registered.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly socialAuthProvidersRepository: SocialAuthProviderRepository,
  ) {}

  async validateCredentials(
    username: string,
    password: string,
  ): Promise<Either<InvalidCredentialsResponse, User>> {
    const user = await this.userService.findOneByUsername(username);
    if (!(await user?.comparePassword(password))) {
      return either.error(
        new InvalidCredentialsResponse({
          providedUsername: username,
        }),
      );
    }
    return either.of(user);
  }

  async signToken(user: User): Promise<AuthUserResponse> {
    const payload = { username: user.username, sub: user.id };
    return new AuthUserResponse({
      user,
      token: this.jwtService.sign(payload),
    });
  }

  async registerUser(
    user: RegisterUserInput,
  ): Promise<Either<CredentialsTakenResponse, User>> {
    if (await this.userService.existsByCredentials(user)) {
      return either.error(
        new CredentialsTakenResponse({
          providedEmail: user.email,
          providedUsername: user.username,
        }),
      );
    }
    const returnedUser = await this.userService.save(user);
    return either.of(returnedUser);
  }

  async loginSocial(
    profile: Profile,
    provider: SocialAuthProviderTypes,
  ): Promise<Either<SocialNotRegisteredResponse, User>> {
    const user = await this.socialAuthProvidersRepository.findUserBySocialId(
      profile.id,
    );
    if (!user) {
      return either.error(
        new SocialNotRegisteredResponse({
          provider,
        }),
      );
    }

    return either.of(user);
  }

  async registerSocial(
    profile: Profile,
    username: string,
    provider: SocialAuthProviderTypes,
  ) {
    const email = profile.emails![0].value;
    const socialId = profile.id;
    if (
      await this.userService.existsByCredentials({
        email,
        username,
      })
    ) {
      return either.error(
        new CredentialsTakenResponse({
          providedEmail: email,
          providedUsername: username,
        }),
      );
    }

    if (await this.socialAuthProvidersRepository.existsBySocialId(socialId)) {
      return either.error(
        new SocialAlreadyAssignedResponse({
          provider,
        }),
      );
    }
    const user = await this.socialAuthProvidersRepository.saveProviderAndUser(
      { username, email, password: randomStringGenerator() },
      { provider, socialId },
    );
    return either.of(user);
  }
}
