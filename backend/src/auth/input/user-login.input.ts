import { Field, InputType } from 'type-graphql';
import { User } from '../../user/user.entity';

@InputType()
export class UserLoginInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  password: string;
}
