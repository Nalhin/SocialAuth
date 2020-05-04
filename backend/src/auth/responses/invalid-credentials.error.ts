import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../../graphql/interfaces/error-response.interface';

@ObjectType({
  implements: [ErrorResponse],
})
export class InvalidCredentialsError extends ErrorResponse {
  @Field()
  providedUsername: string;

  constructor(partial?: Partial<InvalidCredentialsError>) {
    super('Invalid credentials provided.');
    Object.assign(this, partial);
  }
}
