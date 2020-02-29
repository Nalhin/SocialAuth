import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserRegisterInput } from '../graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('users')
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query('user')
  async user(@Args('username') userName: string): Promise<User> {
    return this.userService.findOneByUsername(userName);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Mutation('createUser')
  async createUser(@Args('input') userInput: UserRegisterInput): Promise<User> {
    return this.userService.save(userInput);
  }

  @Mutation('removeUser')
  async removeUser(@Args('id') id: number): Promise<User> {
    return this.userService.remove(id);
  }
}
