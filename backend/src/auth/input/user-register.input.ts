import { Field, InputType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@InputType()
export class UserRegisterInput implements Partial<User> {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  email: string;
}
