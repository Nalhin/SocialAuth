import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import facebookConfig from '../../config/facebook.config';
import { UserService } from '../../user/user.service';

export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
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
    request: any,
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
