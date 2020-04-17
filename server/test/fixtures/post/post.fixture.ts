import { Post } from '../../../src/post/post.entity';
import * as faker from 'faker';
import { User } from '../../../src/user/user.entity';
import { mockUserFactory } from '../user/user.fixture';

export function mockPostFactory({
  post,
  author,
}: {
  post?: Partial<Post>;
  author?: Partial<User>;
} = {}): Post {
  return {
    id: faker.random.number(),
    content: faker.random.words(10),
    creationDate: faker.date.recent(),
    author: mockUserFactory(author),
    tags: [],
    upvotedBy: [],
    ...post,
  };
}
