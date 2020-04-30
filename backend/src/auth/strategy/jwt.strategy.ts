import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { AuthTypes } from '../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthTypes.JWT) {
  constructor(
    private userService: UserService,
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConf.secret,
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    const user = await this.userService.findOneByUsername(payload.username);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, user);
  }
}
