import { Field, InputType } from 'type-graphql';
import { Post } from '../post.entity';

@InputType()
export class AddPostInput implements Partial<Post> {
  @Field()
  content: string;
}
