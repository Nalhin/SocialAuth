import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-token';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import facebookConfig from '../../config/facebook.config';
import { UserService } from '../../user/user.service';
import { SocialAuthProviderTypes } from '../auth.entity';
import { Profile } from 'passport';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  SocialAuthProviderTypes.FACEBOOK,
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
