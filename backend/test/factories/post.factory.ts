import { Factory } from 'factory.io';
import { Post } from '../../src/post/post.entity';
import * as faker from 'faker';

export const postFactory = new Factory(Post)
  .options({ idField: 'id' })
  .props({
    content: () => faker.random.words(2),
    created: faker.date.recent,
    tags: [],
    upvotedBy: []
  })
  .done();
