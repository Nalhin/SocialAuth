import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';
import { MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput extends PickType(PartialType(User, InputType), [
  'username',
  'email',
]) {
  @Field()
  @MinLength(6)
  password: string;
}
