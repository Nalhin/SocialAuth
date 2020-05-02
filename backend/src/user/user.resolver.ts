import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlUser } from '../common/decorators/gql-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((_returns) => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query((_returns) => User)
  async user(@Args('username') username: string): Promise<User> {
    return this.userService.findOneByUsername(username);
  }

  @Query((_returns) => User)
  @UseGuards(JwtAuthGuard)
  async me(@GqlUser() user: User): Promise<User> {
    return user;
  }

  @Mutation((_returns) => User)
  @UseGuards(JwtAuthGuard)
  async removeUser(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<User> {
    return this.userService.remove(id);
  }
}
