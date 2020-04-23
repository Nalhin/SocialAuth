import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { UseGuards } from '@nestjs/common';
import { User } from '../user/user.entity';
import { GqlUser } from '../common/decorators/gql-user.decorator';
import { GqlAuthGuard } from '../common/guard/gql-auth.guard';

@Resolver(of => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(returns => [Tag])
  async tags(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  @Mutation(returns => Tag)
  @UseGuards(GqlAuthGuard)
  async followTag(
    @GqlUser() user: User,
    @Args({ name: 'id', type: () => ID }) tagId: number,
  ): Promise<Tag> {
    return this.tagService.addFollower(user, tagId);
  }
}
