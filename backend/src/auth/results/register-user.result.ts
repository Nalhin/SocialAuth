import { createUnionType } from '@nestjs/graphql';
import { InvalidInputResponse } from '../../graphql/response/invalid-input.response';
import { AuthUserResponse } from '../responses/auth-user.response';
import { CredentialsTakenResponse } from '../responses/credentials-taken.response';

export const RegisterUserResultUnion = createUnionType({
  name: 'RegisterUserResult',
  types: () => [
    AuthUserResponse,
    InvalidInputResponse,
    CredentialsTakenResponse,
  ],
});
