import { ErrorResponse } from '../../graphql/interface/error-response.interface';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  implements: [ErrorResponse],
})
export class CredentialsTakenResponse extends ErrorResponse {
  @Field()
  providedUsername: string;

  @Field()
  providedEmail: string;

  constructor(partial?: Partial<CredentialsTakenResponse>) {
    super('Credentials are already taken.');
    Object.assign(this, partial);
  }
}
