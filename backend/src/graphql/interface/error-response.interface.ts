import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class ErrorResponse {
  @Field()
  message: string;
}
