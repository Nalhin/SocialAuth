import { PassportStrategy } from '@nestjs/passport';
import * as Strategy from 'passport-facebook-token';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import facebookConfig from '../../config/facebook.config';
import { UserService } from '../../user/user.service';
import { Profile } from 'passport';
import { AuthTypes } from '../types/auth.types';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  AuthTypes.FACEBOOK,
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
    done: Function,
  ) {
    if (!profile) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, profile);
  }
}
