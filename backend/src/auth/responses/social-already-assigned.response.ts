import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../../graphql/interface/error-response.interface';
import { SocialAuthProviderTypes } from '../auth.entity';

@ObjectType({
  implements: [ErrorResponse],
})
export class SocialAlreadyAssignedResponse extends ErrorResponse {
  @Field((_type) => SocialAuthProviderTypes)
  provider: SocialAuthProviderTypes;

  constructor(partial?: Partial<SocialAlreadyAssignedResponse>) {
    super('This social account is already assigned to another account');
    Object.assign(this, partial);
  }
}
