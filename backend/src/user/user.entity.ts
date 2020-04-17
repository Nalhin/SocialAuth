import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Tag } from '../tag/tag.entity';
import { Post } from '../post/post.entity';

@ObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column('varchar', { unique: true })
  public username: string;

  @Field()
  @Column('varchar')
  public email: string;

  @Column('varchar')
  public password: string;

  @Field(type => [Tag, { nullable: true }])
  @ManyToMany(
    type => Tag,
    (tag: Tag) => tag.followers,
  )
  public followedTags: Tag[];

  @Field(type => [Post, { nullable: true }])
  @ManyToMany(
    type => Post,
    (post: Post) => post.upvotedBy,
  )
  public upvotedPosts: Post[];
}
