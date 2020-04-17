import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserDecorator } from '../decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { ID } from 'type-graphql';

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
    @CurrentUserDecorator() user: User,
    @Args({ name: 'id', type: () => ID }) tagId: number,
  ): Promise<Tag> {
    return this.tagService.addFollower(user, tagId);
  }
}
