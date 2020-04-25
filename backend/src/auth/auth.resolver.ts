import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserLoginInput } from './input/user-login.input';
import { AuthService } from './auth.service';
import { UserRegisterInput } from './input/user-register.input';
import { AuthUserResponse } from './response/auth-user.response';

@Resolver((of) => AuthUserResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => AuthUserResponse)
  async login(
    @Args('userLoginInput') userLoginInput: UserLoginInput,
  ): Promise<AuthUserResponse> {
    const user = await this.authService.validateCredentials(
      userLoginInput.username,
      userLoginInput.password,
    );
    return this.authService.signToken(user);
  }

  @Mutation((returns) => AuthUserResponse)
  async register(
    @Args('userRegisterInput')
    userRegisterInput: UserRegisterInput,
  ): Promise<AuthUserResponse> {
    return this.authService.registerUser(userRegisterInput);
  }
}
