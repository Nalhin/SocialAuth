import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-token';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import facebookConfig from '../../config/facebook.config';
import { UserService } from '../../user/user.service';
import { SocialAuthProviders } from '../auth.entity';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  SocialAuthProviders.FACEBOOK,
) {
  constructor(
    private userService: UserService,
    @Inject(facebookConfig.KEY)
    private facebookConf: ConfigType<typeof facebookConfig>,
  ) {
    super({
      clientID: facebookConf.clientID,
      clientSecret: facebookConf.clientSecret,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    if (!profile) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, profile);
  }
}
