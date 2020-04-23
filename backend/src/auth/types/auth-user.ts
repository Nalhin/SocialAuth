import { User } from '../../user/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthUser extends User {
  @Field()
  token: string;
}
