import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class ErrorResponse {
  @Field()
  message: string;

  protected constructor(message?: string) {
    if (message) {
      this.message = message;
    }
  }
}
