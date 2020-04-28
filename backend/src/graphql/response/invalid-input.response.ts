import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../interface/error-response.interface';

@ObjectType()
export class InputError {
  @Field()
  field: string;

  @Field((type) => [String])
  messages: string[];
}

@ObjectType({
  implements: [ErrorResponse],
})
export class InvalidInputResponse extends ErrorResponse {
  @Field((type) => [InputError])
  errors: InputError[];

  constructor(partial?: Partial<InvalidInputResponse>) {
    super();
    Object.assign(this, partial);
  }
}
