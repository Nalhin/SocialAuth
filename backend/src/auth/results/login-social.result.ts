import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../responses/auth-user.response';
import { SocialNotRegisteredError } from '../responses/social-not-registered.error';

export const LoginSocialResultUnion = createUnionType({
  name: 'LoginSocialResult',
  types: () => [AuthUserResponse, SocialNotRegisteredError],
});
