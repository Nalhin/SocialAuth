import { User } from '../../user/user.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserLoginInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  password: string;
}
