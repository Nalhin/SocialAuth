import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from './types/auth-user';
import { UserLoginInput } from './input/user-login.input';
import { AuthService } from './auth.service';
import { UserRegisterInput } from './input/user-register.input';

@Resolver(of => AuthUser)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => AuthUser)
  async login(
    @Args('userLoginInput') userLoginInput: UserLoginInput,
  ): Promise<AuthUser> {
    const user = await this.authService.validateUser(
      userLoginInput.username,
      userLoginInput.password,
    );
    return this.authService.signToken(user);
  }

  @Mutation(returns => AuthUser)
  async register(
    @Args('userRegisterInput')
    userRegisterInput: UserRegisterInput,
  ): Promise<AuthUser> {
    return this.authService.registerUser(userRegisterInput);
  }
}
