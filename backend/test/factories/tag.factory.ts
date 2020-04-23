import { Factory } from 'factory.io';
import { Tag } from '../../src/tag/tag.entity';
import * as faker from 'faker';

export const tagFactory = new Factory(Tag)
  .options({ idField: 'id' })
  .props({ name: faker.random.word, followers: [] })
  .done();
