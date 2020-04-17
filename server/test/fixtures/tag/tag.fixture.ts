import { Tag } from '../../../src/tag/tag.entity';
import { User } from '../../../src/user/user.entity';
import { Post } from '../../../src/post/post.entity';
import * as faker from 'faker';

export function mockTagFactory({
  tag,
  followers,
  posts,
}: { tag?: Partial<Tag>; followers?: [User]; posts?: [Post] } = {}): Tag {
  return {
    id: faker.random.number(),
    name: faker.random.word(),
    posts: posts ?? [],
    followers: followers ?? [],
    ...tag,
  };
}
