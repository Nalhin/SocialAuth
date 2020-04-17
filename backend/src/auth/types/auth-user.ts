import { User } from '../../user/user.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class AuthUser extends User {
  @Field()
  token: string;
}
