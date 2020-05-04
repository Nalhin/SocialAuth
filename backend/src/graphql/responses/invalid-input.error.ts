import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../interfaces/error-response.interface';

@ObjectType()
export class InputError {
  @Field()
  field: string;

  @Field((_type) => [String])
  messages: string[];
}

@ObjectType({
  implements: [ErrorResponse],
})
export class InvalidInputError extends ErrorResponse {
  @Field((_type) => [InputError])
  errors: InputError[];

  constructor(errors: InputError[]) {
    super('Invalid input provided.');
    this.errors = errors;
  }
}
