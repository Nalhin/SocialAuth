import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';
import { MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput extends PickType(
  User,
  ['username', 'email'],
  InputType,
) {
  @Field()
  @MinLength(6)
  password: string;
}
