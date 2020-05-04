import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../responses/auth-user.response';
import { InvalidCredentialsError } from '../responses/invalid-credentials.error';

export const LoginUserResultUnion = createUnionType({
  name: 'LoginUserResult',
  types: () => [AuthUserResponse, InvalidCredentialsError],
});
