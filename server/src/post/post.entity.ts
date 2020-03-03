import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from '../user/user.entity';
import { Tag } from '../tag/tag.entity';

@ObjectType()
@Entity()
export class Post {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column('varchar')
  public content: string;

  @Field(type => User)
  @ManyToOne(type => User)
  @JoinColumn()
  public author: User;

  @Field()
  @CreateDateColumn()
  public creationDate: Date;

  @Field(type => [Tag])
  @ManyToMany(
    type => Tag,
    tag => tag.posts,
    {
      cascade: ['insert', 'update'],
    },
  )
  public tags: Tag[];

  @Field(type => [User], { nullable: false })
  @ManyToMany(type => User)
  public upvotedBy: User[];
}
