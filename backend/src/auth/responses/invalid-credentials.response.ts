import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../../graphql/interface/error-response.interface';

@ObjectType({
  implements: [ErrorResponse],
})
export class InvalidCredentialsResponse extends ErrorResponse {
  @Field()
  providedUsername: string;

  constructor(partial?: Partial<InvalidCredentialsResponse>) {
    super();
    Object.assign(this, partial);
  }
}
