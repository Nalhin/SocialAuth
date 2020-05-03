import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../../graphql/interface/error-response.interface';
import { SocialProviderTypes } from '../auth.entity';

@ObjectType({
  implements: [ErrorResponse],
})
export class SocialAlreadyAssignedResponse extends ErrorResponse {
  @Field((_type) => SocialProviderTypes)
  provider: SocialProviderTypes;

  constructor(partial?: Partial<SocialAlreadyAssignedResponse>) {
    super('This social account is already assigned to another account');
    Object.assign(this, partial);
  }
}
