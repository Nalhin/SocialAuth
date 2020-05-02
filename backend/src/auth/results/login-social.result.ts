import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../responses/auth-user.response';
import { SocialNotRegisteredResponse } from '../responses/social-not-registered.response';

export const LoginSocialResultUnion = createUnionType({
  name: 'LoginSocialResult',
  types: () => [AuthUserResponse, SocialNotRegisteredResponse],
});
