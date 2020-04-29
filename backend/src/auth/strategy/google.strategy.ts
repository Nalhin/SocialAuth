import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, UnauthorizedException } from '@nestjs/common';
import googleConfig from '../../config/google.config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../../user/user.service';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: UserService,
    @Inject(googleConfig.KEY)
    private googleConf: ConfigType<typeof googleConfig>,
  ) {
    super({
      consumerKey: googleConf.consumerKey,
      consumerSecret: googleConf.consumerSecret,
      scope: googleConf.scope,
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
