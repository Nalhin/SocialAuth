import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from './inputs/login-user.input';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './inputs/register-user.input';
import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { InputValidationPipe } from '../common/pipes/input-validation.pipe';
import { InputValidationExceptionFilter } from '../common/filters/input-validation-exception.filter';
import { RegisterUserResultUnion } from './results/register-user.result';
import { InvalidCredentialsResponse } from './responses/invalid-credentials.response';
import { LoginUserResultUnion } from './results/login-user.result';
import { CredentialsTakenResponse } from './responses/credentials-taken.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => [LoginUserResultUnion])
  async login(
    @Args('loginUserInput') userLoginInput: LoginUserInput,
  ): Promise<Array<typeof LoginUserResultUnion>> {
    try {
      const user = await this.authService.validateCredentials(
        userLoginInput.username,
        userLoginInput.password,
      );
      const authUser = await this.authService.signToken(user);
      return [authUser];
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        return [
          new InvalidCredentialsResponse({
            message: 'Invalid credentials provided.',
            providedUsername: userLoginInput.username,
          }),
        ];
      }
    }
  }

  @UseFilters(new InputValidationExceptionFilter())
  @UsePipes(new InputValidationPipe())
  @Mutation((returns) => [RegisterUserResultUnion])
  async register(
    @Args('registerUserInput')
    registerUserInput: RegisterUserInput,
  ): Promise<Array<typeof RegisterUserResultUnion>> {
    try {
      const authUser = await this.authService.registerUser(registerUserInput);
      return [authUser];
    } catch (e) {
      if (e instanceof UnprocessableEntityException) {
        return [
          new CredentialsTakenResponse({
            message: 'Credentials are already taken.',
            providedEmail: registerUserInput.email,
            providedUsername: registerUserInput.username,
          }),
        ];
      }
    }
  }
}
