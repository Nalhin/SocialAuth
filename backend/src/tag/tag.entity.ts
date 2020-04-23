import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Tag {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column( { unique: true })
  name: string;

  @Field(type => [Post])
  @ManyToMany(
    type => Post,
    (post: Post) => post.tags,
  )
  posts: Post[];

  @Field(type => [User])
  @ManyToMany(
    type => User,
    (user: User) => user.followedTags,
  )
  followers: User[];
}
