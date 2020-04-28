import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InputValidationException } from '../exceptions/input-validation.exception';
import { InvalidInputResponse } from '../../graphql/response/invalid-input.response';

@Catch(InputValidationException)
export class InputValidationExceptionFilter implements GqlExceptionFilter {
  catch(exception: InputValidationException, host: ArgumentsHost) {
    const { errors } = exception;
    const resp = new InvalidInputResponse({
      errors,
      message: 'Invalid input provided',
    });
    return [resp];
  }
}
