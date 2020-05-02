import { Field, InputType } from '@nestjs/graphql';
import { SocialAuthProviderTypes } from '../auth.entity';

@InputType()
export class LoginSocialInput {
  @Field()
  accessToken: string;

  @Field((_type) => SocialAuthProviderTypes)
  provider: SocialAuthProviderTypes;
}
