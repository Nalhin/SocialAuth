import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-token';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import googleConfig from '../../config/google.config';
import { ConfigType } from '@nestjs/config';
import { Profile } from 'passport';
import { AuthTypes } from '../types/auth.types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthTypes.GOOGLE,
) {
  constructor(
    @Inject(googleConfig.KEY)
    private googleConf: ConfigType<typeof googleConfig>,
  ) {
    super({
      clientID: googleConf.clientID,
      clientSecret: googleConf.clientSecret,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    if (!profile) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, profile);
  }
}
