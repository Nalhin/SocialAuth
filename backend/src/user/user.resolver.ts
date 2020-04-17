import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ID } from 'type-graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserDecorator } from '../decorators/current-user.decorator';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(returns => User)
  async user(@Args('username') username: string): Promise<User> {
    return this.userService.findOneByUsername(username);
  }

  @Query(returns => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUserDecorator() user: User): Promise<User> {
    return user;
  }

  @Mutation(returns => User)
  @UseGuards(GqlAuthGuard)
  async removeUser(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<User> {
    return this.userService.remove(id);
  }
}
