import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column( { unique: true })
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
  @JoinTable()
  followedTags: Tag[];

  @Field(type => [Post, { nullable: true }])
  @ManyToMany(
    type => Post,
    (post: Post) => post.upvotedBy,
  )
  @JoinTable()
  upvotedPosts: Post[];
}
