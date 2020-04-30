import { Field, InputType } from '@nestjs/graphql';
import { SocialAuthProviders } from '../auth.entity';

@InputType()
export class LoginSocialInput {
  @Field()
  accessToken: string;

  @Field((type) => SocialAuthProviders)
  provider: SocialAuthProviders;
}
