import { Field, InputType } from '@nestjs/graphql';
import { SocialProviderTypes } from '../auth.entity';

@InputType()
export class LoginSocialInput {
  @Field()
  accessToken: string;

  @Field((_type) => SocialProviderTypes)
  provider: SocialProviderTypes;
}
