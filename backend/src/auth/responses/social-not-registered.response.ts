import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../../graphql/interface/error-response.interface';
import { SocialAuthProviderTypes } from '../auth.entity';

@ObjectType({
  implements: [ErrorResponse],
})
export class SocialNotRegisteredResponse extends ErrorResponse {
  @Field((_type) => SocialAuthProviderTypes)
  provider: SocialAuthProviderTypes;

  constructor(partial?: Partial<SocialNotRegisteredResponse>) {
    super('No account registered with this social provider.');
    Object.assign(this, partial);
  }
}
