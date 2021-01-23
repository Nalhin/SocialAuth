import { createUnionType } from '@nestjs/graphql';
import { InvalidInputError } from '../../graphql/responses/invalid-input.error';
import { AuthUserResponse } from '../responses/auth-user.response';
import { CredentialsTakenError } from '../responses/credentials-taken.error';

export const RegisterUserResultUnion = createUnionType({
  name: 'RegisterUserResult',
  types: () => [AuthUserResponse, InvalidInputError, CredentialsTakenError],
});
