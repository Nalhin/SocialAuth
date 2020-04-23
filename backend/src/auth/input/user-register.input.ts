import { User } from '../../user/user.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserRegisterInput implements Partial<User> {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  email: string;
}
