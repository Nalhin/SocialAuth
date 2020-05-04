import { InputError } from 'src/graphql/responses/invalid-input.error';

export class InputValidationException extends Error {
  errors: InputError[];

  constructor(errors: InputError[]) {
    super();
    this.errors = errors;
  }
}
