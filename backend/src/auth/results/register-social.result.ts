import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../responses/auth-user.response';
import { SocialAlreadyAssignedError } from '../responses/social-already-assigned.error';
import { CredentialsTakenError } from '../responses/credentials-taken.error';

export const RegisterSocialResultUnion = createUnionType({
  name: 'RegisterSocialResult',
  types: () => [
    AuthUserResponse,
    SocialAlreadyAssignedError,
    CredentialsTakenError,
  ],
});
