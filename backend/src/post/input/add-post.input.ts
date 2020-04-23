import { Post } from '../post.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddPostInput implements Partial<Post> {
  @Field()
  content: string;
}
