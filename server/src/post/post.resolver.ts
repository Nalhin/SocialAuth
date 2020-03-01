import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { AddPostInput } from './input/add-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserDecorator } from '../decorators/current-user.decorator';
import { User } from '../user/user.entity';

@Resolver(of => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(returns => [Post])
  async posts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Mutation(returns => Post)
  @UseGuards(GqlAuthGuard)
  async addPost(
    @Args('addPostInput') addPostInput: AddPostInput,
    @CurrentUserDecorator() user: User,
  ): Promise<Post> {
    console.log(user);
    return this.postService.save(addPostInput, user);
  }
}
