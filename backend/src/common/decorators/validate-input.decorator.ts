import { applyDecorators, UseFilters, UsePipes } from '@nestjs/common';
import { InputValidationPipe } from '../pipes/input-validation.pipe';
import { InputValidationExceptionFilter } from '../filters/input-validation-exception.filter';

export function ValidateInput() {
  return applyDecorators(
    UsePipes(InputValidationPipe),
    UseFilters(InputValidationExceptionFilter),
  );
}
