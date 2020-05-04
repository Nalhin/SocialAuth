import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../../graphql/interfaces/error-response.interface';
import { SocialProviderTypes } from '../auth.entity';

@ObjectType({
  implements: [ErrorResponse],
})
export class SocialAlreadyAssignedError extends ErrorResponse {
  @Field((_type) => SocialProviderTypes)
  provider: SocialProviderTypes;

  constructor(partial?: Partial<SocialAlreadyAssignedError>) {
    super('This social account is already assigned to another account');
    Object.assign(this, partial);
  }
}
