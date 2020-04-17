import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Tag {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column('varchar', { unique: true })
  public name: string;

  @Field(type => [Post])
  @ManyToMany(
    type => Post,
    (post: Post) => post.tags,
  )
  public posts: Post[];

  @Field(type => [User])
  @ManyToMany(
    type => User,
    (user: User) => user.followedTags,
  )
  public followers: User[];
}
