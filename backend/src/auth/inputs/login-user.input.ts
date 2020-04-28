import { InputType, PickType } from '@nestjs/graphql';
import { RegisterUserInput } from './register-user.input';

@InputType()
export class LoginUserInput extends PickType(RegisterUserInput, [
  'username',
  'password',
]) {}
