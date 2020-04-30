import { Field, InputType } from '@nestjs/graphql';
import { LoginSocialInput } from './login-social.input';

@InputType()
export class RegisterSocialInput extends LoginSocialInput {
  @Field()
  username: string;
}
