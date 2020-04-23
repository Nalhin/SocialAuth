import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { Post } from '../post/post.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar', { unique: true })
  username: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field(type => [Tag, { nullable: true }])
  @ManyToMany(
    type => Tag,
    (tag: Tag) => tag.followers,
  )
  followedTags: Tag[];

  @Field(type => [Post, { nullable: true }])
  @ManyToMany(
    type => Post,
    (post: Post) => post.upvotedBy,
  )
  upvotedPosts: Post[];
}
