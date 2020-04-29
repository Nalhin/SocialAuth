import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { AddPostInput } from './input/add-post.input';
import { UseGuards } from '@nestjs/common';
import { User } from '../user/user.entity';
import { GqlUser } from '../common/decorators/gql-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Resolver((of) => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query((returns) => [Post])
  async posts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Post)
  async addPost(
    @Args('addPostInput') addPostInput: AddPostInput,
    @GqlUser() user: User,
  ): Promise<Post> {
    return this.postService.save(addPostInput, user);
  }
}
