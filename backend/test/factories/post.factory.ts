import { Post } from '../../src/post/post.entity';
import * as faker from 'faker';
import { FactoryBuilder } from 'factory.io';

export const postFactory = FactoryBuilder.of(Post)
  .options({ sequenceField: 'id' })
  .props({
    content: () => faker.random.words(2),
    created: faker.date.recent,
  })
  .build();
