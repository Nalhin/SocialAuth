import { Injectable, ValidationError, ValidationPipe } from '@nestjs/common';
import { InputValidationException } from '../exceptions/input-validation.exception';

@Injectable()
export class InputValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const parsedErrors = errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints),
        }));
        return new InputValidationException(parsedErrors);
      },
    });
  }
}
