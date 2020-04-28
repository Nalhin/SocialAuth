import { InputError } from 'src/graphql/response/invalid-input.response';

export class InputValidationException {
  errors: InputError[];

  constructor(partial?: Partial<InputValidationException>) {
    Object.assign(this, partial);
  }
}
