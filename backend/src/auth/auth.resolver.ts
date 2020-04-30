import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from './inputs/login-user.input';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './inputs/register-user.input';
import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { InputValidationPipe } from '../common/pipes/input-validation.pipe';
import { InputValidationExceptionFilter } from '../common/filters/input-validation-exception.filter';
import { RegisterUserResultUnion } from './results/register-user.result';
import { InvalidCredentialsResponse } from './responses/invalid-credentials.response';
import { LoginUserResultUnion } from './results/login-user.result';
import { CredentialsTakenResponse } from './responses/credentials-taken.response';
import { SocialProfile } from '../common/decorators/social-profile.decorator';
import { SocialAuthGuard } from '../common/guards/social-auth.guard';
import { Profile } from 'passport';
import { RegisterSocialInput } from './inputs/register-social.input';
import { LoginSocialInput } from './inputs/login-social.input';
import { Input } from '../graphql/args/input.args';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => [LoginUserResultUnion])
  async login(
    @Input() input: LoginUserInput,
  ): Promise<Array<typeof LoginUserResultUnion>> {
    try {
      const user = await this.authService.validateCredentials(
        input.username,
        input.password,
      );
      const authUser = await this.authService.signToken(user);
      return [authUser];
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        return [
          new InvalidCredentialsResponse({
            message: 'Invalid credentials provided.',
            providedUsername: input.username,
          }),
        ];
      }
    }
  }

  @UseFilters(new InputValidationExceptionFilter())
  @UsePipes(new InputValidationPipe())
  @Mutation((returns) => [RegisterUserResultUnion])
  async register(
    @Input() input: RegisterUserInput,
  ): Promise<Array<typeof RegisterUserResultUnion>> {
    try {
      const authUser = await this.authService.registerUser(input);
      return [authUser];
    } catch (e) {
      if (e instanceof UnprocessableEntityException) {
        return [
          new CredentialsTakenResponse({
            message: 'Credentials are already taken.',
            providedEmail: input.email,
            providedUsername: input.username,
          }),
        ];
      }
    }
  }

  @UseGuards(SocialAuthGuard)
  @Mutation((returns) => [RegisterUserResultUnion])
  async registerSocial(
    @SocialProfile() profile: Profile,
    @Input() input: RegisterSocialInput,
  ): Promise<Array<typeof RegisterUserResultUnion>> {
    try {
      const user = await this.authService.registerSocial(
        profile,
        input.provider,
      );
      return [user];
    } catch (e) {}
  }

  @UseGuards(SocialAuthGuard)
  @Mutation((returns) => [RegisterUserResultUnion])
  async loginSocial(
    @SocialProfile() profile: Profile,
    @Input() input: LoginSocialInput,
  ): Promise<Array<typeof RegisterUserResultUnion>> {
    try {
      const user = await this.authService.loginSocial(profile);
      return [user];
    } catch (e) {}
  }
}
