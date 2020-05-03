import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../../graphql/interface/error-response.interface';
import { SocialProviderTypes } from '../auth.entity';

@ObjectType({
  implements: [ErrorResponse],
})
export class SocialNotRegisteredResponse extends ErrorResponse {
  @Field((_type) => SocialProviderTypes)
  provider: SocialProviderTypes;

  constructor(partial?: Partial<SocialNotRegisteredResponse>) {
    super('No account registered with this social provider.');
    Object.assign(this, partial);
  }
}
