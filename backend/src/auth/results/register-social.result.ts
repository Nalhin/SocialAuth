import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../responses/auth-user.response';
import { SocialAlreadyAssignedResponse } from '../responses/social-already-assigned.response';
import { CredentialsTakenResponse } from '../responses/credentials-taken.response';

export const RegisterSocialResultUnion = createUnionType({
  name: 'RegisterSocialResult',
  types: () => [
    AuthUserResponse,
    SocialAlreadyAssignedResponse,
    CredentialsTakenResponse,
  ],
});
